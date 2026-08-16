// =========================
// BACK KE LOGIN
// =========================
document.getElementById("btnBackLogin")
    .addEventListener("click", function () {

        window.location.href = "login.html";

    });


// =========================
// TOGGLE PASSWORD
// =========================
const togglePassword =
    document.getElementById("togglePassword"); // fungsinya untuk mengambil tombol icon mata

const passwordInput =
    document.getElementById("password");

togglePassword.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

        } else {

            passwordInput.type = "password"; // karakter disembunyikan

        }

    }
);


// =========================
// TOGGLE KONFIRMASI PASSWORD
// =========================
const toggleKonfirmasiPassword =
    document.getElementById(
        "toggleKonfirmasiPassword"
    );

const konfirmasiPasswordInput =
    document.getElementById(
        "konfirmasiPassword"
    );

toggleKonfirmasiPassword.addEventListener(
    "click",
    function () {

        if (
            konfirmasiPasswordInput.type ===
            "password"
        ) {

            konfirmasiPasswordInput.type =
                "text";

        } else {

            konfirmasiPasswordInput.type =
                "password";

        }

    }
);


// =========================
// DAFTAR AKUN
// =========================
const btnDaftar =
    document.getElementById("btnDaftar"); // mengambil tombol daftar

btnDaftar.addEventListener(
    "click",
    function () {

        // Ambil input user
        const nama =
            document.getElementById("nama")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const telepon =
            document.getElementById("telepon")
                .value.trim();

        const password =
            document.getElementById("password")
                .value;

        const konfirmasiPassword =
            document.getElementById(
                "konfirmasiPassword"
            ).value;

        const role =
            document.getElementById("role")
                .value;

        // Validasi kosong
        if (
            nama === "" ||
            email === "" ||
            telepon === "" ||
            password === "" ||
            konfirmasiPassword === ""
        ) {

            alert("Semua data harus diisi!");
            return;

        }

        // Validasi role
        if (!role) {

            alert("Pilih role terlebih dahulu!");
            return;

        }

        // Validasi password
        if (password !== konfirmasiPassword) {

            alert(
                "Konfirmasi password tidak cocok!"
            );

            return;

        }

        // Object user
        const user = {

            nama: nama,
            email: email,
            telepon: telepon,
            password: password,
            role: role,
            foto: ""

        };

        // Simpan localStorage ke browser dengan nama user
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        alert("Pendaftaran berhasil!");

        // Redirect/ diarahkan ke login
        window.location.href =
            "login.html";

    }
);
