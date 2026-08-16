// =========================
// LOGIN
// =========================
loginForm.addEventListener("submit", function (event) {

    // Mencegah reload form otomatis
    event.preventDefault();

    // Ambil input user
    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    // Ambil data localStorage
    const akunTersimpan =
        JSON.parse(localStorage.getItem("user"));

    // Cek akun
    if (!akunTersimpan) {

        alert("Akun belum terdaftar!");
        return;

    }

    // Validasi login
    if (
        email === akunTersimpan.email &&
        password === akunTersimpan.password
    ) {

        alert("Login berhasil!");

        // =========================
        // SIMPAN DATA USER AKTIF
        // =========================
        localStorage.setItem(
            "namaUser",
            akunTersimpan.nama
        );

        localStorage.setItem(
            "emailUser",
            akunTersimpan.email
        );

        localStorage.setItem(
            "teleponUser",
            akunTersimpan.telepon
        );

        localStorage.setItem(
            "roleUser",
            akunTersimpan.role
        );

        // =========================
        // REDIRECT SESUAI ROLE
        // =========================
        if (
            akunTersimpan.role.toLowerCase()
            === "admin"
        ) {

            window.location.href =
                "Dasboard.html";

        }
        else if (
            akunTersimpan.role.toLowerCase()
            === "penjual"
        ) {

            window.location.href =
                "DasboardPenjual.html";

        }
        else {

            alert("Role tidak ditemukan");

        }

    }
    else {

        alert("Email atau password salah!");

    }

});
