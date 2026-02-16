import styles from "@/styles/globals.css?url";
import { SITE_URL, SITE_NAME, pageSEO, generateJsonLd, type PageSEO } from "./seo";

interface DocumentProps {
  children: React.ReactNode;
  path?: string;
  data?: any;
}

export const Document: React.FC<DocumentProps> = ({ children, path = "/", data }) => {
  const seo: PageSEO = pageSEO[path] || pageSEO["/"];
  const canonicalUrl = `${SITE_URL}${seo.path}`;
  const ogImageUrl = `${SITE_URL}/images/opengraph.png`;
  const jsonLd = generateJsonLd(path, data);

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{seo.title}</title>
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords.join(", ")} />
        <meta name="author" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${SITE_NAME} - Fusion Musicale`} />
        <meta property="og:locale" content="fr_FR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={`${SITE_NAME} - Fusion Musicale`} />

        <meta name="geo.region" content="FR-94" />
        <meta name="geo.placename" content="Champigny-sur-Marne" />
        <meta name="geo.position" content="48.8177;2.5156" />
        <meta name="ICBM" content="48.8177, 2.5156" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <link rel="stylesheet" href={styles} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#dc2626" />

        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body className="min-h-screen bg-[#0d0d0d] font-sans text-white">
        <div
          id="root"
          className="min-h-screen w-screen overflow-x-hidden"
        >
          {children}
        </div>
        <script type="module" src="/src/client.tsx" />
      </body>
    </html>
  );
};
