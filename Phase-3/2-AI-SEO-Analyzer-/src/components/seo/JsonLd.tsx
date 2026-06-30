// src\components\seo\JsonLd.tsx
export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SEO Analyzer",
    description:
      "Analyze your website's SEO performance in seconds with our free SEO Analyzer tool.",
    applicationCategory: "SEO Tool",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Gabriel Nathanael Purba",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
