// Kata Penyemangat & Apresiasi Harian Khusus Perawat Cantik (S.Kep) - Elegan, Tulus & Tidak Lebay

export const NURSE_DAILY_SWEET_WORDS = [
  {
    id: 1,
    quote: "Senyum tulus dan ketelitianmu saat operan shift selalu jadi penenang terbaik bagi seluruh pasien di ruangan ini, Ners Lala.",
    tag: "Apresiasi S.Kep"
  },
  {
    id: 2,
    quote: "Di tengah sibuknya observasi TTV dan jadwal obat, ketenangan serta kelembutan hatimu membuat suasana ruangan selalu adem.",
    tag: "Dedikasi Tulus"
  },
  {
    id: 3,
    quote: "Gelar S.Kep bukan sekadar titel di namamu, tapi tercermin nyata dari cara sabarmu merawat setiap pasien hingga pulih.",
    tag: "Profesional & Berhati Mulia"
  },
  {
    id: 4,
    quote: "Pasien dan rekan sejawat selalu merasa aman setiap kali tahu Ners Lala yang memimpin dinas hari ini.",
    tag: "Andalan Ruangan"
  },
  {
    id: 5,
    quote: "Lelahnya berdiri belasan jam pasti terbayar lunas melihat senyum pasien yang sembuh berkat sentuhan tangan hangatmu.",
    tag: "Semangat Mengabdi"
  },
  {
    id: 6,
    quote: "Ketepatanmu menghitung dosis dan ketulusanmu melayani adalah perpaduan ilmu dan empati terbaik seorang perawat sejati.",
    tag: "Presisi & Empati"
  },
  {
    id: 7,
    quote: "Dinas malam boleh terasa panjang dan dingin, tapi energi positif serta keceriaan Ners Lala selalu menghangatkan seluruh bangsal.",
    tag: "Cahaya Shift Malam"
  },
  {
    id: 8,
    quote: "Tetap jaga kesehatan tubuhmu sendiri ya, Ners. Pasien butuh asuhanmu, tapi duniamu juga butuh senyum bahagiamu.",
    tag: "Jaga Stamina"
  },
  {
    id: 9,
    quote: "Setiap tetes infus yang kau pasang dan setiap doa yang kau selipkan di tindakanmu adalah ladang kebaikan yang tak ternilai.",
    tag: "Pahala Berlipat"
  },
  {
    id: 10,
    quote: "Di mata pasien, kamu adalah harapan kesembuhan. Di mata rekan ruangan, Ners Lala adalah sosok S.Kep yang selalu bisa diandalkan.",
    tag: "Kebanggaan Ruangan"
  }
];

export const getDailyNurseSweetWord = () => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear % NURSE_DAILY_SWEET_WORDS.length);
  return NURSE_DAILY_SWEET_WORDS[index];
};
