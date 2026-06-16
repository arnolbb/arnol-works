export const SENTENCES: string[] = [
  "Kecepatan mengetik adalah kunci untuk produktivitas yang lebih tinggi.",
  "Latihan setiap hari akan membuat jari kamu semakin lincah di keyboard.",
  "Sebuah perjalanan seribu langkah dimulai dari satu ketukan jari.",
  "Fokus pada akurasi terlebih dahulu, kecepatan akan mengikuti dengan sendirinya.",
  "Arena cyber ini menunggu para pengetik paling tangguh di seluruh jagat raya.",
  "Setiap karakter yang benar adalah serangan digital pada kegelapan.",
  "Jangan menyerah ketika jari mulai lelah, teruslah mengetik dengan ritme.",
  "Kombo tertinggi hanya bisa diraih oleh mereka yang sabar dan teliti.",
  "Layar bersinar biru neon ketika kamu mencapai kecepatan maksimal.",
  "Programmer hebat tidak hanya menulis kode, tapi juga mengetik dengan cepat.",
  "Pikiran yang tenang menghasilkan ketukan jari yang lebih akurat.",
  "Mengetik adalah seni yang membutuhkan latihan dan dedikasi panjang.",
  "Bayangan piksel berlari mengikuti irama ketukan tangan kamu malam ini.",
  "Mesin futuristik ini merekam setiap detak waktu dengan presisi sempurna.",
  "Tantangan sebenarnya bukan menang, melainkan mengalahkan diri sendiri kemarin.",
  "Kalimat panjang melatih daya tahan jari dan konsentrasi otak secara bersamaan.",
  "Suara klik keyboard adalah musik bagi seorang petarung arena digital.",
  "Cobalah untuk bernapas dalam dan biarkan jari menari di atas tombol.",
  "Posisi duduk yang baik membantu kamu mengetik lebih lama tanpa cedera.",
  "Setiap kesalahan adalah pelajaran untuk ketukan selanjutnya yang lebih baik.",
  "Mata melihat layar, otak memproses kata, jari mengeksekusi tanpa ragu.",
  "Senjata utamamu di sini adalah ketelitian, bukan hanya kecepatan semata.",
  "Bangkitlah pengetik muda dan tunjukkan kekuatan jemarimu pada dunia.",
  "Cahaya monitor memantul lembut pada kacamata sang juara malam ini.",
  "Ritme adalah kuncinya, jangan terburu-buru namun jangan terlalu lambat.",
  "Selamat datang di arena, prajurit keyboard generasi masa depan kita.",
  "Tarik napas, tenangkan pikiran, dan mulai ketuk satu kata demi satu kata.",
  "Kombinasi konsonan dan vokal bahasa Indonesia melatih jari secara seimbang.",
  "Jangan melihat keyboard, percayakan pada memori otot yang sudah kamu bangun.",
  "Pertarungan sesungguhnya berlangsung di dalam pikiran sang pengetik handal.",
  "Setiap detik berharga ketika waktu mulai menipis di sudut layar.",
  "Konsentrasi penuh akan membawamu naik ke peringkat tertinggi.",
  "Jari telunjuk dan jari tengah bekerja sama menyerang baris atas dengan cepat.",
  "Latihan rutin lebih baik daripada latihan keras yang hanya sesekali.",
  "Mengetik dengan sepuluh jari membuka kunci kekuatan tersembunyi di dirimu.",
  "Kota neon ini hanya bisa diselamatkan oleh pengetik paling akurat di galaksi.",
  "Detak waktu berdetak cepat, namun jemarimu harus tetap tenang dan stabil.",
  "Hari ini lebih baik dari kemarin, besok pasti lebih baik dari hari ini.",
  "Kemenangan kecil setiap hari membentuk juara sejati di akhir musim ini.",
  "Bersiaplah untuk menghadapi gelombang kalimat yang tak pernah berakhir.",
];

export function randomSentence(prev?: string): string {
  if (SENTENCES.length === 1) return SENTENCES[0];
  let s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  while (s === prev) {
    s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  }
  return s;
}
