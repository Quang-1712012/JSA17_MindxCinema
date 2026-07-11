// Kiểm tra xem người dùng đã đăng nhập chưa
// Nếu đã có currentUser trong localStorage
// thì chuyển thẳng sang trang chủ
if (localStorage.getItem("currentUser")) {
  location.href = "./index.html";
}

// Lấy thẻ form trong trang
let form = document.querySelector("form");

// Lắng nghe sự kiện submit của form
form.addEventListener("submit", (e) => {

  // Ngăn form reload trang
  e.preventDefault();

  // Kiểm tra xem localStorage có danh sách users hay không
  if (!localStorage.getItem("users")) {

    // Nếu chưa có tài khoản nào được tạo
    alert("No user found");

  } else {

    // Lấy danh sách user từ localStorage
    // JSON.parse() chuyển từ chuỗi JSON thành mảng JavaScript
    let users = JSON.parse(localStorage.getItem("users"));

    // Lấy thẻ input email
    let email = document.getElementById("email");

    // Lấy thẻ input password
    let password = document.getElementById("password");

    // Tìm user có email và password khớp
    // find() sẽ trả về phần tử đầu tiên thỏa mãn điều kiện
    let existingUser = users.find(
      (index) =>

        // So sánh email
        index.email === email.value.trim()

        // Và so sánh password
        && index.password === password.value.trim()
    );

    // Nếu tìm thấy user
    if (existingUser) {

      // Lưu thông tin user hiện tại
      // để xác định trạng thái đăng nhập
      localStorage.setItem(
        "currentUser",
        JSON.stringify(existingUser)
      );

      // Chuyển đến trang chủ
      location.href = "/index.html";

    } else {

      // Không tìm thấy tài khoản phù hợp
      alert("Email or password is incorrect");
    }
  }
});