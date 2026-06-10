export type ToolStatus = "available" | "coming-soon";

export type Tool = {
  id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  status: ToolStatus;
  href: string;
  featured?: boolean;
  icon: string;
};

export const tools: Tool[] = [
  {
    id: "pdf-color-bw-splitter",
    slug: "pdf-color-bw-splitter",
    title: "Pisah PDF Warna & Hitam Putih",
    name: "Pisah PDF Warna & Hitam Putih",
    description: "Pisahkan halaman PDF berwarna dan hitam-putih menjadi dua file berbeda agar biaya print lebih hemat.",
    category: "PDF",
    tags: ["PDF", "Gratis", "Print"],
    status: "available",
    href: "/tools/pdf-color-bw-splitter",
    featured: true,
    icon: "PDF",
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    title: "Kompres PDF",
    name: "Kompres PDF",
    description: "Perkecil ukuran PDF agar lebih mudah diupload ke email, formulir, atau sistem administrasi.",
    category: "PDF",
    tags: ["PDF", "Kompres", "Upload"],
    status: "available",
    href: "/tools/compress-pdf",
    icon: "PDF",
  },
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    title: "Gabungkan PDF",
    name: "Gabungkan PDF",
    description: "Gabungkan beberapa file PDF menjadi satu dokumen yang rapi dan siap dikirim.",
    category: "PDF",
    tags: ["PDF", "Gabung", "Dokumen"],
    status: "available",
    href: "/tools/merge-pdf",
    icon: "PDF",
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    title: "JPG/PNG ke PDF",
    name: "JPG/PNG ke PDF",
    description: "Ubah gambar JPG atau PNG menjadi satu file PDF untuk scan dokumen dari HP.",
    category: "Gambar",
    tags: ["Gambar", "PDF", "Scan"],
    status: "available",
    href: "/tools/jpg-to-pdf",
    icon: "IMG",
  },
  {
    id: "pdf-to-jpg",
    slug: "pdf-to-jpg",
    title: "PDF ke JPG",
    name: "PDF ke JPG",
    description: "Konversi setiap halaman PDF menjadi gambar JPG dalam satu file ZIP.",
    category: "Konversi",
    tags: ["PDF", "Gambar", "ZIP"],
    status: "available",
    href: "/tools/pdf-to-jpg",
    icon: "JPG",
  },
  {
    id: "compress-image",
    slug: "compress-image",
    title: "Kompres Gambar",
    name: "Kompres Gambar",
    description: "Perkecil ukuran JPG/PNG untuk upload formulir, profil, atau katalog produk.",
    category: "Gambar",
    tags: ["Gambar", "Kompres"],
    status: "available",
    href: "/tools/compress-image",
    icon: "IMG",
  },
  {
    id: "resize-image",
    slug: "resize-image",
    title: "Resize Gambar",
    name: "Resize Gambar",
    description: "Ubah dimensi gambar ke ukuran yang dibutuhkan untuk dokumen atau media sosial.",
    category: "Gambar",
    tags: ["Gambar", "Resize"],
    status: "available",
    href: "/tools/resize-image",
    icon: "IMG",
  },
  {
    id: "rotate-pdf",
    slug: "rotate-pdf",
    title: "Putar PDF",
    name: "Putar PDF",
    description: "Putar halaman PDF ke kiri atau kanan sesuai kebutuhan.",
    category: "PDF",
    tags: ["PDF"],
    status: "coming-soon",
    href: "/tools",
    icon: "↻",
  },
];

export function getAvailableTools() {
  return tools.filter((tool) => tool.status === "available");
}

export function getFeaturedTool() {
  return tools.find((tool) => tool.featured) ?? getAvailableTools()[0];
}




