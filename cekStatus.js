// ==========================================
// 1. VALIDASI DATA & AKUN PENGGUNA (ROLE)
// ==========================================
const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) { // mengecek apakah user belum login
    window.location.href = "login.html";
}

const sidebarRoleText = document.getElementById("sidebarRoleText"); // mengambil elemen berdasarkan id
const iconDesktop = document.getElementById("iconMenuKeduaDesktop");
const textDesktop = document.getElementById("textMenuKeduaDesktop");
const iconMobile = document.getElementById("iconMenuKeduaMobile");
const textMobile = document.getElementById("textMenuKeduaMobile");

if (currentUser && currentUser.role === "penjual") {

    if (sidebarRoleText)
        sidebarRoleText.innerText = "Dashboard Penjual";

    if (iconDesktop)
        iconDesktop.innerText = "store";

    if (textDesktop)
        textDesktop.innerText = "Operasional";

    if (iconMobile)
        iconMobile.innerText = "store";

    if (textMobile)
        textMobile.innerText = "Operasional";

} else {

    if (sidebarRoleText)
        sidebarRoleText.innerText = "Dashboard ";
}

// ==========================================
// 2. NAVIGASI TOMBOL BACK
// ==========================================
const btnBack = document.getElementById("btnBack");

if (btnBack) {

    btnBack.addEventListener("click", function () {
        goHome();
    });
}

// ==========================================
// 3. INISIALISASI NOMOR PESANAN
// ==========================================
let nomorRandom = localStorage.getItem("nomorPesanan");

if (!nomorRandom) {

    nomorRandom =
        "#KH-" + Math.floor(1000 + Math.random() * 9000); // membuat angka acak 4 digit

    localStorage.setItem("nomorPesanan", nomorRandom);
}

document.getElementById("nomorPesanan").value =
    nomorRandom; // menampilkan nomor otomatis ke input

// ==========================================
//  mengambil status terakhir
// ==========================================
const savedStatus =
    localStorage.getItem("statusPesanan") || "dibuat";

renderTimeline(savedStatus); // menampilkan status

// ==========================================
//  TOMBOL CEK STATUS
// ==========================================
document
    .getElementById("btnCekStatus")
    .addEventListener("click", function () {

        // Ambil nama dari pengguna yang sedang login saat ini
        const username = currentUser ? currentUser.name : "guest";
        const cartKey = `pesanan_${username}`; // Menyesuaikan dengan kunci unik di pesanan.js

        const pesanan = JSON.parse(localStorage.getItem(cartKey)) || []; // mengambil daftar pesanan unik
        
        if (pesanan.length === 0) {

            alert("Belum ada pesanan di dalam sistem!");
            return;
        }

        const currentStatus =
            localStorage.getItem("statusPesanan") || "dibuat";

        const listPesanan =
            document.getElementById("listPesanan");

        listPesanan.innerHTML = ""; // membersihkan tampilan lama

        let total = 0; // menyimpan total harga semua pesanan

        // ==========================================
        // RENDER LIST PESANAN / menampilkan total belanja
        // ==========================================
        pesanan.forEach(function (item) { // mengulang semua data pesanan

            total += item.harga * item.jumlah;

            listPesanan.innerHTML += `
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex justify-between items-center">

                    <div>
                        <h4 class="font-bold text-gray-800">
                            ${item.nama} 
                        </h4> 

                        <p class="text-sm text-gray-500 mt-1">
                            Jumlah: ${item.jumlah}
                        </p>
                    </div>

                    <div class="font-bold text-navy-custom">
                        Rp ${(item.harga * item.jumlah)
                            .toLocaleString("id-ID")}
                    </div>

                </div>
            `;
        });

        document.getElementById("totalHarga").innerHTML =
            "Total Harga: Rp " +
            total.toLocaleString("id-ID");

        // ==========================================
        // RENDER TIMELINE STATUS PESANAN
        // ==========================================
        renderTimeline(currentStatus);

        alert("Pesanan ditemukan!");
    });

