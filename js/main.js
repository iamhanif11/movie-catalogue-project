//fetch tmdb
const API_KEY = 'bda9cd7c3af9b3c21347f8a4f5f73e6f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';


let genresMap = new Map();
let currentPage = 1;
const filmsPerPage = 10;
const maxPage = 10;

//menyimpan daftar genre
async function fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('Failed to retrieve genres');
        const data = await response.json();
        
        data.genres.forEach(genre => genresMap.set(genre.id, genre.name))
    } catch (error){
        console.error('Error fetching genre: ', error)
    }
}

// mengambil daftar film populer
async function getMovies(pagesWeb) {
    const tmdbPage = Math.ceil(pagesWeb /2);
    const url = `${BASE_URL}${'/movie/popular'}?api_key=${API_KEY}&page=${tmdbPage}`;
    try{
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Failed to retrieve data')
        }
        const data = await response.json();

        const startindex = pagesWeb %2 === 1 ? 0 : 10;
        return data.results.slice(startindex, startindex + filmsPerPage);

    } catch (error){
        console.error('Error:', error);
        return []
    }
}

//render movies
function renderMovies(movies) {
    const container = document.getElementById('movie-list');
    container.innerHTML = '';

    movies.forEach(movie => {
        //ubah genre_ids -> nama
        let genres = '';
        for (const id of movie.genre_ids) {
            const nameGenres = genresMap.get(id);
            if (!nameGenres) continue;
            genres += `<span class="border border-white text white text-xs font-normal font-roboto px-3 py-1 rounded-full">${nameGenres}</span>`;
        }

        //rating
        const rating = movie.vote_average.toFixed(1);

        //poster
        const poster = movie.poster_path?`${IMG_URL}${movie.poster_path}`:"https://via.placeholder.com/96x140?text=No+Image";

        //card-film
        const card = `
        <article class="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr] gap-4 sm:gap-8 py-3 sm:py-6">
        
        <img src="${poster}" alt="${movie.title}" class="w-full h-28 sm:h-42 lg:h-56 object-cover rounded-sm flex-shrink-0">

        <div class="flex flex-col gap-1 sm:gap-2">
            <h2 class="text-white font-roboto font-medium text-base sm:text-lg lg:text-2xl">${movie.title}</h2>

            <div class="flex flex-wrap gap-1 sm:gap-2">${genres}</div>

            <div class="flex gap-2 items-center">
                <img class="w-[28px] sm:w-[34px] h-[14px] sm:h-[16px] block" src="../assets/IMDB_Logo_2016 1.svg" alt="imdb-logo">
                <span class="flex text-xs sm:text-sm gap-2 leading-none">${rating} <img class="w-[16px] sm:w-[24px]" src="../assets/v-icon.svg" alt="icon-star"></span>
            </div>

            <p class="font-roboto hidden sm:block text-base font-normal text-gray-400 leading-relaxed sm:line-clamp-2 lg:line-clamp-3">${movie.overview}
            </p>

            <div class="flex gap-3 mt-1">
                <button class="border bg-green-400 text-black font-roboto text-xs sm:text-sm font-medium px-2 sm:px-4 py-1 sm:py-2 rounded-full cursor-pointer">
                    VIEW DETAILS
                </button>

                <button class="border border-white text-white font-roboto text-xs sm:text-sm font-medium px-2 sm:px-4 py-1 sm:py-2 rounded-full cursor-pointer">
                    ADD TO WATCHLIST
                </button>
            </div>
        </div>
    </article>
    `;

    container.innerHTML += card
    })
}

//pagination
function renderPagination() {
    const container = document.getElementById('pagination');
    container.innerHTML = '';

    const start = (currentPage - 1) * filmsPerPage + 1;
    const end = currentPage * filmsPerPage;
    const total = maxPage * filmsPerPage;

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === maxPage;

    container.innerHTML = `
        <div class="flex justify-end items-center gap-4 text-gray-400 font-roboto text-sm font-normal py-4">
        <span>Item per page: ${filmsPerPage}</span>

        <span>${start} - ${end} of ${total}</span>

        <div class="flex items-center gap-1">

            <button
                onclick="changePage(${currentPage - 1})"
                ${prevDisabled ? "disabled" : ''}
                class="w-[28px] flex items-center justify-center transition ${prevDisabled ? 'text-gray-600 cursor-not-allowed' : 'cursor-pointer'}">
                <img src="/assets/keyboard_arrow_left.svg" alt="arrow-left">
            </button>

            <button
                onclick="changePage(${currentPage + 1})"
                ${nextDisabled ? "disabled" : ''}
                  class="w-[28px] h-[28px] flex items-center justify-center rounded transition ${nextDisabled ? 'text-gray-600 cursor-not-allowed' : 'cursor-pointer'}">
                  <img class="rotate-180" src="/assets/keyboard_arrow_left.svg" alt="arrow-right">

            </button>

        </div>

    </div>
    `
}

async function changePage(page) {
    if (page < 1 || page > maxPage) return;

    currentPage = page
    window.scrollTo({ top: 0, behavior: 'smooth'});

    const movies = await getMovies(currentPage);
    renderMovies(movies);
    renderPagination()
}

async function init(){
    await fetchGenres();
    const movies = await getMovies(1);
    renderMovies(movies);
    renderPagination();
}

init();
