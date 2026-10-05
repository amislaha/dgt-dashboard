/** Physical & ecological profile per kawasan (sourced from the Ekspedisi Patriot 2025 reports). Shared by the
 *  Profil page and the Geospasial kawasan modal so both show the same content. */
export type FisikId = 'topografi' | 'tanah' | 'hidrologi' | 'iklim' | 'tutupan';
export type FisikTone = 'good' | 'warn' | 'bad' | 'info';

export interface FisikFakta {
  label: string;
  value: string;
  tag?: string;
  tone?: FisikTone;
}

export interface FisikTanah {
  nama: string;
  warna: string;
  kesuburan: string;
  tone: FisikTone;
  lokasi: string;
  ket: string;
}

export interface FisikBlok {
  id: FisikId;
  judul: string;
  /** One headline figure shown on the selector tile. */
  headline: { value: string; label: string };
  ringkasan: string;
  fakta: FisikFakta[];
  /** Topografi: elevation range (m dpl) drawn as a scale bar. */
  elevasi?: { min: number; max: number };
  /** Tanah: one card per soil type. */
  tanah?: FisikTanah[];
  /** Hidrologi: districts grouped by flood hazard / water capacity. */
  banjirTinggi?: string[];
  airTerlampaui?: string[];
  airAman?: string[];
  /** Iklim: rainfall level per month Jan-Des, 0 (kering) to 3 (puncak hujan). */
  hujanBulanan?: number[];
}

export const FISIK_BULAN = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const FISIK_BULAN_PENUH = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const FISIK_HUJAN_LABEL = ['Kering', 'Peralihan', 'Hujan', 'Puncak hujan'];

