const SITE_URL = "https://arnol.my.id";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arnol Works",
    url: SITE_URL,
    description: "Kumpulan utilitas PDF dan gambar yang bisa langsung dipakai. Gratis, tanpa login.",
    inLanguage: "id",
  };
}

export function webAppSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${url}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    inLanguage: "id",
  };
}