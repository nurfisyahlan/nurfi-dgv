const searchButton = document.querySelector('.search-button');
const inputKeyword = document.querySelector('.input-keyword');
const proxy = 'https://api.allorigins.win/raw?url='; // Proxy lebih stabil untuk GitHub Pages

// Jalankan fungsi pencarian saat tombol diklik
searchButton.addEventListener('click', searchMovies);

// Jalankan fungsi pencarian saat menekan tombol Enter
inputKeyword.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

function searchMovies() {
    const loading = document.querySelector('.loading');
    const movieContainer = document.querySelector('.movie-container');

    loading.style.display = 'block';
    movieContainer.innerHTML = '';

    const urlSearch = 'https://www.omdbapi.com/?apikey=5b167da0&s=' + inputKeyword.value;

    fetch(proxy + encodeURIComponent(urlSearch))
        .then(response => response.json())
        .then(response => {
            loading.style.display = 'none';

            if (response.Response === "False") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Movies not found!',
                });
                return;
            }

            const movies = response.Search;
            let cards = '';
            movies.forEach(m => cards += showCards(m));
            movieContainer.innerHTML = cards;

            const modalDetailButton = document.querySelectorAll('.modal-detail-button');
            modalDetailButton.forEach(btn => {
                btn.addEventListener('click', function () {
                    const imdbid = this.dataset.imdbid;
                    const urlDetail = 'https://www.omdbapi.com/?apikey=5b167da0&i=' + imdbid;

                    fetch(proxy + encodeURIComponent(urlDetail))
                        .then(response => response.json())
                        .then(m => {
                            const movieDetail = showMovieDetails(m);
                            const modalBody = document.querySelector('.modal-body');
                            modalBody.innerHTML = movieDetail;
                        })
                        .catch(error => {
                            console.error("Detail fetch error:", error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Fetch Error',
                                text: 'Gagal memuat detail film.',
                            });
                        });
                });
            });
        })
        .catch(error => {
            loading.style.display = 'none';
            console.error("Search fetch error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Fetch Error',
                text: 'Terjadi kesalahan jaringan atau server.',
            });
        });
        // === Selektor Input & Tombol Preset ===
        const inputKeyword = document.querySelector('.input-keyword');
        const harryPotterBtn = document.getElementById('harry-potter-btn');
        const avengersBtn = document.getElementById('avengers-btn');

        // === Event tombol preset ===
        harryPotterBtn.addEventListener('click', function () {
            inputKeyword.value = 'Harry Potter';
            searchMovies();
        });

        avengersBtn.addEventListener('click', function () {
            inputKeyword.value = 'The Avengers';
            searchMovies();
        });
        }

function showCards(m) {
    const poster = (m.Poster === "N/A") ? "https://via.placeholder.com/300x450?text=No+Image" : m.Poster;

    return `<div class="col-md-4 my-5">
                <div class="card">
                    <img src="${poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid=${m.imdbID}>Show Details</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetails(m) {
    const poster = (m.Poster === "N/A") ? "https://via.placeholder.com/300x450?text=No+Image" : m.Poster;

    return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <img src="${poster}" class="img-fluid">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                        <li class="list-group-item"><strong>Director:</strong> ${m.Director}</li>
                        <li class="list-group-item"><strong>Actors:</strong> ${m.Actors}</li>
                        <li class="list-group-item"><strong>Writer:</strong> ${m.Writer}</li>
                        <li class="list-group-item"><strong>Plot:</strong><br>${m.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}
