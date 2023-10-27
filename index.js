//"TEST"
// commented out the line 273 in CSS (url path)



//--------------------------------------------------------------//
//-------------------------VARIABLES----------------------------//
//--------------------------------------------------------------//
let imagesURL=[];
let currentData=[];
let currentID;
const genresID= {
    Action         : 28,
    Animation      : 16,
    Comedy         : 35,
    Drama          : 18,
    Fantasy        : 14,
    Romance        : 10749,
    Adventure      : 12,
    Crime          : 80,
    Documentary    : 99,
    Family         : 10751,
    History        : 36,
    Horror         : 27,
    Music          : 10402,
    Mystery        : 9648,
    ScienceFiction : 878,
    TVMovie        : 10770,
    Thriller       : 53,
    War            : 10752,
    Western        : 37,
};

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjNiZTFjMzE3YzVmOTRlMDkxM2JhMjY5ZmIyNDMzYSIsInN1YiI6IjY1MzI4MjkyNDgxMzgyMDBhYzNhM2JkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Kvk9AO09LcR0Ewg8zaZMk5y_MR8pztqpSc2ADHcGr-w'
    }
  };
let search=document.querySelector(".btn_search");
let resultsContainer=document.querySelector(".swiperResult").querySelector(".swiper-wrapper");
let swiper_1=new Swiper(".swiperResult",{
    slidesPerView : 4 ,
    spaceBetween : 20,
    navigation : {
      nextEl : ".result-button-next",
      prevEl : ".result-button-prev",
    },
});
let swiper_2=new Swiper(".swiper_latest_releases",{
    slidesPerView : 4 ,
    spaceBetween : 20,
    navigation : {
      nextEl : ".latest-button-next",
      prevEl : ".latest-button-prev",
    },
});
let swiper_3=new Swiper(".swiper_genres",{
    slidesPerView : 4 ,
    spaceBetween : 20,
    navigation : {
      nextEl : ".genre-button-next",
      prevEl : ".genre-button-prev",
    },
});
//--------------------------------------------------//
//--------------------LISTENERS---------------------//
//--------------------------------------------------//

search.addEventListener("click",(e)=>{
    e.preventDefault();
    getSearchResults();
});

window.addEventListener("load",()=>{
    console.log("loaded");
    getLatests();
    console.log("loaded");
});

document.querySelectorAll("img").forEach((item)=>{

    item.addEventListener("mouseenter",()=>{
        console.log("mouse entered");
    });
    item.addEventListener("mouseout",()=>{
        console.log("mouse out");
    });
});


   

let genres=document.querySelector(".genre_nav");
let lis=genres.querySelectorAll("li");
for(let i=0;i<lis.length;i++){
    lis[i].addEventListener("click",()=>{
        getMoviesByGenre(lis[i].innerText);
    });
}
/* console.log(genres);
let children=genres.children;

console.log(children.length);
for(item of children){
    console.log(item.innerText);
} */
//console.log(genres.children.length);

//---------------------------------------------------//
//---------------------FUNCTIONS---------------------//
//---------------------------------------------------//

async function getSearchResults(){
    let title=document.querySelector(".search_input");
    
    title=title.value;
    console.log(title); 
    if(title){
        try{
            clear(resultsContainer);
            let response=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&query=${title}`);
            let data=await response.json();
            console.log(data);
            data.results.forEach(element => {
                if(element.poster_path){
                    imagesURL.push(`https://images.tmdb.org/t/p/original/${element.poster_path}`);
                }
            });
            displayImages(imagesURL,resultsContainer,data);
            swiper_1.update();
        }catch(error){
            console.log(error);
        }
    }
    
}
async function getLatests(){
    try{
        let latestContainer=document.querySelector(".swiper_latest_releases").querySelector(".swiper-wrapper");
        clear(latestContainer);
        let dateNow=new Date(Date.now());
        console.log(dateNow);
        let dateBefore=new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDay()-30);

        let response= await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&primary_release_date.gte=${dateBefore.getTime()}&primary_release_date.lte=${dateNow.getTime()}`);
        //let response=await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&primary_release_date.gte=2023-9-26`,options);
        let data=await response.json();
        currentData=data;
        data.results.forEach(element => {
            if(element.poster_path && !imagesURL.includes(element.poster_path)){
                imagesURL.push(`https://images.tmdb.org/t/p/original${element.poster_path}`);
            }
        });
        displayImages(imagesURL,latestContainer,data);
        swiper_2.update();
    }catch(err){
        console.log(err);
    }
    
}
async function getMoviesByGenre(genre){
    try{
        let genresContainer=document.querySelector(".swiper_genres").querySelector(".swiper-wrapper");
        let genreID=genresID[`${genre}`];
        clear(genresContainer);
        let response=await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&with_genres=${genreID}`);
        let data=await response.json();
        console.log(data);
        data.results.forEach(element => {
            if(element.poster_path && !imagesURL.includes(element.poster_path)){
                imagesURL.push(`https://images.tmdb.org/t/p/original${element.poster_path}`);
            }
        });
        displayImages(imagesURL,genresContainer,data);
        swiper_3.update();
    }catch(err){
        console0log(err);
    }
    
}
function getGenreByID(id){
    arr=Object.entries(genresID);
    for()
}
function clearData(){
    data.length=0;
}
//the container is the swiper-wrapper
function clear(container){
    for(child of container.children){
        container.removeChild(child);
    }
    container.innerHTML="";
    imagesURL.length=0;
    console.log("clear done");
}

//the container is the swiper-wrapper
function displayImages(images,container,data){
    let title,year,genres,points;
    data.results.forEach((movie)=>{
        title=movie.title;
        genres=movie.genre_ids;
        year=movie.release_date.substr(0,4);
        points=movie.vote_average;
        console.log(`${title} ${genres} ${year} ${points}`);
    });
    images.forEach((element)=>{
        let slide=document.createElement("div");
        let infoDiv=document.createElement("div");
        infoDiv.classList.add("mouseenter_film_info");
 /*        let title=data.results.
        infoDiv.innerHTML=
        `<h1 class="film_title">${}</h1>
        <p class="film_year">${}</p>
        <p class="film_genres">${}</p>
        <img src="img/star.svg" alt="star" />
        <p class="film_points">${}</p>
        ` */
        slide.classList.add("swiper-slide");
        let img=document.createElement("img");
        img.src=element;
        slide.appendChild(img);
        container.appendChild(slide);
    });
}


