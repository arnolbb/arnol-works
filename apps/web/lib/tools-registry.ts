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
    id: "pdf-to-word",
    slug: "pdf-to-word",
    title: "PDF ke Word",
    name: "PDF ke Word",
    description: "Konversi file PDF menjadi dokumen Word (DOCX) agar bisa diedit untuk tugas, laporan, dan dokumen kantor.",
    category: "Konversi",
    tags: ["PDF", "Word", "DOCX", "Konversi"],
    status: "available",
    href: "/tools/pdf-to-word",
    icon: "DOC",
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
    id: "remove-bg",
    slug: "remove-bg",
    title: "Hapus Background Gambar",
    name: "Hapus Background Gambar",
    description: "Hapus background gambar secara otomatis menggunakan AI. Cocok untuk foto produk, pas foto, dan desain.",
    category: "Gambar",
    tags: ["Gambar", "AI", "Background"],
    status: "coming-soon",
    href: "/tools",
    icon: "IMG",
  },
  {
    id: "passport-photo",
    slug: "passport-photo",
    title: "Pas Foto Generator",
    name: "Pas Foto Generator",
    description: "Buat pas foto ukuran 2\u00d73, 3\u00d74, atau 4\u00d76 dengan background merah, biru, atau putih. Siap cetak.",
    category: "Gambar",
    tags: ["Gambar", "Pas Foto", "AI"],
    status: "coming-soon",
    href: "/tools",
    icon: "IMG",
  },
  {
    id: "word-counter",
    slug: "word-counter",
    title: "Hitung Kata & Karakter",
    name: "Hitung Kata & Karakter",
    description: "Hitung jumlah kata, karakter, kalimat, dan paragraf secara instan untuk esai, skripsi, dan konten.",
    category: "Text",
    tags: ["Teks", "Gratis", "Developers"],
    status: "available",
    href: "/tools/word-counter",
    icon: "TXT",
  },
  {
    id: "qr-code-generator",
    slug: "qr-code-generator",
    title: "QR Code Generator",
    name: "QR Code Generator",
    description: "Buat QR code dari teks atau URL secara instan. Cocok untuk UMKM, event, dan media sosial.",
    category: "Generator",
    tags: ["Generator", "QR", "Gratis"],
    status: "available",
    href: "/tools/qr-code-generator",
    icon: "QR",
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
    icon: "\u21bb",
  },
];

export function getAvailableTools() {
  return tools.filter((tool) => tool.status === "available");
}

export function getFeaturedTool() {
  return tools.find((tool) => tool.featured) ?? getAvailableTools()[0];
}

