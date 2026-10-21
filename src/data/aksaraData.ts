export interface AksaraItem {
  id: string;
  char: string;
  latin: string;
  category: 'nglegena' | 'swara' | 'panyigeg';
  name: string;
  pronunciation: string;
  description: string;
  position?: string;
  sampleWord: {
    jawa: string;
    latin: string;
    meaning: string;
  };
  mnemonic?: string;
}

export const AKSARA_NGLEGENA: AksaraItem[] = [
  {
    id: 'ha',
    char: 'ꦲ',
    latin: 'ha',
    category: 'nglegena',
    name: 'Aksara Ha',
    pronunciation: 'Dibaca "ha" atau "a"',
    description: 'Aksara pertama dalam Carakan Jawa.',
    mnemonic: 'Hana caraka: Ada utusan utusan',
    sampleWord: { jawa: 'ꦲꦤ', latin: 'hana / ana', meaning: 'ada' }
  },
  {
    id: 'na',
    char: 'ꦤ',
    latin: 'na',
    category: 'nglegena',
    name: 'Aksara Na',
    pronunciation: 'Dibaca "na"',
    description: 'Aksara kedua dalam Carakan Jawa.',
    mnemonic: 'Hana caraka: Utusan terpercaya',
    sampleWord: { jawa: 'ꦤꦭ', latin: 'nala', meaning: 'hati / sanubari' }
  },
  {
    id: 'ca',
    char: 'ꦕ',
    latin: 'ca',
    category: 'nglegena',
    name: 'Aksara Ca',
    pronunciation: 'Dibaca "ca"',
    description: 'Aksara ketiga dalam Carakan Jawa.',
    mnemonic: 'Hana caraka: Setia membawa perintah',
    sampleWord: { jawa: 'ꦏꦕ', latin: 'kaca', meaning: 'cermin / kaca' }
  },
  {
    id: 'ra',
    char: 'ꦫ',
    latin: 'ra',
    category: 'nglegena',
    name: 'Aksara Ra',
    pronunciation: 'Dibaca "ra"',
    description: 'Aksara keempat dalam Carakan Jawa.',
    mnemonic: 'Hana caraka: Rukun sentosa',
    sampleWord: { jawa: 'ꦫꦗ', latin: 'raja', meaning: 'raja / pemimpin' }
  },
  {
    id: 'ka',
    char: 'ꦏ',
    latin: 'ka',
    category: 'nglegena',
    name: 'Aksara Ka',
    pronunciation: 'Dibaca "ka"',
    description: 'Aksara kelima dalam Carakan Jawa.',
    mnemonic: 'Hana caraka: Kuat dan tabah',
    sampleWord: { jawa: 'ꦏꦭ', latin: 'kala', meaning: 'waktu / ketika' }
  },
  {
    id: 'da',
    char: 'ꦢ',
    latin: 'da',
    category: 'nglegena',
    name: 'Aksara Da',
    pronunciation: 'Dibaca "da" (dental lembut)',
    description: 'Aksara keenam, baris kedua.',
    mnemonic: 'Data sawala: Saling berselisih',
    sampleWord: { jawa: 'ꦢꦢ', latin: 'dada', meaning: 'dada' }
  },
  {
    id: 'ta',
    char: 'ꦠ',
    latin: 'ta',
    category: 'nglegena',
    name: 'Aksara Ta',
    pronunciation: 'Dibaca "ta" (dental lembut)',
    description: 'Aksara ketujuh dalam Carakan Jawa.',
    mnemonic: 'Data sawala: Menguji keteguhan',
    sampleWord: { jawa: 'ꦠꦠ', latin: 'tata', meaning: 'tertib / rapi' }
  },
  {
    id: 'sa',
    char: 'ꦱ',
    latin: 'sa',
    category: 'nglegena',
    name: 'Aksara Sa',
    pronunciation: 'Dibaca "sa"',
    description: 'Aksara kedelapan dalam Carakan Jawa.',
    mnemonic: 'Data sawala: Mempertahankan amanah',
    sampleWord: { jawa: 'ꦱꦥ', latin: 'sapa', meaning: 'siapa' }
  },
  {
    id: 'wa',
    char: 'ꦮ',
    latin: 'wa',
    category: 'nglegena',
    name: 'Aksara Wa',
    pronunciation: 'Dibaca "wa"',
    description: 'Aksara kesembilan dalam Carakan Jawa.',
    mnemonic: 'Data sawala: Berpegang pada tekad',
    sampleWord: { jawa: 'ꦮꦢ', latin: 'wada', meaning: 'celaan / tuduhan' }
  },
  {
    id: 'la',
    char: 'ꦭ',
    latin: 'la',
    category: 'nglegena',
    name: 'Aksara La',
    pronunciation: 'Dibaca "la"',
    description: 'Aksara kesepuluh dalam Carakan Jawa.',
    mnemonic: 'Data sawala: Lurus hatinya',
    sampleWord: { jawa: 'ꦭꦫ', latin: 'lara', meaning: 'sakit' }
  },
  {
    id: 'pa',
    char: 'ꦥ',
    latin: 'pa',
    category: 'nglegena',
    name: 'Aksara Pa',
    pronunciation: 'Dibaca "pa"',
    description: 'Aksara kesebelas, baris ketiga.',
    mnemonic: 'Padha jayanya: Sama-sama saktinya',
    sampleWord: { jawa: 'ꦥꦱ', latin: 'pasa', meaning: 'puasa' }
  },
  {
    id: 'dha',
    char: 'ꦝ',
    latin: 'dha',
    category: 'nglegena',
    name: 'Aksara Dha',
    pronunciation: 'Dibaca "dha" (lidah ditarik ke langit-langit)',
    description: 'Aksara kedua belas (retroflex d).',
    mnemonic: 'Padha jayanya: Sama kekuatannya',
    sampleWord: { jawa: 'ꦝꦝ', latin: 'dhadha', meaning: 'dada (ragam ngoko)' }
  },
  {
    id: 'ja',
    char: 'ꦗ',
    latin: 'ja',
    category: 'nglegena',
    name: 'Aksara Ja',
    pronunciation: 'Dibaca "ja"',
    description: 'Aksara ketiga belas dalam Carakan Jawa.',
    mnemonic: 'Padha jayanya: Jaya keduanya',
    sampleWord: { jawa: 'ꦗꦭ', latin: 'jala', meaning: 'jaring / jala ikan' }
  },
  {
    id: 'ya',
    char: 'ꦪ',
    latin: 'ya',
    category: 'nglegena',
    name: 'Aksara Ya',
    pronunciation: 'Dibaca "ya"',
    description: 'Aksara keempat belas dalam Carakan Jawa.',
    mnemonic: 'Padha jayanya: Yakin pada kebenaran',
    sampleWord: { jawa: 'ꦪꦪ', latin: 'yaya', meaning: 'ayah / bapak' }
  },
  {
    id: 'nya',
    char: 'ꦚ',
    latin: 'nya',
    category: 'nglegena',
    name: 'Aksara Nya',
    pronunciation: 'Dibaca "nya"',
    description: 'Aksara kelima belas dalam Carakan Jawa.',
    mnemonic: 'Padha jayanya: Nyata kehebatannya',
    sampleWord: { jawa: 'ꦚꦠ', latin: 'nyata', meaning: 'terbukti jelas' }
  },
  {
    id: 'ma',
    char: 'ꦩ',
    latin: 'ma',
    category: 'nglegena',
    name: 'Aksara Ma',
    pronunciation: 'Dibaca "ma"',
    description: 'Aksara keenam belas, baris keempat.',
    mnemonic: 'Maga bathanga: Menjadi mayat (akhir cerita)',
    sampleWord: { jawa: 'ꦩꦠ', latin: 'mata', meaning: 'mata' }
  },
  {
    id: 'ga',
    char: 'ꦒ',
    latin: 'ga',
    category: 'nglegena',
    name: 'Aksara Ga',
    pronunciation: 'Dibaca "ga"',
    description: 'Aksara ketujuh belas dalam Carakan Jawa.',
    mnemonic: 'Maga bathanga: Gugur dalam tugas',
    sampleWord: { jawa: 'ꦒꦗ', latin: 'gaja', meaning: 'gajah' }
  },
  {
    id: 'ba',
    char: 'ꦧ',
    latin: 'ba',
    category: 'nglegena',
    name: 'Aksara Ba',
    pronunciation: 'Dibaca "ba"',
    description: 'Aksara kedelapan belas dalam Carakan Jawa.',
    mnemonic: 'Maga bathanga: Bersama-sama gugur',
    sampleWord: { jawa: 'ꦧꦠ', latin: 'bata', meaning: 'batu bata' }
  },
  {
    id: 'tha',
    char: 'ꦛ',
    latin: 'tha',
    category: 'nglegena',
    name: 'Aksara Tha',
    pronunciation: 'Dibaca "tha" (letupan t dengan lidah tertekuk)',
    description: 'Aksara kesembilan belas (retroflex t).',
    mnemonic: 'Maga bathanga: Teguh hingga akhir',
    sampleWord: { jawa: 'ꦏꦛ', latin: 'katha', meaning: 'cerita / kisah' }
  },
  {
    id: 'nga',
    char: 'ꦔ',
    latin: 'nga',
    category: 'nglegena',
    name: 'Aksara Nga',
    pronunciation: 'Dibaca "nga"',
    description: 'Aksara kedua puluh (penutup Carakan).',
    mnemonic: 'Maga bathanga: Mengenang kesetiaan',
    sampleWord: { jawa: 'ꦔꦤ', latin: 'ngana', meaning: 'ke sana' }
  }
];

