//"TEST"
// commented out the line 273 in CSS (url path)

//--------------------------------------------------------------//
//-------------------------VARIABLES----------------------------//
//--------------------------------------------------------------//
let imagesURL = [];
let currentData = [];
let resultObject = {};
let latestObject = {};
let genreObject = {};
let genresContainer = document
  .querySelector(".swiper_genres")
  .querySelector(".swiper-wrapper");
let currentCast = "";
let loginSelected = true;
const genresID = {
  Action: 28,
  Animation: 16,
  Comedy: 35,
  Drama: 18,
  Fantasy: 14,
  Romance: 10749,
  Adventure: 12,
  Crime: 80,
  Documentary: 99,
  Family: 10751,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  ScienceFiction: 878,
  TVMovie: 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjNiZTFjMzE3YzVmOTRlMDkxM2JhMjY5ZmIyNDMzYSIsInN1YiI6IjY1MzI4MjkyNDgxMzgyMDBhYzNhM2JkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Kvk9AO09LcR0Ewg8zaZMk5y_MR8pztqpSc2ADHcGr-w",
  },
};
let search = document.querySelector(".btn_search");
let resultsContainer = document
  .querySelector(".swiperResult")
  .querySelector(".swiper-wrapper");
let swiper_1 = new Swiper(".swiperResult", {
  slidesPerView: 4,
  spaceBetween: 20,
  navigation: {
    nextEl: ".result-button-next",
    prevEl: ".result-button-prev",
  },
});
let swiper_2 = new Swiper(".swiper_latest_releases", {
  slidesPerView: 4,
  spaceBetween: 20,
  navigation: {
    nextEl: ".latest-button-next",
    prevEl: ".latest-button-prev",
  },
});
let swiper_3 = new Swiper(".swiper_genres", {
  slidesPerView: 4,
  spaceBetween: 20,
  navigation: {
    nextEl: ".genre-button-next",
    prevEl: ".genre-button-prev",
  },
});
//--------------------------------------------------//
//--------------------LISTENERS---------------------//
//--------------------------------------------------//

let signin = document.querySelector(".modal_window");
signin
  .querySelector(".btn_login_primary")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (loginSelected) {
      console.log(getSigninObject());
    } else {
      console.log(getRegisterObject());
    }
  });
signin.querySelector(".btn_signup").addEventListener("click", (event) => {
  //event.preventDefault();
  document.querySelector(".confirm").style.display = "block";
  document.querySelector(".btn_signup").style.backgroundColor = "red";
  document.querySelector(".btn_login").style.backgroundColor = "black";
  loginSelected = false;
});
signin.querySelector(".btn_login").addEventListener("click", (event) => {
  //event.preventDefault();
  document.querySelector(".confirm").style.display = "none";
  document.querySelector(".btn_login").style.backgroundColor = "red";
  document.querySelector(".btn_signup").style.backgroundColor = "black";
  loginSelected = true;
});
document.querySelector(".signin_nav").addEventListener("click", () => {
  signin.style.display = "flex";
});
document.querySelector(".close_modal").addEventListener("click", () => {
  signin.style.display = "none";
});

let closeModal = document.querySelector(".close_modal_film");
let filmModal = document.querySelector(".film_modal");
closeModal.addEventListener("click", () => {
  filmModal.classList.toggle("display_on");
  filmModal.classList.toggle("display_off");
  clearModal();
});
search.addEventListener("click", (e) => {
  e.preventDefault();
  getSearchResults();
});

window.addEventListener("load", () => {
  getLatests();
});

document.querySelectorAll(".swiper-slide").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    console.log("mouse entered");
  });
  item.addEventListener("mouseout", () => {
    console.log("mouse out");
  });
  item.addEventListener("click", () => {});
});

function clearModal() {
  let modalNode = document.querySelector(".film_modal");
  modalNode.querySelector(".film_img").src = "";
  modalNode.querySelector(".film_title").innerText = "";
  modalNode.querySelector(".year").innerText = "";
  modalNode.querySelector(".rating").innerText = "";
  modalNode.querySelector(".genrs").innerText = "";
  modalNode.querySelector(".description").innerText = "";
}
async function fillModal(movie) {
  let modalNode = document.querySelector(".film_modal");
  //currentCast=await getCast(movie.movieId);
  modalNode.querySelector(".cast_block").querySelector("p").innerText =
    currentCast;
  modalNode.querySelector(".film_img").src =
    "https://images.tmdb.org/t/p/original/" + movie.src;
  modalNode.querySelector(".film_title").innerText = movie.title;
  modalNode.querySelector(".year").innerText = movie.year;
  modalNode.querySelector(".rating").innerText = movie.points;
  modalNode.querySelector(".genrs").innerText = movie.genres;
  modalNode.querySelector(".description").innerText = movie.description;
}

let genres = document.querySelector(".genre_nav");
let lis = genres.querySelectorAll("a");
for (let i = 0; i < lis.length; i++) {
  console.log("add Event listener to anchor tag");
  lis[i].addEventListener("click", (event) => {
    event.preventDefault();
    for (item of lis) {
      item.classList.remove("genre_nav_checked");
    }
    lis[i].classList.add("genre_nav_checked");
    clear(genresContainer);
    imagesURL.length = 0;
    getMoviesByGenre(lis[i].innerText);
  });
}

//---------------------------------------------------//
//---------------------FUNCTIONS---------------------//
//---------------------------------------------------//