/** Physical & ecological profile per kawasan, keyed by kawasan name. Only Salor has one so far. */
export const FISIK_BY_KAWASAN: { [nama: string]: FisikBlok[] } = {
  Salor: [
    {
      id: 'topografi',
      judul: 'Topografi & geografi',
      headline: { value: '0–8%', label: 'kelerengan dominan' },
      ringkasan: 'Elevasi rendah dan kemiringan sangat landai membuat genangan menjadi faktor pembatas utama bagi infrastruktur dan permukiman, namun mempermudah pembangunan serta mendukung pertanian lahan basah, perkebunan, perikanan air tawar, dan konservasi rawa. Perlu perencanaan drainase mikro.',
      elevasi: { min: -6, max: 53 },
      fakta: [
        { label: 'Kelerengan', value: 'Mayoritas 0–8% (datar–landai); lebih curam di timur dan utara menuju perbukitan', tag: 'Datar–landai', tone: 'good' },
        { label: 'Bentang lahan', value: 'Dataran banjir (floodplain) aluvial pesisir dan rawa', tag: 'Floodplain', tone: 'info' },
        { label: 'Selatan', value: 'Animha, Malind, Semangga, Kurik: sangat rendah dan dekat pantai, rentan genangan dan intrusi air laut', tag: 'Rendah', tone: 'warn' },
        { label: 'Tengah–utara', value: 'Jagebob dan Tanah Miring sedikit lebih tinggi, drainase alami lebih baik', tag: 'Lebih tinggi', tone: 'good' }
      ]
    },
    {
      id: 'tanah',
      judul: 'Karakteristik tanah',
      headline: { value: 'Acrisol', label: 'jenis tanah dominan' },
      ringkasan: 'Kesesuaian lahan sangat bervariasi menurut jenis tanah: Acrisol perlu pengelolaan intensif, Fluvisol paling potensial untuk budidaya dan permukiman, Histosol lebih tepat dilindungi.',
      fakta: [],
      tanah: [
        { nama: 'Acrisol', warna: '#c0683a', kesuburan: 'Hara rendah', tone: 'warn', lokasi: 'Kurik, Tanah Miring, Jagebob', ket: 'Tanah tua, masam, hara terbatas. Cocok tanaman tahunan dengan pemupukan tambahan, kurang ideal untuk pangan intensif tanpa pengolahan.' },
        { nama: 'Fluvisol', warna: '#c9a14a', kesuburan: 'Relatif subur', tone: 'good', lokasi: 'Pesisir selatan, alur sungai utama', ket: 'Tanah muda hasil sedimentasi. Potensial untuk lahan basah, hortikultura, dan permukiman bila drainase ditingkatkan.' },
        { nama: 'Histosol', warna: '#4b3a2e', kesuburan: 'Rawan amblas', tone: 'bad', lokasi: 'Rawa dan gambut, tengah dan timur', ket: 'Bahan organik tinggi tetapi tidak stabil; rawan amblas dan terbakar bila dikeringkan. Sebaiknya zona konservasi atau pertanian basah.' }
      ]
    },
    {
      id: 'hidrologi',
      judul: 'Hidrologi & sumber daya air',
      headline: { value: '4 distrik', label: 'bahaya banjir tinggi' },
      ringkasan: 'Tekanan air di selatan dan barat dikaitkan dengan permukiman, intensifikasi pertanian lahan basah, irigasi besar, dan perubahan tutupan lahan. Risiko kekeringan umumnya rendah–menengah, dan rawa dataran rendah menahan lembap lebih lama.',
      banjirTinggi: ['Semangga', 'Kurik', 'Malind', 'Tanah Miring (sebagian)'],
      airTerlampaui: ['Semangga', 'Malind', 'Kurik'],
      airAman: ['Jagebob', 'Animha', 'Tanah Miring (utara)'],
      fakta: [
        { label: 'Penyebab banjir', value: 'Topografi datar, jaringan sungai padat berkapasitas alir terbatas, tanah lempung lunak berinfiltrasi rendah, pengaruh pasang surut di pesisir', tag: 'Dataran banjir', tone: 'warn' },
        { label: 'Daya dukung air', value: 'Sebagian besar wilayah belum melampaui daya dukung dan daya tampung air', tag: 'Masih cukup', tone: 'good' },
        { label: 'Kekeringan', value: 'Bahaya rendah hingga menengah; rawa dataran rendah menahan lembap lebih lama', tag: 'Rendah–menengah', tone: 'info' }
      ]
    },
    {
      id: 'iklim',
      judul: 'Iklim',
      headline: { value: 'Monsun', label: 'tropis, Nov–Apr basah' },
      ringkasan: 'Pola iklim teratur dan dapat diprediksi, dipengaruhi monsun, konveksi pesisir Laut Arafura, dan ENSO. Hujan awal tahun mendukung pertanian dan pengisian air tanah tetapi menambah risiko genangan; pemanasan menjelang musim hujan meningkatkan kerentanan kekeringan dan kebakaran lahan.',
      hujanBulanan: [3, 3, 3, 2, 1, 0, 0, 0, 0, 1, 2, 2],
      fakta: [
        { label: 'Musim hujan', value: 'November–April, puncak Januari–Maret', tag: 'Nov–Apr', tone: 'info' },
        { label: 'Musim kering', value: 'Juni–September, presipitasi sangat rendah di seluruh distrik', tag: 'Jun–Sep', tone: 'warn' },
        { label: 'Sebaran hujan', value: 'Barat dan pesisir (Malind, Semangga) lebih basah; utara dan timur (Animha, Jagebob) cenderung lebih kering' },
        { label: 'Suhu', value: 'Suhu minimum turun pada puncak kemarau (Juni–Agustus); suhu maksimum naik tajam September–November, terutama di Semangga, Malind, Kurik', tag: 'Sep–Nov panas', tone: 'bad' }
      ]
    },
    {
      id: 'tutupan',
      judul: 'Komposisi tutupan lahan (2017–2024)',
      headline: { value: '±48–49 rb ha', label: 'hutan, masih dominan' },
      ringkasan: 'Pola konversi dari hutan ke semak, pertanian, dan area terbangun. Arahan pengelolaan: lindungi blok hutan yang masih utuh, karena penurunan tutupan hutan berisiko mengurangi simpanan karbon, penyangga banjir, dan penahan erosi.',
      fakta: [
        { label: 'Hutan', value: 'Dominan, sekitar 48–49 ribu ha; menurun terutama pada 2018 dan 2023', tag: 'Menurun', tone: 'bad' },
        { label: 'Padang rumput / semak', value: 'Meningkat, hasil degradasi hutan', tag: 'Naik', tone: 'warn' },
        { label: 'Lahan pertanian', value: 'Naik perlahan dan konsisten', tag: 'Naik', tone: 'good' },
        { label: 'Area terbangun', value: 'Naik perlahan dan konsisten', tag: 'Naik', tone: 'good' },
        { label: 'Vegetasi tergenang', value: 'Berfluktuasi tajam: turun di awal periode, naik 2021–2022, turun lagi', tag: 'Berfluktuasi', tone: 'info' }
      ]
    }
  ]
};