export const SANDHANGAN_SWARA: AksaraItem[] = [
  {
    id: 'wulu',
    char: 'ꦶ',
    latin: 'Wulu ( -i )',
    category: 'swara',
    name: 'Wulu',
    pronunciation: 'Bunyi vokal "i"',
    description: 'Mengubah bunyi vokal aksara nglegena menjadi bunyi [i].',
    position: 'Ditulis di atas aksara (contoh: ꦱꦶ = si)',
    sampleWord: {
      jawa: 'ꦱꦶꦠꦶ',
      latin: 'siti',
      meaning: 'tanah / bumi'
    }
  },
  {
    id: 'suku',
    char: 'ꦸ',
    latin: 'Suku ( -u )',
    category: 'swara',
    name: 'Suku',
    pronunciation: 'Bunyi vokal "u"',
    description: 'Mengubah bunyi vokal aksara nglegena menjadi bunyi [u].',
    position: 'Ditulis di bawah kaki aksara (contoh: ꦧꦸ = bu)',
    sampleWord: {
      jawa: 'ꦧꦸꦏꦸ',
      latin: 'buku',
      meaning: 'kitab / buku bacaan'
    }
  },
  {
    id: 'pepet',
    char: 'ꦼ',
    latin: 'Pepet ( -e )',
    category: 'swara',
    name: 'Pepet',
    pronunciation: 'Bunyi vokal [ə] seperti kata "segar" atau "enak"',
    description: 'Mengubah bunyi aksara menjadi vokal pepet [e/ə].',
    position: 'Ditulis di atas aksara (lingkaran kecil dengan garis lengkung)',
    sampleWord: {
      jawa: 'ꦱꦼꦒ',
      latin: 'sega',
      meaning: 'nasi'
    }
  },
  {
    id: 'taling',
    char: 'ꦺ',
    latin: 'Taling ( -é )',
    category: 'swara',
    name: 'Taling',
    pronunciation: 'Bunyi vokal [e/ɛ] seperti pada kata "sate", "lele"',
    description: 'Mengubah bunyi vokal aksara menjadi vokal taling [é].',
    position: 'Ditulis di sebelah kiri (di depan) aksara (contoh: ꦺꦭ = lé)',
    sampleWord: {
      jawa: 'ꦺꦱꦠꦺ',
      latin: 'saté',
      meaning: 'makanan sate'
    }
  },
  {
    id: 'taling-tarung',
    char: 'ꦺꦴ',
    latin: 'Taling Tarung ( -o )',
    category: 'swara',
    name: 'Taling Tarung',
    pronunciation: 'Bunyi vokal "o"',
    description: 'Mengubah bunyi aksara nglegena menjadi bunyi vokal [o].',
    position: 'Mengapit aksara (taling di depan, tarung di belakang)',
    sampleWord: {
      jawa: 'ꦺꦠꦴꦏꦺꦴ',
      latin: 'toko',
      meaning: 'toko / tempat berjualan'
    }
  }
];

