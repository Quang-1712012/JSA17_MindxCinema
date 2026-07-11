// Xuất API Key của TMDB để các file khác có thể import sử dụng
export const TMDB_API_KEY = "52732808f472745fe99cca607b1a7bae";

/* ============================================================
   XỬ LÝ THANH NAVBAR KHI CUỘN TRANG
============================================================ */

// Lắng nghe sự kiện cuộn chuột
addEventListener("scroll", () => {

  // Nếu đang ở đầu trang
  if (window.scrollY === 0) {

    // Xóa background của navbar
    document
      .querySelector(".navbar")
      .classList.remove("navbar-background-visible");

  } else {

    // Nếu đã cuộn xuống thì thêm background
    document
      .querySelector(".navbar")
      .classList.add("navbar-background-visible");
  }
});


/* ============================================================
   XỬ LÝ ĐĂNG XUẤT
============================================================ */

// Gắn hàm vào đối tượng window để có thể gọi bằng onclick=""
window.handleSignOut = () => {

  // Xóa thông tin user khỏi localStorage
  localStorage.removeItem("currentUser");

  // Nếu có giỏ hàng thì có thể xóa luôn
  // localStorage.removeItem("cart");

  // Reload trang
  location.reload();
};

// Hàm đăng nhập (chưa viết)
window.signIn = () => {};


/* ============================================================
   HIỂN THỊ AVATAR HOẶC NÚT LOGIN
============================================================ */

// Nếu đã đăng nhập
if (localStorage.getItem("currentUser")) {

  // Lấy thông tin user từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Thêm avatar vào navbar
  document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <div tabindex="0" class="avatar-action">

      <!-- Avatar được tạo bởi DiceBear -->
      <img src="${`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        currentUser.username
      )}`}" />

      <!-- Popup hiện khi click avatar -->
      <div class="popup">

        <!-- Nút Logout -->
        <button class="action-button" onclick="handleSignOut()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span> Logout</span>
        </button>

      </div>
    </div>
  `;

} else {

  // Nếu chưa đăng nhập thì hiển thị icon Login
  document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <a style="font-size: 25px" href="./login.html">
      <i class="fa-solid fa-right-to-bracket"></i>
    </a>
  `;
}


/* ============================================================
   TẠO GIAO DIỆN CHATBOT
============================================================ */

// Thêm toàn bộ HTML của chatbot vào cuối body
document.body.innerHTML += /*html*/ `

  <!-- Nút mở chatbot -->
  <button class="chatbot-toggler">
    <span class="material-symbols-rounded">mode_comment</span>
    <span class="material-symbols-outlined">close</span>
  </button>

  <!-- Khung chatbot -->
  <div class="chatbot">

    <!-- Header -->
    <header>
      <h2>Chatbot</h2>
      <span class="close-btn material-symbols-outlined">close</span>
    </header>

    <!-- Danh sách tin nhắn -->
    <ul class="chatbox">

      <!-- Tin nhắn mặc định của bot -->
      <li class="chat incoming">
        <span class="material-symbols-outlined">smart_toy</span>
        <p>Hi there 👋<br />How can I help you today?</p>
      </li>

    </ul>

    <!-- Ô nhập tin nhắn -->
    <div class="chat-input">

      <textarea
        placeholder="Enter a message..."
        spellcheck="false"
        required
      ></textarea>

      <!-- Nút gửi -->
      <span id="send-btn" class="material-symbols-rounded">send</span>

    </div>
  </div>

  <!-- Google Analytics -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-VNJX66Z0YF"
  ></script>

  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("js", new Date());
    gtag("config", "G-VNJX66Z0YF");
  </script>
`;


/* ============================================================
   LẤY CÁC PHẦN TỬ CẦN SỬ DỤNG
============================================================ */

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

// Biến lưu nội dung người dùng nhập
let userMessage = null;

// API Key OpenAI (đang để trống)
const API_KEY = "";

// Chiều cao mặc định của textarea
const inputInitHeight = chatInput.scrollHeight;


/* ============================================================
   TẠO MỘT TIN NHẮN MỚI
============================================================ */

const createChatLi = (message, className) => {

  // Tạo thẻ <li>
  const chatLi = document.createElement("li");

  // Thêm class incoming hoặc outgoing
  chatLi.classList.add("chat", `${className}`);

  // Nếu là tin nhắn của user thì chỉ có <p>
  // Nếu là bot thì thêm icon robot
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

  chatLi.innerHTML = chatContent;

  // Gán nội dung
  chatLi.querySelector("p").textContent = message;

  return chatLi;
};


/* ============================================================
   GỌI OPENAI API
============================================================ */

const generateResponse = (chatElement) => {

  // API proxy
  const API_URL =
    "https://openai-proxy.napdev.workers.dev?url=https://api.openai.com/v1/chat/completions";

  // Lấy thẻ <p> để cập nhật nội dung
  const messageElement = chatElement.querySelector("p");

  // Cấu hình request
  const requestOptions = {

    method: "POST",

    headers: {
      "Content-Type": "application/json",

      // Nếu dùng API thật thì bỏ comment dòng này
      // Authorization: `Bearer ${API_KEY}`,
    },

    body: JSON.stringify({

      // Model sử dụng
      model: "gpt-3.5-turbo",

      // Tin nhắn gửi lên AI
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  // Gửi request
  fetch(API_URL, requestOptions)

    // Chuyển response thành JSON
    .then((res) => res.json())

    // Hiển thị câu trả lời
    .then((data) => {
      messageElement.textContent =
        data.choices[0].message.content.trim();
    })

    // Nếu lỗi
    .catch(() => {

      messageElement.classList.add("error");

      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })

    // Luôn cuộn xuống cuối
    .finally(() => {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};


/* ============================================================
   XỬ LÝ KHI NGƯỜI DÙNG GỬI TIN NHẮN
============================================================ */

const handleChat = () => {

  // Lấy nội dung người dùng nhập
  userMessage = chatInput.value.trim();

  // Nếu rỗng thì không làm gì
  if (!userMessage) return;

  // Xóa nội dung textarea
  chatInput.value = "";

  // Đặt lại chiều cao
  chatInput.style.height = `${inputInitHeight}px`;

  // Hiển thị tin nhắn của user
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  // Cuộn xuống cuối
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Sau 600ms mới hiện bot đang suy nghĩ
  setTimeout(() => {

    const incomingChatLi = createChatLi(
      "Thinking...",
      "incoming"
    );

    chatbox.appendChild(incomingChatLi);

    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Gọi API
    generateResponse(incomingChatLi);

  }, 600);
};


/* ============================================================
   TỰ ĐỘNG TĂNG CHIỀU CAO TEXTAREA
============================================================ */

chatInput.addEventListener("input", () => {

  // Reset về chiều cao ban đầu
  chatInput.style.height = `${inputInitHeight}px`;

  // Tăng theo số dòng
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});


/* ============================================================
   NHẤN ENTER ĐỂ GỬI
============================================================ */

chatInput.addEventListener("keydown", (e) => {

  // Enter nhưng không giữ Shift
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    window.innerWidth > 800
  ) {

    // Không xuống dòng
    e.preventDefault();

    // Gửi tin nhắn
    handleChat();
  }
});


/* ============================================================
   CÁC SỰ KIỆN CLICK
============================================================ */

// Click nút gửi
sendChatBtn.addEventListener("click", handleChat);

// Đóng chatbot
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

// Mở / đóng chatbot
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);