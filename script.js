class Movie {
    constructor(name, availableOn, mainActors, director, year, imageUrl) {
        this.name = name;
        this.availableOn = availableOn;
        this.mainActors = mainActors;
        this.director = director;
        this.year = year;
        this.imageUrl = imageUrl;
    }
}

class MovieManager {
    constructor() {
        this.movies = [];
        this.moviesList = document.getElementById('moviesList');
        this.addMovieForm = document.getElementById('addMovieForm');
        this.toggleFormButton = document.getElementById('toggleFormButton');
        this.searchInput = document.getElementById('searchInput');

        this.loadMoviesFromLocalStorage();
        this.addEventListeners();
    }

    loadMoviesFromLocalStorage() {
        const savedMovies = JSON.parse(localStorage.getItem('movies')) || [
            {
                "name": "The Notebook",
                "availableOn": "PrimeVideo",
                "mainActors": "Ryan Gosling, Rachel McAdams",
                "director": "Nick Cassavetes",
                "year": "2004",
                "imageUrl": "https://m.media-amazon.com/images/M/MV5BNzc3Mzg1OGYtZjc3My00Y2NhLTgyOWUtYjRhMmI4OTkwNDg4XkEyXkFqcGdeQXVyMTU3NDU4MDg2._V1_.jpg"
            },
            {
                "name": "Black Panther",
                "availableOn": "Disney+",
                "mainActors": "Chadwick Boseman, Lupita Nyong'o",
                "director": " Ryan Coogler",
                "year": "2018",
                "imageUrl": "https://fr.web.img2.acsta.net/pictures/17/10/16/15/40/0883250.jpg"
            },
            {
                "name": "Aquaman",
                "availableOn": "MyCANAL",
                "mainActors": "Jason Momoa, Amber Heard",
                "director": "James Wan",
                "year": "2018",
                "imageUrl": "https://fr.web.img5.acsta.net/c_310_420/pictures/18/12/13/12/12/2738771.jpg"
            }
        ];

        savedMovies.forEach(movie => this.addMovieRow(movie));
    }

    addMovieRow(movie) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="editable">${movie.name}</td>
            <td class="editable">${movie.availableOn}</td>
            <td class="editable">${movie.mainActors}</td>
            <td class="editable">${movie.director}</td>
            <td class="editable">${movie.year}</td>
            <td><img src="${movie.imageUrl}" alt="Affiche" width="100"></td>
            <td><a href="#" class="button-like-link">
                <img src="http://i.imgur.com/yHyDPio.png" alt="Icone de suppression"> Supprimer
            </a></td>
        `;
        this.moviesList.appendChild(newRow);
        this.movies.push(movie);
        this.saveToLocalStorage();
    }

    deleteMovie(btn) {
        const row = btn.parentNode.parentNode;
        const index = Array.from(row.parentNode.children).indexOf(row);
        row.parentNode.removeChild(row);
        this.movies.splice(index, 1);
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('movies', JSON.stringify(this.movies));
    }

    addEventListeners() {
        this.addMovieForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const movie = this.getFormData();
            this.addMovieRow(movie);
            this.addMovieForm.reset();
            this.hideForm();
        });

        this.toggleFormButton.addEventListener('click', () => {
            this.toggleFormVisibility();
        });

        this.moviesList.addEventListener('click', (event) => {
            if (event.target.classList.contains('button-like-link')) {
                this.deleteMovie(event.target);
            }
        });

        this.searchInput.addEventListener('input', () => {
            this.filterMovies();
        });

        // Add event listeners for table cell editing
        this.moviesList.addEventListener('click', (event) => {
            const clickedCell = event.target;

            if (clickedCell.classList.contains('editable')) {
                this.toggleCellEditability(clickedCell);
            }
        });

        // Event listener for clicking outside the input field
        this.moviesList.addEventListener('blur', (event) => {
            const clickedCell = event.target.closest('.editable');
            if (clickedCell) {
                this.toggleCellEditability(clickedCell, false);
            }
        }, true);
    }

    toggleCellEditability(cell, editMode = true) {
        const label = cell.querySelector('label');
        const input = cell.querySelector('input');

        if (editMode) {
            label.style.display = 'none';
            input.style.display = 'block';
            input.value = label.textContent;
            input.focus();
        } else {
            label.style.display = 'block';
            input.style.display = 'none';
            label.textContent = input.value;
        }
    }

    getFormData() {
        // Get form data here
        // Example:
        const name = document.getElementById('movieName').value;
        const availableOn = document.getElementById('availableOn').value;
        const mainActors = document.getElementById('mainActors').value;
        const director = document.getElementById('director').value;
        const year = document.getElementById('year').value;
        const imageUrl = document.getElementById('imageUrl').value;

        return new Movie(name, availableOn, mainActors, director, year, imageUrl);
    }

    hideForm() {
        this.addMovieForm.style.display = 'none';
        this.toggleFormButton.textContent = 'Afficher le formulaire';
    }

    toggleFormVisibility() {
        if (this.addMovieForm.style.display === 'none' || this.addMovieForm.style.display === '') {
            this.addMovieForm.style.display = 'block';
            this.toggleFormButton.textContent = 'Cacher le formulaire';
        } else {
            this.hideForm();
        }
    }

    filterMovies() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();

        this.movies.forEach((movie, index) => {
            const row = this.moviesList.children[index]; // Skip header row
            if(row){
                const cells = row.querySelectorAll('td');

                let found = false;
                for (let i = 0; i < cells.length-2; i++){
                    const cell = cells[i];
                    if (searchTerm) {
                        const cellText = cell.textContent;
                        if (cellText.toLowerCase().includes(searchTerm)) {
                            found = true;

                            if (!cell.hasAttribute('data-original-text')) {
                                cell.setAttribute('data-original-text', cell.innerHTML);
                            }
                            cell.innerHTML = cellText.toLowerCase().replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
                        } else {
                            if (cell.hasAttribute('data-original-text')) {
                                cell.innerHTML = cell.getAttribute('data-original-text');
                                cell.removeAttribute('data-original-text');
                            }
                        }
                    }else{

                        found = true;
                        if (cell.hasAttribute('data-original-text')) {
                            cell.innerHTML = cell.getAttribute('data-original-text');
                            cell.removeAttribute('data-original-text');
                        }
                    }
                }

                if (found) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
}

// Initialize the movie manager
const movieManager = new MovieManager();