export const SANDHANGAN_PANYIGEG: AksaraItem[] = [
  {
    id: 'cecak',
    char: 'ꦁ',
    latin: 'Cecak ( -ng )',
    category: 'panyigeg',
    name: 'Cecak',
    pronunciation: 'Konsonan penutup suku kata [-ng]',
    description: 'Memberi akhiran bunyi nasal [-ng] pada suku kata.',
    position: 'Ditulis di bagian atas aksara (contoh: ꦏꦕꦁ = kacang)',
    sampleWord: {
      jawa: 'ꦏꦕꦁ',
      latin: 'kacang',
      meaning: 'tanaman kacang'
    }
  },
  {
    id: 'layar',
    char: 'ꦂ',
    latin: 'Layar ( -r )',
    category: 'panyigeg',
    name: 'Layar',
    pronunciation: 'Konsonan penutup suku kata [-r]',
    description: 'Memberi akhiran bunyi getar [-r] pada suku kata.',
    position: 'Ditulis di bagian atas aksara serong ke kanan atas (contoh: ꦥꦱꦂ = pasar)',
    sampleWord: {
      jawa: 'ꦥꦱꦂ',
      latin: 'pasar',
      meaning: 'pasar rakyat'
    }
  },
  {
    id: 'wigyan',
    char: 'ꦃ',
    latin: 'Wigyan ( -h )',
    category: 'panyigeg',
    name: 'Wigyan',
    pronunciation: 'Konsonan penutup suku kata [-h]',
    description: 'Memberi akhiran bunyi hembusan [-h] pada suku kata.',
    position: 'Ditulis di sebelah kanan (di belakang) aksara (contoh: ꦒꦗꦃ = gajah)',
    sampleWord: {
      jawa: 'ꦒꦗꦃ',
      latin: 'gajah',
      meaning: 'hewan gajah'
    }
  },
  {
    id: 'pangkon',
    char: '꧀',
    latin: 'Pangkon ( Pematèk )',
    category: 'panyigeg',
    name: 'Pangkon',
    pronunciation: 'Mematikan vokal suku kata',
    description: 'Menghilangkan vokal dasar [a] pada aksara nglegena terakhir kalimat/kata.',
    position: 'Ditulis di belakang aksara yang dimatikan vokalnya (contoh: ꦧꦥꦏ꧀ = bapak)',
    sampleWord: {
      jawa: 'ꦧꦥꦏ꧀',
      latin: 'bapak',
      meaning: 'ayah / bapak'
    }
  }
];

