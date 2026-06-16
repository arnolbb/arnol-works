---
target: apps/web/app/projects/keystrike/play
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-16T16-12-45Z
slug: apps-web-app-projects-keystrike-play
---
# Keystrike Mobile Game Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Timer, WPM, accuracy, combo, score, mistakes terlihat jelas, tetapi status keyboard/focus masih bukan bagian natural dari game loop. |
| 2 | Match System / Real World | 3 | Konsep typing time attack mudah dipahami; beberapa label cyber seperti "Arena // Time Attack" terasa lebih dekoratif daripada membantu. |
| 3 | User Control and Freedom | 2 | Ada Quit dan retry modal, tetapi tidak ada pause/resume atau cara eksplisit mengelola keyboard selain focus overlay. |
| 4 | Consistency and Standards | 3 | Visual cyber konsisten; pola input hidden field + click-to-focus masih tidak standar untuk mobile. |
| 5 | Error Prevention | 2 | Game mencegah banyak input buruk, tetapi risiko keyboard menutup teks dan blur/focus mobile masih tinggi. |
| 6 | Recognition Rather Than Recall | 2 | Pemain harus mengerti sendiri bahwa mereka harus mengetik di layar tanpa input terlihat; bantuan hanya berupa tip kecil. |
| 7 | Flexibility and Efficiency | 3 | Keyboard desktop efisien; mobile sudah lebih baik dengan compact mode, tetapi tetap bukan pengalaman native. |
| 8 | Aesthetic and Minimalist Design | 3 | Tema kuat dan rapi, tetapi enam metrik di atas teks membuat prioritas visual terlalu berat untuk layar kecil. |
| 9 | Error Recovery | 2 | Ada feedback salah/benar dan overlay keyboard, tetapi recovery dari keyboard tertutup/blur belum terasa mulus. |
| 10 | Help and Documentation | 2 | Tip Backspace membantu desktop, tetapi instruksi mobile dan affordance touch masih minim. |
| **Total** | | **25/40** | **Acceptable: fondasi kuat, perlu adaptasi mobile yang lebih tajam.** |

## Anti-Patterns Verdict

**LLM assessment**: Tidak terlihat seperti UI generik AI. Identitas Keystrike cukup kuat: neon cyber, grid, typography display, dan warna state membuatnya terasa seperti mini game yang sengaja dibangun. Masalahnya bukan "AI slop", melainkan desktop typing-game mental model yang dipaksa ke mobile. Screenshot menunjukkan layar atas terlalu dimakan enam kartu statistik; teks target berada di bawahnya dan mudah tertutup keyboard.

**Deterministic scan**: Detector `$impeccable` dicoba pada komponen Keystrike, tetapi gagal load karena dependency lokal `scripts/lib/impeccable-config.mjs` hilang dari instalasi skill. Tidak ada finding deterministik yang valid.

**Visual overlays**: Tidak tersedia. Browser/injection tidak berhasil dijalankan di sesi ini, jadi tidak ada overlay visual yang bisa dipercaya. Fallback signal: screenshot user + source review.

## Overall Impression

Game ini punya rasa visual yang jelas dan cukup menarik untuk portfolio. Single biggest opportunity: ubah mobile dari "desktop typing area yang dikecilkan" menjadi "mobile typing mode" yang sadar keyboard, viewport pendek, dan thumb ergonomics.

## What's Working

1. Tema visual punya identitas. Neon cyan/magenta/green/yellow langsung memberi konteks arcade dan membedakan Keystrike dari halaman Arnol Works lain.
2. Status performa mudah dibaca. WPM, accuracy, combo, score, mistakes memberi feedback real-time yang cocok untuk game mengetik.
3. Engine interaksi sudah cukup responsif. Input per karakter, state correct/wrong/current, high score, dan result modal sudah membentuk loop game yang lengkap.

## Priority Issues

### [P1] Mobile keyboard competes with the actual sentence

**Why it matters**: Pada mobile, tujuan utama adalah melihat kalimat dan mengetik. Jika keyboard muncul dan kalimat terdorong/tertutup, game terasa rusak meskipun logic benar.

**Fix**: Jadikan text panel prioritas layout saat keyboard aktif: stats boleh jadi satu strip ringkas, tip disembunyikan, header dipadatkan, dan panel kalimat diposisikan lebih tinggi dengan `visualViewport` state. Pertimbangkan mode "focus" saat game running: hanya timer, WPM, accuracy, dan kalimat yang tampil; score/combo/mistakes bisa turun ke result atau bar kecil.