async function getSearchResults() {
  let title = document.querySelector(".search_input").value;
  document.querySelector(".search_input").value = "";

  if (title.trim()) {
    try {
      clear(resultsContainer);
      let response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&query=${title}`
      );
      let data = await response.json();
      console.log(data);
      if (data.results.length == 0) {
        console.log("jdhg");
        document.querySelector(
          ".search_result_paragraph"
        ).textContent = `Results for "${title}" not found`;
        return;
      }
      data.results.forEach((element) => {
        if (element.poster_path) {
          imagesURL.push(
            `https://images.tmdb.org/t/p/original/${element.poster_path}`
          );
        }
      });
      displayImages(imagesURL, resultsContainer, data);

      swiper_1.update();

      document.querySelector(
        ".search_result_paragraph"
      ).textContent = `Results for "${title}"`;
    } catch (error) {
      console.log(error);
    }
  }
}
async function getLatests() {
  try {
    let latestContainer = document
      .querySelector(".swiper_latest_releases")
      .querySelector(".swiper-wrapper");
    clear(latestContainer);
    let dateNow = new Date(Date.now());
    let dateBefore = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDay() - 30
    );
    let response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&primary_release_date.gte=${dateBefore.getTime()}&primary_release_date.lte=${dateNow.getTime()}`
    );
    let data = await response.json();
    data.results.forEach((element) => {
      if (element.poster_path && !imagesURL.includes(element.poster_path)) {
        imagesURL.push(
          `https://images.tmdb.org/t/p/original${element.poster_path}`
        );
      }
    });
    displayImages(imagesURL, latestContainer, data);
    swiper_2.update();
  } catch (err) {
    console.log(err);
  }
}
async function getMoviesByGenre(genre) {
  try {
    let genreID = genresID[`${genre}`];
    let genresContainer1 = document.querySelector(".swiper_genres");
    let genresContainer = genresContainer1.querySelector(".swiper-wrapper");
    clear(genresContainer);
    let response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&with_genres=${genreID}`
    );
    let data = await response.json();
    displayImages(imagesURL, genresContainer, data);
    // imagesURL.push(`https://images.tmdb.org/t/p/original${element.poster_path}`);
    swiper_3.update();
  } catch (err) {
    console.log(err);
  }
}
async function getCast(movieId) {
  let cast;
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
      options
    );
    let cast = await res.json();
    let str = "";
    for (let i = 0; i < cast.cast.length && i < 4; i++) {
      str += cast.cast[i].name + ", ";
    }
    console.log(str);
    return cast;
  } catch (err) {
    console.log(err);
  }
}
function clearData() {
  data.length = 0;
}
//the container is the swiper-wrapper
function clear(container) {
  for (child of container.children) {
    container.removeChild(child);
  }
  container.children.length = 0;
  container.innerHTML = "";
  imagesURL.length = 0;
}

//the container is the swiper-wrapper
async function displayImages(images, container, data) {
  let title, year, ids, points, overview, movieId;
  let i = 0;
  data.results.forEach((movie) => {
    title = movie.title;
    ids = movie.genre_ids;
    movieId = movie.id;
    let str = "";
    ids.forEach((element) => {
      if (str.length == 0) {
        str += getGenreFromID(element);
      } else {
        str += " / " + getGenreFromID(element);
      }
    });
    genres = str;
    year = movie.release_date.substr(0, 4);
    points = movie.vote_average;
    overview = movie.overview;
    let infos = {
      title: title,
      genres: str,
      year: year,
      points: points,
      description: overview,
      src: movie.poster_path,
      movieId: movieId,
    };
    if (movie.poster_path) {
      addImage(
        `https://images.tmdb.org/t/p/original${movie.poster_path}`,
        container,
        infos
      );
    }
  });
}

function getGenreFromID(id) {
  let array_2 = [];
  let genre;
  let arr = Object.entries(genresID);
  arr.forEach((element) => {
    let miniArray = [];
    miniArray.push(element[1]);
    miniArray.push(element[0]);
    array_2.push(miniArray);
  });
  array_2.forEach((element) => {
    if (element.includes(id)) {
      genre = element[1];
    }
  });
  return genre;
}
async function addImage(imageURL, container, movie) {
  let div = document.createElement("div");
  div.classList.add("swiper_img");
  let divInfo = document.createElement("div");
  let slide = document.createElement("div");
  slide.classList.add("swiper-slide");
  slide.addEventListener("click", () => {
    document.querySelector(".film_modal").classList.toggle("display_off");
    document.querySelector(".film_modal").classList.toggle("display_on");

    fillModal(movie);
  });
  divInfo.classList.add("mouseenter_film_info");
  divInfo.innerHTML = `   <h1 class="film_title">${movie.title}</h1>
        <p class="film_year">${movie.year}</p>
        <p class="film_genres">${movie.genres}</p>
        <img src="img/star.svg" alt="star" />
        <p class="film_points">${movie.points}</p>
    `;
  let img = document.createElement("img");
  img.src = imageURL;
  div.appendChild(img);
  slide.appendChild(div);
  slide.appendChild(divInfo);
  container.appendChild(slide);
}
function getSigninObject() {
  let name = document.querySelector("#name");
  let password = document.querySelector("#password");
  let checkbox = document.querySelector("#checkbox");
  let object = {};
  if (name.value.trim() && password.value.trim()) {
    object.name = name.value;
    object.password = password.value;
    object.isChecked = checkbox.checked;
  }
  return object;
}
function getRegisterObject() {
  let object = getSigninObject();
  if (document.querySelector("#confirmPassword").value.trim()) {
    object.confirm = document.querySelector("#confirmPassword").value.trim();
  }
  return object;
}

////TO CHANGE ON...

//index.html

//line 136  old : "swiper_latest_releases"
//line 136  new : "swiper_genres"

//From line 127 to 132
//Wrapped all the <li> tags with <a> tags
// old : <li>....
//new  : <a><li>....

//styles.css
//499 to 501
// text-decoration : none;

// 28 -10 -2023 --> modal works but...

//signup and register todo ASAP