export const KATA_LATIHAN = [
  { jawa: 'ꦧꦠ', latin: 'bata', arti: 'Batu bata merah' },
  { jawa: 'ꦱꦥ', latin: 'sapa', arti: 'Siapa (kata tanya)' },
  { jawa: 'ꦫꦗ', latin: 'raja', arti: 'Raja / Penguasa' },
  { jawa: 'ꦩꦠ', latin: 'mata', arti: 'Mata untuk melihat' },
  { jawa: 'ꦱꦶꦠꦶ', latin: 'siti', arti: 'Tanah / Lemah' },
  { jawa: 'ꦧꦸꦏꦸ', latin: 'buku', arti: 'Buku pelajaran' },
  { jawa: 'ꦠꦸꦏꦸ', latin: 'tuku', arti: 'Membeli sesuatu' },
  { jawa: 'ꦱꦼꦒ', latin: 'sega', arti: 'Nasi hangat' },
  { jawa: 'ꦱꦠꦺ', latin: 'saté', arti: 'Sate tusuk lezat' },
  { jawa: 'ꦺꦠꦴꦏꦺꦴ', latin: 'toko', arti: 'Toko / warung' },
  { jawa: 'ꦏꦕꦁ', latin: 'kacang', arti: 'Biji kacang gurih' },
  { jawa: 'ꦥꦱꦂ', latin: 'pasar', arti: 'Pasar tradisional' },
  { jawa: 'ꦒꦗꦃ', latin: 'gajah', arti: 'Gajah belalai panjang' },
  { jawa: 'ꦧꦥꦏ꧀', latin: 'bapak', arti: 'Bapak / Ayah tercinta' },
  { jawa: 'ꦩꦮꦂ', latin: 'mawar', arti: 'Bunga mawar merah' },
  { jawa: 'ꦮꦪꦁ', latin: 'wayang', arti: 'Wayang kulit Jawa' },
  { jawa: 'ꦱꦮꦃ', latin: 'sawah', arti: 'Sawah padi hijau' },
  { jawa: 'ꦭꦫ', latin: 'lara', arti: 'Sakit' },
  { jawa: 'ꦠꦠ', latin: 'tata', arti: 'Tertib / rapi' },
  { jawa: 'ꦏꦭ', latin: 'kala', arti: 'Waktu / ketika' }
];
