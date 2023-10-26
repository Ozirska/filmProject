//"TEST"
// commented out the line 273 in CSS (url path)



//--------------------------------------------------------------//
//-------------------------VARIABLES----------------------------//
//--------------------------------------------------------------//
let imagesURL=[];

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
            displayImages(imagesURL,resultsContainer,swiper_1);
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
        let now=Date.now();
        let before=new Date(now-(30*24*60*60*1000));
        let response=await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=6b3be1c317c5f94e0913ba269fb2433a&primary_release_date.gte=${before}&primary_release_date.lte=${now}`);
        let data=await response.json();
        data.results.forEach(element => {
            if(element.poster_path){
                imagesURL.push(`https://images.tmdb.org/t/p/original/${element.poster_path}`);
            }
        });
        displayImages(imagesURL,latestContainer);
        swiper_2.update();
    }catch(err){

    }
    
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
function displayImages(images,container){
    images.forEach((element)=>{
        let slide=document.createElement("div");
        slide.classList.add("swiper-slide");
        let img=document.createElement("img");
        img.src=element;
        slide.appendChild(img);
        container.appendChild(slide);
    });
}