// ==========================================
// 6. RENDER TIMELINE STATUS
// ==========================================
function renderTimeline(status) {
    const container = document.getElementById("timelineContainer");
    const itemsContainer = document.getElementById("timelineItems");
    const pesanDibatalkan = document.getElementById("pesanDibatalkan");

    if (!container || !itemsContainer) return;

    container.classList.remove("hidden");
    itemsContainer.innerHTML = "";

    // 1. DAFTAR STATUS (Sekarang ditambah status batal)
    const steps = [
        { id: "dibuat", title: "Pesanan Dibuat", desc: "Pesanan berhasil dikirim ke kantin." },
        { id: "diproses", title: "Sedang Diproses", desc: "Makanan/minuman sedang disiapkan oleh penjual." },
        { id: "selesai", title: "Selesai", desc: "Pesanan siap diambil atau sudah selesai." }
    ];

    // Jika statusnya batal, tampilkan pesan merah khusus pembatalan
    if (status === "batal") {
        if (pesanDibatalkan) pesanDibatalkan.classList.remove("hidden");
    } else {
        if (pesanDibatalkan) pesanDibatalkan.classList.add("hidden");
    }

    const currentIndex = steps.findIndex(step => step.id === status);

    // 2. LOOP STEP TIMELINE
    steps.forEach((step, index) => {
        let iconContent = "";
        let badgeColor = "";
        let textColor = "";

        // JIKA PESANAN BATAL: Semua timeline dinonaktifkan (jadi abu-abu)
        if (status === "batal") {
            badgeColor = "bg-gray-200 text-gray-400";
            textColor = "text-gray-400 font-medium";
            iconContent = `<div class="w-2 h-2 bg-gray-400 rounded-full"></div>`;
        }
        // STEP SUDAH LEWAT
        else if (index < currentIndex) {
            badgeColor = "bg-green-600 text-white";
            textColor = "text-green-600 font-bold";
            iconContent = `<span class="material-symbols-outlined text-sm">check</span>`;
        }
        // STEP AKTIF
        else if (index === currentIndex) {
            if (status === "selesai") {
                badgeColor = "bg-green-600 text-white";
                textColor = "text-green-600 font-bold";
                iconContent = `<span class="material-symbols-outlined text-sm">check</span>`;
            } else {
                badgeColor = "bg-yellow-400 flex items-center justify-center";
                textColor = "text-yellow-600 font-bold";
                iconContent = `<div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>`;
            }
        }
        // STEP BELUM TERCAPAI
        else {
            badgeColor = "bg-gray-200 text-gray-400";
            textColor = "text-gray-400 font-medium";
            iconContent = `<div class="w-2 h-2 bg-gray-400 rounded-full"></div>`;
        }

        const paddingBottom = index === steps.length - 1 ? "pb-0" : "pb-10";

        itemsContainer.innerHTML += `
            <div class="relative flex gap-5 ${paddingBottom} ${currentUser.role === "penjual" ? "cursor-pointer" : "cursor-default"}"
                 onclick="ubahStatus('${step.id}')"> 
                <div class="w-6 h-6 rounded-full ${badgeColor} flex items-center justify-center z-10">
                    ${iconContent}
                </div>
                <div>
                    <h3 class="${textColor} uppercase text-sm md:text-base">${step.title}</h3>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">${step.desc}</p>
                </div>
            </div>
        `;
    });
}

    // ==========================================
    // STEP STATUS
    // ==========================================
    const steps = [ // menyinpan daftar status

        {
            id: "dibuat",
            title: "Pesanan Dibuat",
            desc: "Pesanan berhasil dikirim ke kantin."
        },

        {
            id: "diproses",
            title: "Sedang Diproses",
            desc: "Makanan/minuman sedang disiapkan oleh penjual."
        },

        {
            id: "selesai",
            title: "Selesai",
            desc: "Pesanan siap diambil atau sudah selesai."
        }
    ];

    const currentIndex =
        steps.findIndex(step => step.id === status); // mencari posisi status saat ini 

    // ==========================================
    // LOOP STEP
    // ==========================================
    steps.forEach((step, index) => { // mengulang semua step timeline

        let iconContent = "";
        let badgeColor = "";
        let textColor = "";

        // ==========================================
        // STEP SUDAH LEWAT
        // ==========================================
        if (index < currentIndex) { // status sebelumnya hijau checklist

            badgeColor =
                "bg-green-600 text-white";

            textColor =
                "text-green-600 font-bold";

            iconContent = `
                <span class="material-symbols-outlined text-sm">
                    check
                </span>
            `;
        }

        // ==========================================
        // STEP AKTIF
        // ==========================================
        else if (index === currentIndex) { // status yang selesai

            // STEP SELESAI
            if (status === "selesai") {

                badgeColor =
                    "bg-red-500 text-white";

                textColor =
                    "text-red-500 font-bold";

                iconContent = `
                    <span class="material-symbols-outlined text-sm">
                        check
                    </span>
                `;
            }

            // STEP BERJALAN
            else { // status berjalan

                badgeColor =
                    "bg-yellow-400 flex items-center justify-center";

                textColor =
                    "text-yellow-600 font-bold";

                iconContent = `
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                `;
            }
        }

        // ==========================================
        // STEP BELUM TERCAPAI
        // ==========================================
        else { // status belum tercapai

            badgeColor =
                "bg-gray-200 text-gray-400";

            textColor =
                "text-gray-400 font-medium";

            iconContent = `
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
            `;
        }

        const paddingBottom =
            index === steps.length - 1 // mengecek step terakhir
                ? "pb-0"
                : "pb-10";

        // ==========================================
        // RENDER HTML STEP
        // ==========================================
        itemsContainer.innerHTML += `

            <div 
                class="relative flex gap-5 ${paddingBottom}
                ${currentUser.role === "penjual" 
                    ? "cursor-pointer"
                    : "cursor-default"}"

                onclick="ubahStatus('${step.id}')"
            > 

                <div class="w-6 h-6 rounded-full ${badgeColor}
                    flex items-center justify-center z-10">

                    ${iconContent}

                </div>

                <div>

                    <h3 class="${textColor}
                        uppercase text-sm md:text-base">

                        ${step.title}

                    </h3>

                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">

                        ${step.desc}

                    </p>

                </div>

            </div>
        `;
    });


// ==========================================
// 7. UBAH STATUS PESANAN
// ==========================================
function ubahStatus(statusBaru) {

    // ==========================================
    // VALIDASI ROLE PENJUAL
    // ==========================================
    if (currentUser.role !== "penjual") {

        alert("Hanya penjual yang dapat mengubah status!");
        return;
    }

    // ==========================================
    // SIMPAN STATUS
    // ==========================================
    localStorage.setItem(
        "statusPesanan",
        statusBaru
    );

    // ==========================================
    // memperbarui tampilan ULANG TIMELINE
    // ==========================================
    renderTimeline(statusBaru);

    alert(
        "Status berhasil diubah menjadi: " +
        statusBaru
    );
}

// ==========================================
// 8. NAVIGASI HALAMAN
// ==========================================
function goHome() {

    if (currentUser.role === "penjual") {

        window.location.href =
            "DasboardPenjual.html";

    } else {

        window.location.href =
            "Dasboard.html";
    }
}

function goMenuKedua() {

    if (!currentUser) {

        window.location.href = "login.html";
        return;
    }

    if (currentUser.role === "penjual") {

        window.location.href =
            "OperasionalPenjual.html";

    } else {

        window.location.href =
            "Pesanan.html";
    }
}
