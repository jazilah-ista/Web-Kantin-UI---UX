// ==========================================
// NAVIGATION LOGIC (BACK & HOME)
// ==========================================

// Pengendali fungsi tombol kembali sesuai role pengguna
document.getElementById("btnBack").addEventListener("click", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) { // mengecek apakah user belum login
    window.location.href = "login.html";
    return;
  }

  if (user.role === "penjual") {
    window.location.href = "DasboardPenjual.html";
  } else {
    window.location.href = "Dasboard.html";
  }
});

// Pengendali navigasi tombol home utama halaman berdasarkan role
function goHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.role === "pembeli") {
    window.location.href = "Dasboard.html";
  } else if (user.role === "penjual") {
    window.location.href = "DasboardPenjual.html";
  } else {
    alert("Role tidak valid");
  }
}

// Navigasi menu kedua berdasarkan role
function goMenuKedua() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.role === "penjual") {
    window.location.href = "OperasionalPenjual.html";
  } else {
    window.location.href = "Pesanan.html";
  }
}

// ==========================================
// FILTER, SEARCH & RENDER LOGIC (SINKRON)
// ==========================================

const btnFilter = document.getElementById("btnFilter");
const filterMenu = document.getElementById("filterMenu");
const statusButtons = document.querySelectorAll(".statusBtn");
const searchInput = document.getElementById("searchInput");
const orderListContainer = document.getElementById("orderList");

// Ambil data pesanan asli dari localStorage
// Ambil objek user pembeli atau gunakan currentUser untuk mendeteksi cartKey yang aktif
const userAktif = JSON.parse(localStorage.getItem("user"));
const usernameOperasional = userAktif ? userAktif.name : "guest";
const cartKeyOperasional = `pesanan_${usernameOperasional}`; // Mengikuti format pesanan_zila / pesanan_dwi

// Ambil data pesanan asli dari localStorage berdasarkan cartKey yang unik
// 1. FUNGSI UNTUK MENGGABUNGKAN SEMUA PESANAN DARI SELURUH PENGGUNA
function dapatkanSemuaPesananGlobal() {
    let gabunganPesanan = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("pesanan_")) {
            const dataPesanan = JSON.parse(localStorage.getItem(key)) || [];
            // Gabungkan item makanan ke dalam satu array operasional
            gabunganPesanan = gabunganPesanan.concat(dataPesanan);
        }
    }
    return gabunganPesanan;
}

// 2. GUNAKAN HASIL GABUNGAN UNTUK OPERASIONAL PENJUAL
const daftarPesanan = dapatkanSemuaPesananGlobal();
const nomorPesananAktif = localStorage.getItem("nomorPesanan") || "#KH-0000";
const statusSaatIni = localStorage.getItem("statusPesanan") || "dibuat";

// Tampilkan menu filter popup
if (btnFilter && filterMenu) {
  btnFilter.addEventListener("click", function () {
    filterMenu.classList.toggle("hidden");
  });
}

// Fungsi utama untuk menampilkan daftar kartu pesanan ke layar penjual
function renderDaftarOperasional(filterStatus = "semua", keyword = "") {
  if (!orderListContainer) return;
  orderListContainer.innerHTML = ""; // Bersihkan tampilan lama

  if (daftarPesanan.length === 0) {
    orderListContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center py-10">Belum ada pesanan masuk di sistem.</p>`;
    return;
  }

  // Hitung total harga untuk ditampilkan di kartu penjual
  let totalHarga = 0;
  let ringkasanMenu = [];
  daftarPesanan.forEach(item => {
    totalHarga += item.harga * item.jumlah;
    ringkasanMenu.push(`${item.nama} (${item.jumlah}x)`);
  });

  // Cek apakah data cocok dengan filter status dan keyword pencarian
  const cocokStatus = (filterStatus === "semua" || filterStatus === filterStatusAktifMenebak(statusSaatIni));
  const cocokKeyword = nomorPesananAktif.toLowerCase().includes(keyword.toLowerCase());

  if (cocokStatus && cocokKeyword) {
    // Tentukan warna badge operasional berdasarkan status di cekStatus
   // Tentukan warna badge operasional berdasarkan status di cekStatus (TERBARU DENGAN BATAL)
    let badgeColor = "bg-amber-100 text-amber-700";
    let textStatusTampil = "Diproses";

    if (statusSaatIni === "dibuat") {
      badgeColor = "bg-blue-100 text-blue-700";
      textStatusTampil = "Baru Masuk";
    } else if (statusSaatIni === "selesai") {
      badgeColor = "bg-green-100 text-green-700";
      textStatusTampil = "Selesai";
    } else if (statusSaatIni === "batal") {
      badgeColor = "bg-red-100 text-red-700";
      textStatusTampil = "Batal";
    }

    
    // Render kartu pesanan milik pembeli agar bisa diklik oleh penjual
    orderListContainer.innerHTML = `
      <div onclick="window.location.href='CekStatus.html'" class="orderItem bg-white rounded-2xl p-5 border border-outline-variant shadow-sm cursor-pointer hover:border-primary transition-all">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold text-primary/60 tracking-wider">${nomorPesananAktif}</p>
            <h3 class="font-bold text-base text-gray-900 mt-1">${ringkasanMenu.join(", ")}</h3>
          </div>
          <span class="${badgeColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase">${textStatusTampil}</span>
        </div>
        <div class="mt-5 flex justify-between items-end">
          <div>
            <p class="text-sm text-gray-400">Hari Ini</p>
            <h2 class="text-xl font-bold text-primary">Rp ${totalHarga.toLocaleString("id-ID")}</h2>
          </div>
          <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
      </div>
    `;
  } else {
    orderListContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center py-10">Pesanan tidak ditemukan dengan filter ini.</p>`;
  }
}

// Fungsi bantu untuk menyamakan status data
function filterStatusAktifMenebak(statusLokal) {
  if (statusLokal === "dibuat" || statusLokal === "diproses") return "diproses";
  if (statusLokal === "selesai") return "selesai";
  return "batal";
}

// Event handler untuk tombol-tombol filter bulat (Semua, Diproses, Selesai)
statusButtons.forEach(button => {
  button.addEventListener("click", function () {
    statusButtons.forEach(btn => {
      btn.classList.remove("bg-primary", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-600");
    });
    this.classList.remove("bg-gray-100", "text-gray-600");
    this.classList.add("bg-primary", "text-white");

    renderDaftarOperasional(this.dataset.status, searchInput.value);
  });
});

// Event handler untuk pencarian live search nomor pesanan
if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    // Cari tombol status mana yang sedang aktif
    const tombolAktif = document.querySelector(".statusBtn.bg-primary");
    const statusAktif = tombolAktif ? tombolAktif.dataset.status : "semua";
    renderDaftarOperasional(statusAktif, this.value);
  });
}

// Jalankan render otomatis saat halaman operasional pertama kali dibuka
renderDaftarOperasional();
