---
name: Arnol Works
description: Portfolio + tools lab dengan utilitas PDF dan gambar
colors:
  primary: "#4A3EE6"
  primary-hover: "#372BD1"
  neutral-bg-light: "#f8fafc"
  neutral-bg-dark: "#0a1020"
  ink-light: "#0d1c2e"
  ink-dark: "#e5edf8"
  brand-soft: "#F1F0FF"
  brand-border: "#DCD9FF"
  brand-paper: "#FBFAF8"
  brand-panel: "#111827"
  brand-line: "#233047"
  brand-amber: "#F59E0B"
  brand-mint: "#10B981"
typography:
  display:
    fontFamily: "Bahnschrift, Aptos Display, Segoe UI Variable Display, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Aptos, Segoe UI Variable Text, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "Cascadia Mono, JetBrains Mono, Consolas, monospace"
    fontSize: "0.875rem"
rounded:
  sm: "6px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  xxl: "28px"
spacing:
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  panel:
    backgroundColor: "{colors.brand-paper}"
    borderColor: "{colors.brand-border}"
    rounded: "{rounded.xl}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
---

# Design

## Overview
Arnol Works mengusung arah desain yang minimalis, fungsional, dan modern. Setiap elemen UI dirancang untuk memaksimalkan efisiensi kerja pengguna (Utility First). Antarmuka didominasi oleh ruang putih yang lega, pembatas tipis, sudut membulat lebar (24px untuk kontainer panel utama), dan efek cahaya halus di latar belakang.

## Colors
Palet warna menggunakan pendekatan yang berorientasi produk dengan warna tinta gelap (#0D1C2E) untuk teks di mode terang, warna latar belakang bersih (#F8FAFC), dan aksen utama berwarna ungu (#4A3EE6). Untuk mode gelap, warna latar berubah menjadi sangat gelap (#0A1020) dengan teks berwarna abu-abu terang (#E5EDF8) untuk menjaga kenyamanan membaca.

**The Neutral Contrast Rule.** Warna teks utama harus selalu memiliki rasio kontras minimal 4.5:1 terhadap warna latar belakangnya untuk menjamin keterbacaan yang sempurna.

## Typography
Tipografi diatur secara hierarkis menggunakan kombinasi font sans-serif modern yang profesional untuk teks biasa (Aptos / Segoe UI) dan font tampilan tebal (Bahnschrift / Segoe UI Variable Display) untuk judul/heading utama. Data numerik, indikator, dan teks konsol menggunakan font monospace (Cascadia Mono / JetBrains Mono).

## Elevation
Platform ini mengandalkan pendekatan antarmuka datar yang bertingkat (layered flat). Elevation tidak didasarkan pada bayangan (shadow) yang tebal dan gelap, melainkan menggunakan pembatas border yang tipis (#DCD9FF / #233047) dikombinasikan dengan efek kabur latar belakang (backdrop blur) dan warna latar yang sedikit berbeda untuk membedakan kedalaman visual.

## Components
- **Panel (Card utama)**: Menggunakan radius kelengkungan sudut yang lebar (24px), warna latar belakang putih kertas (#FBFAF8) dengan border tipis dan shadow sangat halus di mode terang.
- **Button (Tombol Utama)**: Menggunakan warna aksen ungu (#4A3EE6) dengan transisi hover halus ke ungu gelap (#372BD1).
- **StatusBadge**: Memiliki sudut membulat penuh (pill), border tipis, dan teks dengan spasi huruf (tracking) yang sedikit renggang.

## Do's and Don'ts
- **DO**: Pertahankan tata letak yang bersih dan rapi dengan padding yang konsisten.
- **DO**: Selalu perhatikan kontras warna teks dan latar belakang di mode terang maupun gelap.
- **DO**: Gunakan tag HTML semantik (section, article, main, header, footer) agar ramah aksesibilitas.
- **DON'T**: Jangan menggunakan bayangan (shadow) yang tebal dan sangat gelap.
- **DON'T**: Jangan mencampur visual cyberpunk-neon dari game KeyStrike ke halaman utilitas umum (seperti splitter PDF) untuk menjaga kesatuan tema platform Arnol Works yang minimalis dan profesional.