**Suggested command**: `$impeccable adapt`

### [P1] Six stat cards dominate the first screen on phone

**Why it matters**: Dalam screenshot, pengguna melihat dua pertiga atas layar sebagai dashboard, bukan arena mengetik. Ini menaikkan cognitive load dan memindahkan fokus dari aktivitas inti.

**Fix**: Di mobile, tampilkan maksimal 3 metrik primer: Timer, WPM, Accuracy. Combo/Score/Mistakes bisa menjadi compact inline bar, badge kecil, atau muncul di result modal. Jika tetap 6, gunakan row micro-stat tanpa card penuh.

**Suggested command**: `$impeccable distill`

### [P2] Text target lacks enough visual dominance

**Why it matters**: Kalimat target adalah "enemy" dalam game ini, tetapi secara visual masih kalah oleh angka neon. Pending text juga cukup muted, sehingga pada kondisi layar redup/keyboard muncul readability bisa turun.

**Fix**: Naikkan kontras pending text sedikit, beri text panel hierarchy lebih tinggi, dan buat current character lebih jelas tanpa bergantung hanya pada underline tipis. Kurangi glow angka ketika game sedang berjalan.

**Suggested command**: `$impeccable typeset`

### [P2] Mobile control model is fragile

**Why it matters**: Hidden input + click-to-focus bisa bekerja, tetapi di mobile rawan blur saat keyboard, browser chrome, atau tap di area lain. Pemain tidak punya kontrol eksplisit selain "Buka Keyboard".

**Fix**: Buat state machine input yang lebih gamelike: Start/Tap to focus sebelum countdown, pause saat keyboard hilang, resume jelas saat keyboard aktif lagi. Jangan mulai timer sampai keyboard benar-benar terbuka atau karakter pertama masuk.

**Suggested command**: `$impeccable harden`

### [P3] CSS compact rules are duplicated

**Why it matters**: Ada aturan compact untuk `max-height` dan `.keystrike-keyboard-open` yang isinya hampir sama. Ini rawan drift saat polish berikutnya.

**Fix**: Satukan lewat class modifier yang sama, atau ekstrak CSS custom properties untuk spacing/font/panel height dan override variabelnya saja.

**Suggested command**: `$impeccable polish`

## Persona Red Flags

**Casey (Distracted Mobile User)**: Casey memakai satu tangan dan keyboard onscreen. Saat enam kartu statistik mengambil area atas, kalimat target turun dan rawan tertutup keyboard. Tombol Quit berada di kanan atas, bukan thumb zone. Jika ada notifikasi atau keyboard blur, Casey butuh reorientasi ulang.

**Alex (Power User)**: Alex suka metrik, tetapi ingin flow cepat. Saat mobile, terlalu banyak info real-time bisa mengganggu ritme mengetik. Tidak ada pause/resume, countdown, atau mode fokus yang mengurangi noise saat permainan sudah berjalan.

**Sam (Accessibility-Dependent User)**: Hidden input punya `aria-label`, tetapi game tetap bergantung pada visual state warna dan time-limited interaction. Red/green/cyan memberi informasi penting; perlu tambahan non-color cue atau aria live untuk status besar seperti finished/new high score jika aksesibilitas jadi target.

## Minor Observations

- "Tip: Tekan Backspace" relevan untuk desktop, tetapi kurang relevan di mobile karena keyboard virtual punya perilaku backspace sendiri.
- `Quit` cukup jelas, tetapi di game mobile biasanya aksi keluar rawan accidental tap; pertimbangkan label "Keluar" untuk konsistensi bahasa Indonesia atau tetap Inggris secara sengaja di seluruh game.
- Current character indicator bisa lebih tegas: underline cyan tipis bisa hilang di layar kecil.
- Font Orbitron memberi karakter, tetapi label 8-10px tracking lebar cepat kehilangan readability.

## Questions to Consider

- Apa metrik yang benar-benar perlu dilihat saat pemain sedang mengetik: semua enam, atau hanya Timer/WPM/Accuracy?
- Haruskah mobile punya mode berbeda dari desktop, bukan hanya responsive layout?
- Apakah timer harus mulai pada karakter pertama, atau setelah keyboard mobile terbukti aktif?
- Apa momen paling penting: mengejar skor, menjaga akurasi, atau sekadar latihan mengetik cepat?
