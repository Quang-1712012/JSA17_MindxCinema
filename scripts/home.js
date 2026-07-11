// Import API Key từ file config.js
import { TMDB_API_KEY } from "./config.js";

/*
==========================================================
    HÀM BẤT ĐỒNG BỘ CHẠY NGAY KHI FILE ĐƯỢC LOAD
==========================================================
*/
(async () => {

  /*
  Khai báo các endpoint cần lấy dữ liệu từ TMDB.
  Object này gồm:
    Key   -> tên sẽ hiển thị trên website
    Value -> đường dẫn API
  */
  const HomeAPIRoutes = {
    "Trending Movies": { url: "/trending/movie/week" },
    "Popular Movies": { url: "/movie/popular" },
    "Top Rated Movies": { url: "/movie/top_rated" },
    "Now Playing at Theatres": { url: "/movie/now_playing" },
    "Upcoming Movies": { url: "/movie/upcoming" },
  };

  /*
  ==========================================================
        GỌI TẤT CẢ API CÙNG LÚC
  ==========================================================

  Promise.all() sẽ gửi đồng thời 5 request.

  Kết quả trả về là một mảng gồm:
  [
    Trending,
    Popular,
    Top Rated,
    Now Playing,
    Upcoming
  ]
  */
  const promises = await Promise.all(

    // Duyệt từng route
    Object.keys(HomeAPIRoutes).map(

      async (item) =>

        // Fetch dữ liệu
        await (
          await fetch(
            `https://api.themoviedb.org/3${HomeAPIRoutes[item].url}?api_key=${TMDB_API_KEY}`
          )
        ).json()
    )
  );



  /*
  ==========================================================
      CHUYỂN MẢNG THÀNH OBJECT
  ==========================================================

  Từ

  [
      Trending,
      Popular,
      TopRated
  ]

  thành

  {
      "Trending Movies": [...],
      "Popular Movies": [...],
      ...
  }
  */
  const data = promises.reduce((final, current, index) => {

    // current.results là danh sách phim
    final[Object.keys(HomeAPIRoutes)[index]] = current.results;

    return final;

  }, {});



  /*
  ==========================================================
        CHỌN PHIM HIỂN THỊ HERO SECTION
  ==========================================================
  */

  // Danh sách Trending
  const trending = data["Trending Movies"];

  /*
  Lấy ngày hiện tại

  Ví dụ hôm nay là ngày 8

  8 % 20 = 8

  => lấy phim thứ 8

  Mỗi ngày sẽ hiển thị một phim khác nhau.
  */
  const main = trending[new Date().getDate() % trending.length];



  /*
  ==========================================================
        HIỂN THỊ HERO SECTION
  ==========================================================
  */

  // Ảnh nền
  document.querySelector(
    "#hero-image"
  ).src = `https://image.tmdb.org/t/p/original${main.backdrop_path}`;

  // Poster nhỏ
  document.querySelector(
    "#hero-preview-image"
  ).src = `https://image.tmdb.org/t/p/w300${main.poster_path}`;

  // Tiêu đề phim
  document.querySelector("#hero-title").innerText =
    main.title || main.name;

  // Mô tả
  document.querySelector("#hero-description").innerText =
    main.overview;

  // Nút Watch Now
  document.querySelector("#watch-now-btn").href =
    `./watch.html?id=${main.id}`;

  // Nút View Info
  document.querySelector("#view-info-btn").href =
    `./info.html?id=${main.id}`;



  /*
  ==========================================================
      TẠO CÁC SECTION PHIM
  ==========================================================
  */

  Object.keys(data).map((key, index) => {

    /*
    Ví dụ:

    Trending Movies

    Popular Movies

    Top Rated Movies

    ...
    */

    document.querySelector("main").innerHTML += /*html*/ `

    <div class="section">

      <!-- Tiêu đề -->
      <h2>${key}</h2>

      <!-- Swiper -->
      <div class="swiper-${index} swiper">

        <div class="swiper-wrapper">

          ${
            // Duyệt từng bộ phim
            data[key]
              .map(
                (item) => /*html*/ `

          <!-- Một phim -->
          <a href="./info.html?id=${item.id}"
             class="swiper-slide"
             style="width:200px !important">

            <div class="movie-card">

              <!-- Poster -->
              <img
                class="fade-in"
                onload="this.style.opacity='1'"
                src="https://image.tmdb.org/t/p/w200${item.poster_path}"
                alt=""
              />

              <!-- Tên phim -->
              <p class="multiline-ellipsis-2">
                ${item.title || item.name}
              </p>

            </div>

          </a>

          `
              )
              .join("\n")
          }

        </div>

        <!-- Nút Previous -->
        <div class="swiper-button-prev"></div>

        <!-- Nút Next -->
        <div class="swiper-button-next"></div>

      </div>

    </div>

    `;
  });



  /*
  ==========================================================
      ẨN LOADING
  ==========================================================
  */

  document
    .querySelector(".backdrop")
    .classList.add("backdrop-hidden");



  /*
  ==========================================================
      KHỞI TẠO SWIPER
  ==========================================================
  */

  Object.keys(data).map((key, index) => {

    new Swiper(`.swiper-${index}`, {

      // Khoảng cách giữa các slide
      spaceBetween: 30,

      // Tự động chạy
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },

      // Hiển thị tự động theo kích thước
      slidesPerView: "auto",

      // Lặp vô hạn
      loop: true,

      // Di chuyển theo nhóm
      slidesPerGroupAuto: true,

      // Nút điều hướng
      navigation: {

        prevEl: `.swiper-button-prev`,

        nextEl: `.swiper-button-next`,
      },
    });

  });

})();