export const SITE_URL = "https://tribamondo.fr";
export const SITE_NAME = "TriBa MonDo";

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  path: string;
}

export const pageSEO: Record<string, PageSEO> = {
  "/": {
    title: "TriBa MonDo - Fusion Musicale | Chants & Musiques du Monde",
    description:
      "TriBa MonDo, groupe parisien de fusion musicale fondé en 2018. Chants du monde, percussions, voix, oud et textures électroniques. Traditions méditerranéennes, brésiliennes et du monde réinventées.",
    keywords: [
      "Triba Mondo",
      "musique du monde",
      "fusion musicale",
      "world music Paris",
      "percussions",
      "chants du monde",
      "improvisation",
      "Champigny-sur-Marne",
      "Île-de-France",
      "drum and bass",
      "oud",
    ],
    path: "/",
  },
  "/concerts": {
    title: "Prochains Concerts - TriBa MonDo | Agenda & Billetterie",
    description:
      "Vivez l'expérience TriBa MonDo en live. Retrouvez nos prochaines dates de concerts, festivals et événements culturels. Musique du monde fusion et électro organique.",
    keywords: [
      "concerts TriBa MonDo",
      "musique live Paris",
      "festival musique du monde",
      "agenda concerts 94",
      "spectacle Pulsations du Monde",
    ],
    path: "/concerts",
  },
  "/legroupe": {
    title: "Le Groupe - TriBa MonDo | L'Histoire & les Artistes",
    description:
      "Rencontrez les musiciens de TriBa MonDo : Fred André, Emmanuelle Gabarra et Marcel Hamon. Un trio fusionnant traditions ancestrales et modernité électro.",
    keywords: [
      "musiciens fusion",
      "Fred André",
      "Emmanuelle Gabarra",
      "Marcel Hamon",
      "biographie groupe musique",
      "Conservatoire Champigny",
    ],
    path: "/legroupe",
  },
  "/musique": {
    title: "Musique - TriBa MonDo | Écouter & Découvrir",
    description:
      "Écoutez les créations de TriBa MonDo : Trøllabundin (cover Eivør), Itrun Nada, Avenu Malkeinu, La Rosa Enflorece. Une fusion unique de chants ancestraux et de pulsations électro contemporaines.",
    keywords: [
      "musique TriBa MonDo",
      "Trøllabundin Eivør cover",
      "Itrun Nada",
      "Avenu Malkeinu",
      "La Rosa Enflorece",
      "live recordings world music",
      "electro organique",
    ],
    path: "/musique",
  },
  "/contact": {
    title: "Contact - TriBa MonDo | Booking & Collaborations",
    description:
      "Contactez TriBa MonDo pour vos concerts, festivals, événements culturels et collaborations artistiques. Groupe de fusion musicale basé en région parisienne.",
    keywords: [
      "contact TriBa MonDo",
      "booking musique du monde",
      "événement musical",
      "collaboration artistique",
      "échanges culturels",
    ],
    path: "/contact",
  },
};

export const routes = Object.keys(pageSEO);

export const groupInfo = {
  name: "TriBa MonDo",
  description:
    "Groupe parisien de fusion musicale. Chants du monde, percussions, voix et textures électroniques. Traditions & innovations réinventées depuis 2018.",
  url: SITE_URL,
  email: "tribamondo@gmail.com",
  address: {
    addressLocality: "Champigny-sur-Marne",
    postalCode: "94500",
    addressCountry: "FR",
  },
  geo: {
    latitude: 48.8177,
    longitude: 2.5156,
  },
  foundingDate: "2018-04",
  image: `${SITE_URL}/images/opengraph.png`,
  sameAs: [
    "https://www.instagram.com/triba_mondo/",
    "https://soundcloud.com/tribamondo",
    "https://www.youtube.com/@TriBaMonDo",
    "https://www.facebook.com/61575204444067/",
    "https://x.com/Fred_Batteur",
  ],
};

export function generateJsonLd(path: string = "/", data?: any) {
  const baseGraph: any[] = [
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/#group`,
      "name": groupInfo.name,
      "description": groupInfo.description,
      "url": groupInfo.url,
      "email": groupInfo.email,
      "foundingDate": groupInfo.foundingDate,
      "genre": [
        "World Music",
        "Fusion",
        "Musique du Monde",
        "World Fusion",
        "Chants du Monde"
      ],
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          ...groupInfo.address
        }
      },
      "image": groupInfo.image,
      "sameAs": groupInfo.sameAs,
      "member": [
        {
          "@type": "Person",
          "name": "Fred André",
          "jobTitle": "Percussions, choeur, direction artistique"
        },
        {
          "@type": "Person",
          "name": "Marcel Hamon",
          "jobTitle": "Clavier, percussions, choeur"
        },
        {
          "@type": "Person",
          "name": "Paule-Emmanuelle Gabarra",
          "jobTitle": "Chant, clavier, percussions"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "publisher": { "@id": `${SITE_URL}/#group` }
    }
  ];

  if (path === "/concerts" && data?.concerts) {
    const upcoming = data.concerts.filter((c: any) => !c.isPast);
    const events = upcoming.map((c: any) => ({
      "@type": "MusicEvent",
      "name": c.title,
      "startDate": c.date,
      "location": {
        "@type": "Place",
        "name": c.venue,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": c.address
        }
      },
      "description": c.description,
      "offers": {
        "@type": "Offer",
        "price": c.price.includes("€") ? c.price.replace(/[^0-9.]/g, "") : "0",
        "priceCurrency": "EUR",
        "url": c.ticketUrl || `${SITE_URL}/concerts`
      },
      "performer": { "@id": `${SITE_URL}/#group` }
    }));
    baseGraph.push(...events);
  }

  if (path === "/musique" && data?.videos) {
    const videos = data.videos.map((v: any) => ({
      "@type": "VideoObject",
      "name": v.title,
      "description": v.description,
      "thumbnailUrl": `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`,
      "contentUrl": `https://www.youtube.com/watch?v=${v.youtubeId}`,
      "embedUrl": `https://www.youtube.com/embed/${v.youtubeId}`,
      "uploadDate": "2024-01-01T08:00:00+08:00"
    }));
    baseGraph.push(...videos);
  }

  return {
    "@context": "https://schema.org",
    "@graph": baseGraph
  };
}

export function generateSitemap(): string {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = routes.map((path) => {
    const priority = path === "/" ? "1.0" : "0.8";
    const changefreq = path === "/" ? "weekly" : "monthly";
    return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}
