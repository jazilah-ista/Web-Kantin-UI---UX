// ==========================================
// CONFIGURASI TAILWIND CUSTOM THEME
// ==========================================
tailwind.config = {

    darkMode: "class",

    theme: {

        extend: {

            colors: {

                "primary-container": "#0A2556",
                "secondary-container": "#febf1c",
                "background": "#F7FFFF",
                "surface-container-lowest": "#ffffff",
                "surface-container": "#eeeeee",
                "outline-variant": "#c5c6cd",
                "on-surface": "#1a1c1c",
                "on-surface-variant": "#44474d",
                "primary": "#0A2556"

            },

            fontFamily: {

                "headline-md": ["Plus Jakarta Sans"],
                "body-md": ["Inter"],
                "display-lg": ["Plus Jakarta Sans"]

            },

            fontSize: {

                "label-sm": [
                    "12px",
                    {
                        lineHeight: "16px",
                        fontWeight: "600"
                    }
                ],

                "headline-md": [
                    "22px",
                    {
                        lineHeight: "28px",
                        fontWeight: "600"
                    }
                ],

                "body-md": [
                    "16px",
                    {
                        lineHeight: "24px",
                        fontWeight: "400"
                    }
                ],

                "display-lg": [
                    "30px",
                    {
                        lineHeight: "38px",
                        letterSpacing: "-0.02em",
                        fontWeight: "700"
                    }
                ]

            }

        }

    }

};

// ==========================================
// BUTTON BACK
// ==========================================
const btnBack =
    document.getElementById("btnBack");

if (btnBack) {

    btnBack.addEventListener("click", function () {

        window.location.href = "login.html";

    });

}

// ==========================================
// AMBIL DATA USER
// ==========================================
const namaUser =
    localStorage.getItem("namaUser");

const roleUser =
    localStorage.getItem("roleUser");

// ==========================================
// TAMPILKAN NAMA USER
// ==========================================
const namaUserElement =
    document.getElementById("namaUser");

if (namaUserElement) {

    if (namaUser) {

        namaUserElement.textContent =
            "Halo, " + namaUser;

    } else {

        namaUserElement.textContent =
            "Halo, User";

    }

}

// ==========================================
// FUNGSI HOME
// ==========================================
function goHome() {

    if (!roleUser) {

        window.location.href = "login.html";
        return;

    }

    if (
        roleUser.toLowerCase() === "pembeli"
    ) {

        window.location.href =
            "Dasboard.html";

    }
    else if (
        roleUser.toLowerCase() === "penjual"
    ) {

        window.location.href =
            "DasboardPenjual.html";

    }
    else {

        alert("Role tidak valid");

    }

}

// ==========================================
// MENU KEDUA
// ==========================================
const iconMenuKedua =
    document.getElementById("iconMenuKedua");

const textMenuKedua =
    document.getElementById("textMenuKedua");

// UBAH TAMPILAN SESUAI ROLE
if (
    roleUser &&
    roleUser.toLowerCase() === "penjual"
) {

    if (iconMenuKedua) {

        iconMenuKedua.innerText = "store";

    }

    if (textMenuKedua) {

        textMenuKedua.innerText =
            "Operasional";

    }

}
else {

    if (iconMenuKedua) {

        iconMenuKedua.innerText =
            "shopping_cart";

    }

    if (textMenuKedua) {

        textMenuKedua.innerText =
            "Pesanan";

    }

}

// ==========================================
// FUNGSI MENU KEDUA
// ==========================================
function goMenuKedua() {

    if (!roleUser) {

        window.location.href =
            "login.html";

        return;

    }

    if (
        roleUser.toLowerCase() === "penjual"
    ) {

        window.location.href =
            "OperasionalPenjual.html";

    }
    else {

        window.location.href =
            "Pesanan.html";

    }

}
// ==========================================
// RENDER SINKRONISASI DATA DASHBOARD PEMBELI
// ==========================================
function updateDashboardPembeli() {
    // Ambil data objek user yang login untuk mendapatkan nama akunnya
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.name : "guest";
    const cartKey = `pesanan_${username}`; // Menyesuaikan kunci unik agar sinkron dengan pesanan.js

    // Ambil daftar pesanan berdasarkan kunci unik user yang aktif
    const daftarPesanan = JSON.parse(localStorage.getItem(cartKey)) || [];
    const nomorPesananAktif = localStorage.getItem("nomorPesanan") || "#KH-0000";
    const statusSaatIni = localStorage.getItem("statusPesanan") || "dibuat";
    
    // 1. Ambil container list pesanan di HTML
    const sectionPesanan = document.querySelector("main section.space-y-4");
    if (!sectionPesanan) return;

    // Bersihkan isi list pesanan terbaru bawaan HTML lama
    // Sisakan hanya judul "Pesanan Terbaru"
    sectionPesanan.innerHTML = `<div class="flex justify-between items-center"><h2 class="text-2xl font-semibold">Pesanan Terbaru</h2></div>`;

    if (daftarPesanan.length === 0) {
        sectionPesanan.innerHTML += `<p class="text-gray-500 py-4 text-center">Belum ada pesanan terbaru.</p>`;
        return;
    }

    // Buat ringkasan nama menu masukan (Contoh: Nasi Ayam Geprek, Es Teh)
    let ringkasanMenu = daftarPesanan.map(item => `${item.nama} (${item.jumlah}x)`).join(", ");

    // Sesuaikan teks status dan warnanya
    let badgeColor = "bg-orange-100 text-orange-700";
    let textStatus = "Diproses";

    if (statusSaatIni === "dibuat") {
        badgeColor = "bg-blue-100 text-blue-700";
        textStatus = "Baru";
    } else if (statusSaatIni === "selesai") {
        badgeColor = "bg-emerald-100 text-emerald-700";
        textStatus = "Selesai";
    } else if (statusSaatIni === "batal") {
        badgeColor = "bg-red-100 text-red-700";
        textStatus = "Batal";
    }

    // Masukkan data pesanan nyata 
    sectionPesanan.innerHTML += `
        <div onclick="window.location.href='CekStatus.html'" class="bg-white p-5 lg:p-6 rounded-2xl border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">shopping_cart</span>
                </div>
                <div>
                    <p class="font-semibold text-on-surface">${ringkasanMenu}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-on-surface-variant">${nomorPesananAktif}</span>
                        <span class="text-xs text-on-surface-variant">•</span>
                        <span class="text-xs text-on-surface-variant">Baru Saja</span>
                    </div>
                </div>
            </div>
            <span class="px-3 py-1 rounded-full ${badgeColor} text-xs font-semibold w-fit">${textStatus}</span>
        </div>
    `;
}

// Jalankan fungsi update saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", updateDashboardPembeli);
updateDashboardPembeli();
