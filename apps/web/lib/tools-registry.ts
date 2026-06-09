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
    tags: ["PDF", "Gratis", "Mudah Digunakan"],
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
    description: "Kompres ukuran PDF tanpa mengurangi kualitas secara berlebihan.",
    category: "PDF",
    tags: ["PDF"],
    status: "coming-soon",
    href: "/tools",
    icon: "PDF",
  },
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    title: "Gabungkan PDF",
    name: "Gabungkan PDF",
    description: "Gabungkan beberapa file PDF menjadi satu file yang rapi.",
    category: "PDF",
    tags: ["PDF"],
    status: "coming-soon",
    href: "/tools",
    icon: "PDF",
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    title: "JPG ke PDF",
    name: "JPG ke PDF",
    description: "Ubah gambar JPG atau PNG menjadi file PDF.",
    category: "Gambar",
    tags: ["Gambar", "PDF"],
    status: "coming-soon",
    href: "/tools",
    icon: "IMG",
  },
  {
    id: "pdf-to-jpg",
    slug: "pdf-to-jpg",
    title: "PDF ke JPG",
    name: "PDF ke JPG",
    description: "Konversi setiap halaman PDF menjadi gambar JPG.",
    category: "Konversi",
    tags: ["PDF", "Gambar"],
    status: "coming-soon",
    href: "/tools",
    icon: "JPG",
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
  {
    id: "remove-pages-pdf",
    slug: "remove-pages-pdf",
    title: "Hapus Halaman PDF",
    name: "Hapus Halaman PDF",
    description: "Hapus halaman yang tidak diperlukan dari PDF.",
    category: "PDF",
    tags: ["PDF"],
    status: "coming-soon",
    href: "/tools",
    icon: "DEL",
  },
  {
    id: "protect-pdf",
    slug: "protect-pdf",
    title: "Proteksi PDF",
    name: "Proteksi PDF",
    description: "Kunci PDF dengan password untuk keamanan tambahan.",
    category: "PDF",
    tags: ["PDF", "Keamanan"],
    status: "coming-soon",
    href: "/tools",
    icon: "🔒",
  },
];

export function getAvailableTools() {
  return tools.filter((tool) => tool.status === "available");
}

export function getFeaturedTool() {
  return tools.find((tool) => tool.featured) ?? getAvailableTools()[0];
}
