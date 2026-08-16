// ==============================
// AMBIL DATA USER
// ==============================
const nama = localStorage.getItem("namaUser");
const email = localStorage.getItem("emailUser");
const telepon = localStorage.getItem("teleponUser");
const role = localStorage.getItem("roleUser");

// ==============================
// TAMPILKAN DATA USER
// ==============================
document.getElementById("namaUser").textContent =
    nama || "User";

document.getElementById("emailUser").textContent =
    email || "email@gmail.com";

document.getElementById("inputNama").value =
    nama || "";

document.getElementById("inputEmail").value =
    email || "";

document.getElementById("inputTelepon").value =
    telepon || "";

// ==============================
// UBAH MENU SESUAI ROLE
// ==============================
const sidebarText =
    document.getElementById("sidebarTextMenuKedua");

const sidebarIcon =
    document.getElementById("sidebarIconMenuKedua");

// CEK ROLE
if (role && role.toLowerCase() === "penjual") {

    // MENU PENJUAL
    sidebarText.textContent = "Operasional";
    sidebarIcon.textContent = "store";

} else {

    // MENU Admin
    sidebarText.textContent = "Pesanan";
    sidebarIcon.textContent = "shopping_cart";

}

// ==============================
// FUNGSI HOME SESUAI ROLE
// ==============================
function goHome() {

    if (role && role.toLowerCase() === "penjual") {

        window.location.href = "DasboardPenjual.html";

    } else {

        window.location.href = "Dasboard.html";

    }

}

// ==============================
// MENU KEDUA SESUAI ROLE
// ==============================
function goMenuKedua() {

    if (role && role.toLowerCase() === "penjual") {

        window.location.href = "OperasionalPenjual.html";

    } else {

        window.location.href = "Pesanan.html";

    }

}

// ==============================
// BUTTON BACK
// ==============================
const btnBack = document.getElementById("btnBack");

if (btnBack) {

    btnBack.addEventListener("click", () => {

        goHome();

    });

}

// ==============================
// UPLOAD FOTO PROFIL
// ==============================
const uploadFoto =
    document.getElementById("uploadFoto");

const btnTambahFoto =
    document.getElementById("btnTambahFoto");

const profileImage =
    document.getElementById("profileImage");

// BUKA FILE
btnTambahFoto.addEventListener("click", () => {

    uploadFoto.click();

});

// GANTI FOTO
uploadFoto.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader(); // membaca file gambar dari komputer

        reader.onload = function (e) { // manampilkan foto

            profileImage.src = e.target.result;

            // SIMPAN FOTO
            localStorage.setItem(
                "fotoProfil",
                e.target.result
            );

        };

        reader.readAsDataURL(file); // mengubah gambar menjadi teks base64 supaya bisa disimpan

    }

});

// TAMPILKAN FOTO TERSIMPAN
const savedPhoto =
    localStorage.getItem("fotoProfil");

if (savedPhoto) {

    profileImage.src = savedPhoto;

}

// ==============================
// SIMPAN PASSWORD BARU
// ==============================
const btnSimpanPassword =
    document.getElementById("btnSimpanPassword");

btnSimpanPassword.addEventListener("click", () => {

    const passwordBaru =
        document.getElementById("passwordBaru").value;

    if (passwordBaru.trim() === "") {

        alert("Password tidak boleh kosong!");
        return;

    }

    localStorage.setItem(
        "passwordUser",
        passwordBaru
    );

    alert("Password berhasil diperbarui!");

    document.getElementById("passwordBaru").value = "";

});

// ==============================
// LOGOUT
// ==============================
const btnLogout =
    document.getElementById("btnLogout");

btnLogout.addEventListener("click", () => {

    // HAPUS DATA LOGIN
    localStorage.removeItem("namaUser");
    localStorage.removeItem("emailUser");
    localStorage.removeItem("teleponUser");
    localStorage.removeItem("roleUser");

    // KEMBALI KE LOGIN
    window.location.href = "Login.html";

});
