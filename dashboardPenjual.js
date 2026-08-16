// ==========================================
// BUTTON BACK
// ==========================================
const btnBack = document.getElementById("btnBack");

if (btnBack) {
    btnBack.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}

// ==========================================
// AMBIL DATA USER
// ==========================================
let user = null;

try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    console.error("Data user rusak:", error);
    localStorage.removeItem("user");
}

// ==========================================
// VALIDASI LOGIN
// ==========================================
if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
}

// ==========================================
// TAMPILKAN NAMA USER
// ==========================================
const namaUser = document.getElementById("namaUser");

if (namaUser) {
    if (user && user.nama) {
        namaUser.textContent = user.nama;
    } else {
        namaUser.textContent = "User";
    }
}

// ==========================================
// FUNCTION HOME
// ==========================================
function goHome() {
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

// ==========================================
// FUNCTION MENU KEDUA
// ==========================================
function goMenuKedua() {
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
// RENDER SINKRONISASI DATA DASHBOARD PENJUAL
// ==========================================
function updateDashboardPenjual() {
    const daftarPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
    const nomorPesananAktif = localStorage.getItem("nomorPesanan") || "#KH-0000";
    const statusSaatIni = localStorage.getItem("statusPesanan") || "dibuat";

    // 1. HITUNG STATISTIK SECARA DINAMIS
    let totalPesananCount = daftarPesanan.length > 0 ? 1 : 0;
    let pendingCount = statusSaatIni === "dibuat" ? 1 : 0;
    let diprosesCount = statusSaatIni === "diproses" ? 1 : 0;
    let selesaiCount = statusSaatIni === "selesai" ? 1 : 0;

    // Cari elemen angka statistik di HTML berdasarkan class text-3xl
    const statSpans = document.querySelectorAll("main span.text-3xl.font-bold");
    if (statSpans.length >= 4) {
        statSpans[0].textContent = totalPesananCount; // Total Pesanan
        statSpans[1].textContent = pendingCount;      // Pending
        statSpans[2].textContent = diprosesCount;     // Diproses
        statSpans[3].textContent = selesaiCount;      // Selesai
    }

    // 2. PERBAIKAN SELECTOR: Mencari div space-y-4 terakhir yang menampung list status pesanan
    const containers = document.querySelectorAll("main div.space-y-4");
    if (containers.length === 0) return;
    
    // Mengambil container paling bawah/terakhir tempat list order berada
    const sectionStatus = containers[containers.length - 1];

    // Bersihkan daftar bawaan HTML lama, sisakan judul atasnya saja
    sectionStatus.innerHTML = `
        <div class="flex items-center justify-between">
            <h3 class="text-[20px] font-bold text-on-surface">Status Pesanan</h3>
        </div>
    `;

    if (daftarPesanan.length === 0) {
        sectionStatus.innerHTML += `<p class="text-gray-500 py-6 text-center text-sm">Belum ada pesanan masuk.</p>`;
        return;
    }

    // Gabungkan menu masukan (Contoh: Nasi Ayam Geprek (1x))
    let ringkasanMenu = daftarPesanan.map(item => `${item.nama} (${item.jumlah}x)`).join(", ");

    // Setup warna badge status pesanan
    let badgeColor = "bg-orange-100 text-orange-700";
    let textStatus = "Diproses";

    if (statusSaatIni === "dibuat") {
        badgeColor = "bg-blue-100 text-blue-700";
        textStatus = "Baru Masuk";
    } else if (statusSaatIni === "selesai") {
        badgeColor = "bg-green-100 text-green-700";
        textStatus = "Selesai";
    } else if (statusSaatIni === "batal") {
        badgeColor = "bg-red-100 text-red-700";
        textStatus = "Batal";
    }

    // Render data pesanan riil Zila ke Dashboard Doni
    sectionStatus.innerHTML += `
        <div onclick="window.location.href='CekStatus.html'" class="bg-white p-5 rounded-2xl border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary">shopping_cart</span>
                </div>
                <div>
                    <p class="font-bold text-primary text-sm">${nomorPesananAktif}</p>
                    <p class="text-xs text-on-surface-variant mt-0.5">${ringkasanMenu}</p>
                </div>
            </div>
            <span class="px-3 py-1 ${badgeColor} text-[10px] font-bold rounded-full w-fit uppercase tracking-wider">${textStatus}</span>
        </div>
    `;
}

// Pastikan fungsi berjalan saat DOM telah siap sepenuhnya
document.addEventListener("DOMContentLoaded", updateDashboardPenjual);
