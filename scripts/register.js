// Kiểm tra xem người dùng đã đăng nhập chưa
// Nếu đã đăng nhập -> Có thông tin trong localStorage -> Chuyển hướng sang trang index.html
if (localStorage.getItem("curentUser")) {
    location.href = "index.html";
}

// Lấy thông tin từ form đăng ký
let form = document.querySelector("form");

// Lắng nghe sự kiện submit của form
form.addEventListener("submit", (e) => {
    // Ngăn chặn hành vi mặc định của form (tải lại trang)
    e.preventDefault();

    // Lấy giá trị username từ input
    // trim() dùng để xóa khoảng trắng ở đầu và cuối chuỗi
    let username = document.getElementById("username").value.trim();

    // Lấy email người dùng
    let email = document.getElementById("email").value.trim();

    // Lấy mật khẩu
    let password = document.getElementById("password").value;

    // Regex kiểm tra có chứa chữ thường hay không
    let lowerCaseLetter = /[a-z]/g;

    // Regex kiểm tra có chứa chữ hoa hay không
    let upperCaseLetter = /[A-Z]/g;

    // Regex kiểm tra có chứa số hay không
    let numbers = /[0-9]/g;

    // Kiểm tra username có ít nhất 6 ký tự không
    if (username.length < 6) {

        // Nếu không đủ thì báo lỗi
        alert("Username must be at least 6 characters");

        // Kiểm tra password có ít nhất 8 ký tự không
    } else if (password.length < 8) {

        alert("Password must be at least 8 characters");

        // Kiểm tra password có chứa ít nhất 1 chữ thường không
    } else if (!password.match(lowerCaseLetter)) {

        alert("Password must contain a lowercase letter");

        // Kiểm tra password có chứa ít nhất 1 chữ hoa không
    } else if (!password.match(upperCaseLetter)) {

        alert("Password must contain an uppercase letter");

        // Kiểm tra password có chứa ít nhất 1 số không
    } else if (!password.match(numbers)) {

        alert("Password must contain a number or special character");

    } else {

        // Nếu localStorage đã có danh sách users
        if (localStorage.getItem("users")) {

            // Chuyển chuỗi JSON thành mảng JavaScript
            let users = JSON.parse(localStorage.getItem("users"));

            // Thêm người dùng mới vào mảng
            users.push({
                email: email,
                password: password,
                username: username,
            });

            // Chuyển mảng thành chuỗi JSON rồi lưu lại
            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

        } else {

            // Nếu chưa có users trong localStorage
            // tạo mới một mảng chứa user đầu tiên
            localStorage.setItem(
                "users",
                JSON.stringify([
                    {
                        email: email,
                        password: password,
                        username: username,
                    },
                ])
            );
        }

        // Thông báo đăng ký thành công
        alert("User created successfully, please login");

        // Chuyển sang trang đăng nhập
        location.href = "./login.html";
    }
});