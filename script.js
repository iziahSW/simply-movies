const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");
let moviesDefaultSort;
let query;

function sortMovies(event) {
  if (!moviesDefaultSort) return;
  event.preventDefault();
  const sortType = event.target.value;
  let moviesCopy = [...moviesDefaultSort];
  if (sortType === "default") {
    moviesCopy = moviesDefaultSort;
  } else if (sortType === "a-z") {
    moviesCopy.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "z-a") {
    moviesCopy.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    moviesCopy.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === "oldest") {
    moviesCopy.sort((a, b) => Number(a.Year) - Number(b.Year));
  }
  renderMovies(moviesCopy, query);
}

async function handleSearch(event) {
  event.preventDefault();
  query = event.target.searchQuery.value;
  moviesDefaultSort = await getMovies(query);
  renderMovies(moviesDefaultSort, query);
}

async function getMovies(title) {
  const moviesRaw = await fetch(
    `http://www.omdbapi.com/?apikey=ad46143b&s=${title}`,
  );
  const moviesRes = await moviesRaw.json();
  return moviesRes.Search;
}

function renderMovies(movies, title) {
  let moviesHTML;
  if (movies) {
    moviesHTML = movies.map((movie) => movieHTML(movie)).join("");
  } else {
    moviesHTML = "<p>No movies found</p>";
  }
  moviesGrid.innerHTML = moviesHTML;
  resultsInfo.innerHTML = `<span>Showing: </span>${title}`;
}

function movieHTML(movie) {
  const poster = movie.Poster !== "N/A" ? movie.Poster : "";
  if (poster) {
    return `          
      <div class="movie-card">
        <img
          class="movie-card__img"
          src="${movie.Poster}"
          alt=""
        />
        <h2 class="movie-card__title">${movie.Title}</h2>
        <p class="movie-card__year">${movie.Year}</p>
      </div>
    `;
  }
  return `
    <div class="movie-card">
    ${noPosterHTML()}
\    <h2 class="movie-card__title">${movie.Title}</h2>
    <p class="movie-card__year">${movie.Year}</p>
  </div>
  `;
}

function noPosterHTML() {
  return `        
    <div class="movie-card__poster-placeholder">
      Movie Poster<br />Not Available
    </div>
    `;
}
