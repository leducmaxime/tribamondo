import { render, route, layout } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { MainLayout } from "@/app/layouts/MainLayout";
import { Home } from "@/app/pages/Home";
import { LeGroupe } from "@/app/pages/LeGroupe";
import { Musique } from "@/app/pages/Musique";
import { Concerts } from "@/app/pages/Concerts";
import { Contact } from "@/app/pages/Contact";
import { AdminLogin } from "@/app/pages/admin/Login";
import { AdminDashboard } from "@/app/pages/admin/Dashboard";
import { ConcertsAdmin } from "@/app/pages/admin/ConcertsAdmin";
import { VideosAdmin } from "@/app/pages/admin/VideosAdmin";
import { generateSitemap, generateRobotsTxt } from "@/app/seo";
import { concerts, tracks } from "@/app/data";
import { hashPassword, generateToken, verifyToken } from "@/app/api/auth-utils";
import { requireAuth } from "@/app/api/middleware";

import { SoundCloudAdmin } from "@/app/pages/admin/SoundCloudAdmin";

const DocumentWithPath = ({ children, path, data }: { children: React.ReactNode; path: string; data?: any }) => (
  <Document path={path} data={data}>{children}</Document>
);

const app = defineApp([
  setCommonHeaders(),

  route("/api/auth/login", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    
    if (info.request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body = await info.request.json();
      const { username, password } = body;

      if (!username || !password) {
        return new Response(JSON.stringify({ success: false, error: "Username and password required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await env.DB.prepare("SELECT * FROM admin_users WHERE username = ?")
        .bind(username)
        .first();

      if (!result) {
        return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const passwordHash = await hashPassword(password);

      if (passwordHash !== result.password_hash) {
        return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = await generateToken(username);

      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
        },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ success: false, error: `Login failed: ${error.message}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),

  route("/api/auth/check", async (info: any) => {
    const { request } = info;
    try {
      const cookie = request.headers.get("Cookie");
      let authenticated = false;
      let username: string | undefined;

      if (cookie) {
        const match = cookie.match(/auth_token=([^;]+)/);
        if (match) {
          const result = await verifyToken(match[1]);
          authenticated = result.valid;
          username = result.username;
        }
      }

      return new Response(JSON.stringify({ authenticated, username }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),

  route("/api/concerts", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request } = info;

    if (request.method === "GET") {
      try {
        const result = await env.DB.prepare("SELECT * FROM concerts ORDER BY date ASC").all();
        return new Response(JSON.stringify({ success: true, data: result.results }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch concerts" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "POST") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { date, dayOfWeek, time, title, venue, address, description, price, ticket_url, image_url, reservation_phone, reservation_required } = body;

        const result = await env.DB.prepare(
          "INSERT INTO concerts (date, dayOfWeek, time, title, venue, address, description, price, ticket_url, image_url, reservation_phone, reservation_required) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
          .bind(date, dayOfWeek || null, time || null, title, venue, address || null, description || null, price || null, ticket_url || null, image_url || null, reservation_phone || null, reservation_required ? 1 : 0)
          .run();

        return new Response(JSON.stringify({ success: true, data: { id: result.meta.last_row_id } }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to create concert" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/api/concerts/:id", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request, params } = info;
    const id = parseInt(params.id);

    if (request.method === "DELETE") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        await env.DB.prepare("DELETE FROM concerts WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to delete concert" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "PUT") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { date, dayOfWeek, time, title, venue, address, description, price, ticket_url, image_url, reservation_phone, reservation_required } = body;

        await env.DB.prepare(
          "UPDATE concerts SET date = ?, dayOfWeek = ?, time = ?, title = ?, venue = ?, address = ?, description = ?, price = ?, ticket_url = ?, image_url = ?, reservation_phone = ?, reservation_required = ? WHERE id = ?"
        )
          .bind(date, dayOfWeek || null, time || null, title, venue, address || null, description || null, price || null, ticket_url || null, image_url || null, reservation_phone || null, reservation_required ? 1 : 0, id)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to update concert" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/api/soundcloud", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request } = info;

    if (request.method === "GET") {
      try {
        const result = await env.DB.prepare("SELECT * FROM soundcloud_tracks ORDER BY order_index ASC").all();
        return new Response(JSON.stringify({ success: true, data: result.results }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch tracks" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "POST") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { title, description, url, order_index } = body;

        const result = await env.DB.prepare(
          "INSERT INTO soundcloud_tracks (title, description, url, order_index) VALUES (?, ?, ?, ?)"
        )
          .bind(title, description || null, url, order_index || 1)
          .run();

        return new Response(JSON.stringify({ success: true, data: { id: result.meta.last_row_id } }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to create track" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/api/soundcloud/:id", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request, params } = info;
    const id = parseInt(params.id);

    if (request.method === "DELETE") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        await env.DB.prepare("DELETE FROM soundcloud_tracks WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to delete track" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "PUT") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { title, description, url, order_index } = body;

        await env.DB.prepare(
          "UPDATE soundcloud_tracks SET title = ?, description = ?, url = ?, order_index = ? WHERE id = ?"
        )
          .bind(title, description || null, url, order_index || 1, id)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to update track" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/api/videos", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request } = info;

    if (request.method === "GET") {
      try {
        const result = await env.DB.prepare("SELECT * FROM youtube_videos ORDER BY order_index ASC").all();
        return new Response(JSON.stringify({ success: true, data: result.results }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch videos" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "POST") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { youtube_id, title, type, description, order_index } = body;

        const result = await env.DB.prepare(
          "INSERT INTO youtube_videos (youtube_id, title, type, description, order_index) VALUES (?, ?, ?, ?, ?)"
        )
          .bind(youtube_id, title, type, description || null, order_index || 0)
          .run();

        return new Response(JSON.stringify({ success: true, data: { id: result.meta.last_row_id } }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to create video" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/api/videos/:id", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request, params } = info;
    const id = parseInt(params.id);

    if (request.method === "DELETE") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        await env.DB.prepare("DELETE FROM youtube_videos WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to delete video" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "PUT") {
      const auth = await requireAuth(request);
      if (!auth.authorized) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const body = await request.json();
        const { youtube_id, title, type, description, order_index } = body;

        await env.DB.prepare(
          "UPDATE youtube_videos SET youtube_id = ?, title = ?, type = ?, description = ?, order_index = ? WHERE id = ?"
        )
          .bind(youtube_id, title, type, description || null, order_index || 0, id)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Failed to update video" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }),

  route("/media/:filename", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { params } = info;
    const file = await env.MEDIA.get(params.filename);

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    const headers = new Headers();
    file.writeHttpMetadata(headers);
    headers.set("etag", file.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(file.body, { headers });
  }),

  route("/api/upload", async (info: any) => {
    const env = (globalThis as any).__WORKER_ENV__;
    const { request } = info;

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405 });
    }

    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return new Response(JSON.stringify({ success: false, error: "No file provided" }), { status: 400 });
      }

      const extension = file.name.split('.').pop();
      const filename = `${crypto.randomUUID()}.${extension}`;
      
      await env.MEDIA.put(filename, file.stream(), {
        httpMetadata: { contentType: file.type },
      });

      return new Response(JSON.stringify({ success: true, url: `/media/${filename}` }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
  }),

  route("/sitemap.xml", () => {
    return new Response(generateSitemap(), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }),

  route("/robots.txt", () => {
    return new Response(generateRobotsTxt(), {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }),

  render(({ children }) => <DocumentWithPath path="/">{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/", Home),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/legroupe">{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/legroupe", LeGroupe),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/musique" data={{ videos: (children as any).props?.children?.props?.videos, soundcloud_tracks: (children as any).props?.children?.props?.soundcloud_tracks }}>{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/musique", async () => {
        const env = (globalThis as any).__WORKER_ENV__;
        const result = await env.DB.prepare("SELECT * FROM youtube_videos ORDER BY order_index ASC").all();
        const normalizedVideos = result.results.map((v: any) => ({
          ...v,
          youtubeId: v.youtube_id
        }));

        const resultSc = await env.DB.prepare("SELECT * FROM soundcloud_tracks ORDER BY order_index ASC").all();
        const soundcloud_tracks = resultSc.results;

        return <Musique videos={normalizedVideos} soundcloud_tracks={soundcloud_tracks} />;
      }),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/concerts" data={(children as any).props?.children?.props?.concerts}>{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/concerts", async () => {
        const env = (globalThis as any).__WORKER_ENV__;
        const result = await env.DB.prepare("SELECT * FROM concerts ORDER BY date ASC").all();
        const normalizedConcerts = result.results.map((c: any) => ({
          ...c,
          ticketUrl: c.ticket_url
        }));
        return <Concerts concerts={normalizedConcerts} />;
      }),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/contact">{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/contact", Contact),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/admin">{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/admin/login", AdminLogin),
    ]),
  ]),

  render(({ children }) => <DocumentWithPath path="/admin">{children}</DocumentWithPath>, [
    layout(MainLayout, [
      route("/admin", async (info: any) => {
        const auth = await requireAuth(info.request);
        if (!auth.authorized) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/admin/login' },
          });
        }
        return <AdminDashboard />;
      }),
      route("/admin/concerts", async (info: any) => {
        const auth = await requireAuth(info.request);
        if (!auth.authorized) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/admin/login' },
          });
        }
        return <ConcertsAdmin />;
      }),
      route("/admin/videos", async (info: any) => {
        const auth = await requireAuth(info.request);
        if (!auth.authorized) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/admin/login' },
          });
        }
        return <VideosAdmin />;
      }),
      route("/admin/soundcloud", async (info: any) => {
        const auth = await requireAuth(info.request);
        if (!auth.authorized) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/admin/login' },
          });
        }
        return <SoundCloudAdmin />;
      }),
    ]),
  ]),
]);

export default {
  async fetch(request: Request, env: any, ctx: any) {
    (globalThis as any).__WORKER_ENV__ = env;
    return app.fetch(request, env, ctx);
  }
};
