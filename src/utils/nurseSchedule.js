// Logika Waktu, Sapaan Shift & Pengingat Ibadah / Nutrisi Ners

export const getTimeGreeting = (date = new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeVal = hours + minutes / 60;

  if (timeVal >= 5 && timeVal < 12) {
    return {
      greeting: "Semangat pagi, selamat dinas!",
      shiftName: "Shift Pagi",
      icon: "sun",
      desc: "Awali hari dengan bismillah dan cek kelengkapan troli tindakan."
    };
  } else if (timeVal >= 12 && timeVal < 15) {
    return {
      greeting: "Siang yang sibuk, tetap fokus ya!",
      shiftName: "Shift Siang",
      icon: "sun-medium",
      desc: "Jangan lupa isi energi dan hidrasi di sela-sela operan siang."
    };
  } else if (timeVal >= 15 && timeVal < 19) {
    return {
      greeting: "Sore! Bentar lagi operan shift nih.",
      shiftName: "Shift Sore",
      icon: "sunset",
      desc: "Pastikan catatan SBAR dan infus pasien sudah terdokumentasi rapi."
    };
  } else {
    return {
      greeting: "Dinas malam? Jangan lupa jaga kesehatan tubuhmu sendiri.",
      shiftName: "Shift Malam",
      icon: "moon",
      desc: "Tetap waspada, atur ritme istirahat gantian, dan jaga kehangatan."
    };
  }
};

export const getDailyQuote = (date = new Date()) => {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

  const quotes = {
    0: {
      day: "Minggu",
      quote: "Orang lain libur, kamu tetap mengabdi. Semangat pahala berlipat hari ini!",
      highlight: "Pengabdian Tanpa Batas"
    },
    1: {
      day: "Senin",
      quote: "Awal minggu yang berat, tapi S.Kep sepertimu pasti bisa handle semuanya!",
      highlight: "S.Kep Tangguh & Profesional"
    },
    2: {
      day: "Selasa",
      quote: "Selasa penuh berkah! Tetap teliti dalam setiap dokumentasi asuhan keperawatan.",
      highlight: "Akurasi & Ketelitian"
    },
    3: {
      day: "Rabu",
      quote: "Sudah pertengahan minggu! Dedikasi dan senyum tulusmu meringankan beban pasien.",
      highlight: "Pelayanan Sepenuh Hati"
    },
    4: {
      day: "Kamis",
      quote: "Kamis produktif! Pastikan hidrasi cukup dan rehat sejenak di sela observasi TTV.",
      highlight: "Jaga Stamina Diri"
    },
    5: {
      day: "Jumat",
      quote: "Menjelang akhir pekan! Tetap senyum walau pasien IGD lagi ramai.",
      highlight: "Energi Positif & Ikhlas"
    },
    6: {
      day: "Sabtu",
      quote: "Kebaikan dan ketulusanmu merawat hari ini adalah ladang berkah luar biasa.",
      highlight: "Ladang Pahala Terbaik"
    }
  };

  return quotes[day] || quotes[1];
};

export const SCHEDULED_REMINDERS = [
  {
    id: 'zuhur-lunch',
    time: '12:15',
    title: 'Waktu Zuhur & Makan Siang',
    category: 'Sholat & Nutrisi',
    badge: '12:15 WIB',
    message: 'Udah masuk Zuhur nih. TTV pasien bisa nunggu bentar, jangan lupa makan siang ya!',
    urgent: false
  },
  {
    id: 'ashar',
    time: '15:40',
    title: 'Waktu Sholat Ashar',
    category: 'Ibadah',
    badge: '15:40 WIB',
    message: 'Waktu Ashar telah masuk. Rehat sejenak luruskan kaki dan tunaikan sholat.',
    urgent: false
  },
  {
    id: 'maghrib',
    time: '18:25',
    title: 'Waktu Sholat Maghrib',
    category: 'Ibadah & Rehat',
    badge: '18:25 WIB',
    message: 'Waktu Maghrib telah tiba. Selamat berbuka atau rehat sejenak sebelum persiapan operan shift malam.',
    urgent: false
  },
  {
    id: 'isya',
    time: '19:35',
    title: 'Waktu Sholat Isya',
    category: 'Ibadah',
    badge: '19:35 WIB',
    message: 'Waktu Isya telah masuk. Jaga stamina tubuh untuk yang lanjut dinas malam!',
    urgent: false
  }
];

// Check active reminder for current minute
export const checkCurrentReminder = (date = new Date()) => {
  const currentHours = String(date.getHours()).padStart(2, '0');
  const currentMinutes = String(date.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  return SCHEDULED_REMINDERS.find(r => r.time === currentTimeStr);
};
