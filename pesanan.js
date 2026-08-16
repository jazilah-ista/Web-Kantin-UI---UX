// ==========================================
// NAVIGATION & LOGIC EVENT HANDLERS
// ==========================================

// Event klik tombol Kembali (Back) berdasarkan peran akun
document.getElementById("btnBack").addEventListener("click", function () {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    if (user.role === "penjual") {
        window.location.href = "DasboardPenjual.html";
    } else {
        window.location.href = "Dasboard.html";
    }
});

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", renderMenu);
}    let kategoriAktif = "semua";



// Mengubah status visual tombol tab aktif
function setActiveTab(button) {
    const tabs = document.querySelectorAll(".tab-button");
    tabs.forEach(tab => {
        tab.classList.remove("active-tab"); // reset tab
    });
    button.classList.add("active-tab"); // style aktif
}

// Buka/tutup kontainer pop-up filter kategori cepat
const btnFilter = document.getElementById("btnFilter");
const filterBox = document.getElementById("filterBox");

if (btnFilter && filterBox) {
    btnFilter.addEventListener("click", function () {
        filterBox.classList.toggle("hidden");
    });
}

// Fungsi pengarah tombol Beranda (Home) sesuai otentikasi role
function goHome() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    if (user.role === "penjual") {
        window.location.href = "DasboardPenjual.html";
    } else {
        window.location.href = "Dasboard.html";
    }
}

// Menambahkan data produk pesanan ke LocalStorage
function tambahPesanan(namaMenu, hargaMenu) {
    // Ambil data user yang login untuk mendapatkan namanya
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.name : "guest";
    const cartKey = `pesanan_${username}`; // Membuat kunci unik, misal: pesanan_zila

    // Ambil daftar pesanan berdasarkan nama user yang aktif
    let daftarPesanan = JSON.parse(localStorage.getItem(cartKey)) || [];

    const item = daftarPesanan.find(menu => menu.nama === namaMenu);

    if (item) {
        item.jumlah++;
    } else {
        daftarPesanan.push({
            nama: namaMenu,
            harga: hargaMenu,
            jumlah: 1
        });
    }

    // Simpan kembali menggunakan cartKey yang unik
    localStorage.setItem(cartKey, JSON.stringify(daftarPesanan));

    updateFloatingCart();
}

function updateFloatingCart() {
    // Ambil data user yang login untuk mendapatkan namanya
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.name : "guest";
    const cartKey = `pesanan_${username}`;

    const daftarPesanan = JSON.parse(localStorage.getItem(cartKey)) || [];
    const floatingCart = document.getElementById("floatingCart");

    const cartJumlah = document.getElementById("cartJumlah");
    const cartMenu = document.getElementById("cartMenu");
    const cartHarga = document.getElementById("cartHarga");
    const badgeCart = document.getElementById("badgeCart");

    if (daftarPesanan.length === 0) {
        if (floatingCart) floatingCart.classList.add("hidden");
        if (cartJumlah) cartJumlah.innerHTML = "0 Item";
        if (cartMenu) cartMenu.innerHTML = "";
        if (cartHarga) cartHarga.innerHTML = "";
        if (badgeCart) badgeCart.innerHTML = 0;
        return;
    }

    // total hidangan
    let total = 0;
    daftarPesanan.forEach(item => {
        total += item.jumlah;
    });

    let html = "";
    let totalHarga = 0;

    daftarPesanan.forEach(item => {
        totalHarga += item.harga * item.jumlah;
        html += `
        <div class="flex justify-between items-center py-2 border-b">
            <div>
                <p class="font-semibold">${item.nama}</p>
                <p class="text-sm text-gray-500">
                    Rp ${item.harga.toLocaleString("id-ID")}
                </p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="kurangiPesanan('${item.nama}')" class="bg-gray-200 w-8 h-8 rounded-full">-</button>
                <span>${item.jumlah}</span>
                <button onclick="tambahPesanan('${item.nama}',${item.harga})" class="bg-primary text-white w-8 h-8 rounded-full">+</button>
            </div>
        </div>`;
    });

    if (cartJumlah) cartJumlah.innerHTML = total + " Item";
    if (cartMenu) cartMenu.innerHTML = html;
    if (cartHarga) cartHarga.innerHTML = "<b>Total : Rp " + totalHarga.toLocaleString("id-ID") + "</b>";
    if (badgeCart) badgeCart.innerHTML = total;
    
    if (floatingCart) floatingCart.classList.remove("hidden");

    if (floatingCart) {
        floatingCart.animate(
            [
                { transform: "scale(.9)", opacity: 0.6 },
                { transform: "scale(1)", opacity: 1 }
            ],
            { duration: 250 }
        );
    }
}

function kurangiPesanan(namaMenu) {
    // Ambil data user yang login untuk mendapatkan namanya
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.name : "guest";
    const cartKey = `pesanan_${username}`;

    let daftarPesanan = JSON.parse(localStorage.getItem(cartKey)) || [];

    const item = daftarPesanan.find(menu => menu.nama === namaMenu);

    if (!item) return;

    item.jumlah--;

    if (item.jumlah <= 0) {
        daftarPesanan = daftarPesanan.filter(menu => menu.nama !== namaMenu);
    }

    // Simpan kembali menggunakan cartKey yang unik
    localStorage.setItem(cartKey, JSON.stringify(daftarPesanan));

    updateFloatingCart();
}




function renderMenu() {

    const keyword = searchInput.value.toLowerCase();

    const items = document.querySelectorAll(".menu-item");

    items.forEach(item => {

        const nama = item.querySelector(".menu-name")
            .textContent
            .toLowerCase();

        const cocokKategori =
            kategoriAktif === "semua" ||
            kategoriAktif === "menu" ||
            item.classList.contains(kategoriAktif);

        const cocokSearch =
            nama.includes(keyword);

        item.style.display =
            cocokKategori && cocokSearch
                ? "flex"
                : "none";

    });

}
searchInput.addEventListener("keyup", renderMenu);


function filterMenu(kategori) {

    kategoriAktif = kategori;

    renderMenu();

}



// Logika navigasi dinamis untuk menu kedua berdasarkan jenis pengguna
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
