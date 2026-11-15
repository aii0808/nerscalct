// Panduan Klinis Interaktif & SOP Tanggap Darurat "Jangan Panik, Lakukan Ini!"

export const EMERGENCY_SOPS = [
  {
    id: 'anafilaktik',
    title: 'Syok Anafilaktik Pasca Injeksi',
    category: 'Gawat Darurat Obat',
    urgency: 'Kritis / Segera',
    badge: 'Troli Emergency',
    color: 'rose',
    tandaKunci: 'Urtikaria/biduran, bibir/glotis bengkak, sesak napas (stridor/wheezing), tensi anjlok drastis (TD < 90/60 mmHg), nadi cepat dan lemah.',
    steps: [
      {
        order: 1,
        title: 'STOP Obat Penyebab Seketika!',
        action: 'Hentikan segera infus antibiotik atau obat injeksi yang sedang masuk. Jangan dibiarkan menetes walau sedikit.',
        isCritical: true,
      },
      {
        order: 2,
        title: 'Berikan Epinefrin (Adrenalin) Segera!',
        action: 'Injeksi Epinefrin 1:1000 dosis 0.3 - 0.5 mg Intra-Muskular (IM) di paha anterolateral (otot Vastus Lateralis). JANGAN di bokong karena absorpsi lambat. Dapat diulang tiap 5-15 menit jika tensi belum naik.',
        isCritical: true,
      },
      {
        order: 3,
        title: 'Oksigenasi & Posisi Tubuh',
        action: 'Pasang O2 Non-Rebreathing Mask (NRM) 10-15 Lpm. Baringkan pasien telentang dengan posisi kaki ditinggikan (Trendelenburg) untuk memperbaiki aliran darah ke otak dan jantung.',
      },
      {
        order: 4,
        title: 'Resusitasi Cairan Cepat',
        action: 'Guyur cairan kristaloid isotonik (NaCl 0.9% atau Ringer Lactate) 1000 - 2000 mL secepat mungkin melalui IV line ukuran besar (nomor 18G/20G).',
      },
      {
        order: 5,
        title: 'Terapi Sekunder (Setelah Epinefrin)',
        action: 'Kolaborasi pemberian Dexamethasone 10-20 mg IV dan Diphenhydramine 50 mg IV untuk mencegah reaksi fase lambat. Pantau TTV tiap 5 menit.',
      },
    ],
    ceklis: [
      'Jalur IV line paten (abocath 18G/20G)',
      'Ampul Epinefrin 1:1000 dan spuit 1cc/3cc tersedia',
      'Tabung O2 dan masker NRM mengalir baik',
      'Tensimeter dan pulse oximeter terpasang continuous',
    ]
  },
  {
    id: 'codeblue',
    title: 'Henti Jantung di Ruangan (Code Blue / RJP)',
    category: 'Resusitasi Jantung Paru',
    urgency: 'Sangat Kritis',
    badge: 'AHA Protocol',
    color: 'rose',
    tandaKunci: 'Pasien tidak sadar, tidak bernapas atau hanya napas megap-megap (gasping), dan nadi karotis tidak teraba.',
    steps: [
      {
        order: 1,
        title: 'Aman Diri & Cek Respon Pasien',
        action: 'Tepuk bahu pasien dengan tegas: "Pak/Bu, buka matanya!". Cek apakah ada gerakan atau napas normal.',
      },
      {
        order: 2,
        title: 'Aktivasi CODE BLUE!',
        action: 'Segera tekan tombol code blue atau teriak lantang: "CODE BLUE RUANG [Nama Ruangan] BED [Nomor Bed]!". Minta rekan membawa troli resusitasi dan defibrilator/AED.',
        isCritical: true,
      },
      {
        order: 3,
        title: 'Raba Nadi Karotis (< 10 Detik)',
        action: 'Raba arteri karotis di leher selama 5-10 detik. Jika ragu atau tidak teraba sama sekali, LANGSUNG MULAI KOMPRESI DADA!',
        isCritical: true,
      },
      {
        order: 4,
        title: 'Kompresi Dada Berkualitas Tinggi (High-Quality CPR)',
        action: 'Letakkan papan resusitasi (cardiac board) di bawah punggung pasien. Tekan di tengah dada dengan kecepatan 100-120 x/menit, kedalaman 5-6 cm, beri recoil dada sempurna, dan minimalkan interupsi.',
        isCritical: true,
      },
      {
        order: 5,
        title: 'Siklus 30 : 2 & Defibrilasi',
        action: 'Berikan 30 kompresi dada diikuti 2 ventilasi dengan Bag-Valve-Mask (ambu bag) disambung O2. Nyalakan AED/Defibrilator segera setelah tiba untuk cek irama (Shockable vs Non-Shockable). Ganti kompresor tiap 2 menit.',
      },
    ],
    ceklis: [
      'Papan resusitasi terpasang di bawah punggung',
      'Ambu bag tersambung ke tabung oksigen 10-15 Lpm',
      'Defibrilator terhubung ke listrik dan pad/paddle siap gel',
      'Spuit, Epinefrin 1mg, dan Amiodarone siap di troli',
    ]
  },
  {
    id: 'hipoglikemia',
    title: 'Hipoglikemia Akut (GDS < 70 mg/dL)',
    category: 'Kegawatdaruratan Metabolik',
    urgency: 'Tinggi',
    badge: 'Rule of 15',
    color: 'amber',
    tandaKunci: 'Pasien lemas mendadak, keringat dingin membasahi baju, tremor/gemetar, takikardia, gelisah, disorientasi, atau pingsan.',
    steps: [
      {
        order: 1,
        title: 'Cek GDS Stik Cito',
        action: 'Segera lakukan penusukan darah kapiler untuk tes GDS. Nilai < 70 mg/dL mengonfirmasi hipoglikemia, nilai < 54 mg/dL adalah hipoglikemia berat.',
      },
      {
        order: 2,
        title: 'Jika Pasien SADAR (Bisa Menelan):',
        action: 'Terapkan "Rule of 15": Berikan 15-20 gram karbohidrat murni cepat serap (1 gelas air gula hangat atau 1 kotak teh manis kemasan). Minta pasien minum perlahan.',
      },
      {
        order: 3,
        title: 'Jika Pasien PENURUNAN KESADARAN / KOMA:',
        action: 'JANGAN memberikan minuman lewat mulut (risiko tinggi aspirasi paru!). Pastikan IV line paten, bolus Dextrose 40% (D40%) 2 vial (50 mL) intravena secara perlahan dalam 3-5 menit.',
        isCritical: true,
      },
      {
        order: 4,
        title: 'Infus Lanjutan & Evaluasi Ulang',
        action: 'Pasang infus Dextrose 10% (D10%) kecepatan 20 TPM (makro). Cek ulang GDS stik 15 menit setelah intervensi. Jika masih < 100 mg/dL, bolus ulang 1 vial D40%.',
      },
      {
        order: 5,
        title: 'Cari Penyebab & Dokumentasi',
        action: 'Cek apakah pasien sudah disuntik insulin tapi makannya telat, atau ada penurunan fungsi ginjal/hati. Catat jam dan respon pasien.',
      },
    ],
    ceklis: [
      'Glukometer, strip, dan lancet',
      'Dextrose 40% (D40%) 2 ampul/vial',
      'Cairan infus Dextrose 10% (D10%)',
      'Teh manis / larutan gula jika sadar',
    ]
  },
  {
    id: 'ekstravasasi',
    title: 'Ekstravasasi Infus Pekat / High Alert',
    category: 'Komplikasi Akses Vaskular',
    urgency: 'Tinggi',
    badge: 'Cegah Nekrosis',
    color: 'orange',
    tandaKunci: 'Bengkak keras di sekitar insersi infus, nyeri terbakar/panas yang dikeluhkan pasien, kulit pucat atau melepuh saat obat masuk (misal KCl, Kalsium, Norepinefrin, Kemoterapi).',
    steps: [
      {
        order: 1,
        title: 'STOP Infus Seketika!',
        action: 'Hentikan cairan infus segera. JANGAN langsung mencabut abocath!',
        isCritical: true,
      },
      {
        order: 2,
        title: 'Aspirasi Sisa Obat dari Abocath',
        action: 'Pasang spuit kosong 3cc atau 5cc ke selang/abocath, tarik (aspirasi) mundur untuk menyedot sebanyak mungkin sisa cairan obat pekat yang masih terjebak di jaringan bawah kulit.',
      },
      {
        order: 3,
        title: 'Cabut Kanul & Tandai Batas Kulit',
        action: 'Setelah diaspirasi maksimal, cabut jarum abocath secara steril. Gambar batas tepi bengkak/kemerahan di kulit menggunakan spidol/pulpen agar perkembangan nekrosis terpantau jelas per shift.',
      },
      {
        order: 4,
        title: 'Protokol Kompres Suhu Sesuai Obat',
        action: 'Kompres DINGIN (es dibungkus kain) untuk obat hipertonik/pekat (KCl 7.46%, NaCl 3%, Kalsium Glukonat, Kontras, Antibiotik) selama 15-20 menit tiap 4 jam. Kompres HANGAT HANYA untuk alkaloid vinka (Vinkristin/Vinblastin).',
      },
      {
        order: 5,
        title: 'Elevasi Tangan & Lapor DPJP',
        action: 'Posisikan tangan/kaki yang bengkak lebih tinggi dari level jantung untuk mempercepat reabsorpsi cairan jaringan. Pasang IV line baru di ekstremitas yang berlawanan.',
      },
    ],
    ceklis: [
      'Spuit 3cc/5cc untuk aspirasi sisa obat',
      'Spidol permanen penanda batas lesi',
      'Kompres es / warm pack steril',
      'Formulir Laporan Insiden Keselamatan Pasien (IKP)',
    ]
  },
  {
    id: 'kejang',
    title: 'Kejang Akut Pasien di Tempat Tidur',
    category: 'Kegawatdaruratan Neurologi',
    urgency: 'Kritis',
    badge: 'Airway & Safety',
    color: 'teal',
    tandaKunci: 'Gerakan kelonjotan tonik-klonik seluruh tubuh, mata mendelik ke atas, lidah tergigit, busa di mulut, tidak sadar.',
    steps: [
      {
        order: 1,
        title: 'Jaga Keamanan & Lindungi Kepala',
        action: 'Letakkan bantal empuk atau lipatan selimut di bawah kepala pasien agar tidak terbentur dinding atau besi bed. Pasang pengaman tempat tidur (side rails) dengan dialasi kain.',
      },
      {
        order: 2,
        title: 'JANGAN Masukkan Apapun ke Mulut!',
        action: 'Haram memasukkan sendok, kain, atau jari perawat ke mulut pasien! Ini mitos berbahaya yang berisiko mematahkan gigi pasien atau menyumbat jalan napas total.',
        isCritical: true,
      },
      {
        order: 3,
        title: 'Miringkan Pasien (Posisi Pemulihan)',
        action: 'Miringkan tubuh pasien ke salah satu sisi (kiri/kanan) agar air liur atau muntahan mengalir keluar dan tidak teraspirasi masuk ke paru-paru.',
      },
      {
        order: 4,
        title: 'Beri O2 & Catat Durasi Kejang',
        action: 'Berikan O2 kanul/masker, bersihkan jalan napas dengan suction jika lendir menumpuk. Perhatikan jam: catat berapa menit kejang berlangsung.',
      },
      {
        order: 5,
        title: 'Kolaborasi Antikonvulsan Cito',
        action: 'Jika kejang > 5 menit (Status Epileptikus), kolaborasi injeksi Diazepam 5-10 mg IV pelan (kecepatan 2 mg/menit) atau Diazepam rektal suppositoria jika IV line lepas.',
      },
    ],
    ceklis: [
      'Side rails tempat tidur terkunci rapat',
      'Mesin suction dan kateter suction steril',
      'Tabung O2 dan masker',
      'Ampul Diazepam IV / Rektal',
    ]
  },
  {
    id: 'desaturasi',
    title: 'Desaturasi Akut (SpO2 Drop < 90%)',
    category: 'Gawat Napas Ruangan',
    urgency: 'Kritis',
    badge: 'ABC Airway First',
    color: 'bluesky',
    tandaKunci: 'Saturasi O2 turun drastis di monitor, pasien mengeluh sesak berat, napas cuping hidung, retraksi dinding dada, bibir mulai sianosis/kebiruan.',
    steps: [
      {
        order: 1,
        title: 'Cek Alat & Probe Sensor Oximeter',
        action: 'Pastikan probe oximeter terpasang rapat di jari yang hangat dan tidak ada cat kuku tebal. Pastikan tangan tersebut tidak sedang dipasang manset tensi otomatis.',
      },
      {
        order: 2,
        title: 'Posisikan High-Fowler (Tegak 90 Derajat)',
        action: 'Segera naikkan sandaran bed pasien ke posisi duduk tegak (High-Fowler) untuk memaksimalkan ekspansi paru dan menurunkan diafragma.',
      },
      {
        order: 3,
        title: 'Eskalasi Terapi Oksigen Cepat',
        action: 'Jika dari nasal kanul (2-4 Lpm) tetap drop, segera ganti ke Simple Mask 6-8 Lpm atau Non-Rebreathing Mask (NRM) 10-15 Lpm hingga kantong reservoir mengembang sempurna.',
        isCritical: true,
      },
      {
        order: 4,
        title: 'Bersihkan Jalan Napas (Suction)',
        action: 'Cek apakah ada gurgling (suara kumur karena dahak menumpuk). Lakukan suction steril jika pasien tidak mampu batuk efektif.',
      },
      {
        order: 5,
        title: 'Auskultasi Paru & Lapor DPJP',
        action: 'Dengarkan suara paru: apakah wheezing (bronkospasme butuh nebulizer) atau ronkhi basah (edema paru butuh Furosemide). Laporkan ke DPJP untuk rencana cek AGD dan foto rontgen thorax cito.',
      },
    ],
    ceklis: [
      'Masker NRM 10-15 Lpm dengan kantong udara',
      'Mesin suction dan selang konektor siap sedot',
      'Stetoskop untuk auskultasi suara napas',
      'Set nebulizer dan obat bronkodilator',
    ]
  }
];
