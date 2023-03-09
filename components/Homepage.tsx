import { useState, useEffect } from "react";
import SearchMovie from "./SearchMovie";
import Modal from "./Modal";
import { MovieDetails } from './sharedTypes';
import { GetServerSideProps } from "next";

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

interface Props {
  filmsData: Movie[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const response = await fetch(
    `https://www.omdbapi.com/?s=avengers&apikey=e0c87a5f`
  );
  const searchResponse: SearchResponse = await response.json();
  const filmsData = searchResponse.Search || [];
  return {
    props: { filmsData },
  };
};

function Homepage({ filmsData }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [searchValue, setSearchValue] = useState<string>("avengers");
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState<
    MovieDetails[] | null
  >(null);

  async function fetchMovies(searchValue: string) {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchValue}&apikey=e0c87a5f`
    );
    const data = await response.json();
    const searchResponse = data as SearchResponse;
    if (searchResponse.Search) {
      setMovies(searchResponse.Search);
    }
  }

  useEffect(() => {
    fetchMovies(searchValue);
  }, [searchValue]);

  const addFavouriteMovie = (movie: Movie) => {
    const isMovieInFavorites = favourites.find(
      (favMovie) => favMovie.imdbID === movie.imdbID
    );
    if (!isMovieInFavorites) {
      const newFavouriteList = [...favourites, movie];
      setFavourites(newFavouriteList);
      alert(`Movie ${movie.Title} is added to favourites`);
    } else {
      alert("You have already added this movie to favourites");
    }
  };

  const removeFavouriteMovie = (movie: Movie) => {
    const newFavouriteList = favourites.filter(
      (favMovie) => favMovie.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
  };

  const openModal = async (movie: Movie) => {
    setModalActive(true);
    const response = await fetch(
      `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=e0c87a5f`
    );
    const data: MovieDetails = await response.json();
    setSelectedMovieDetails([data]);
  };

  return (
    <>
      <div className="wrapper">
        <div className="search_movie__container">
          <SearchMovie
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <section className="movie__container">
          {movies.map((movie) => (
            <article key={movie.imdbID} className="movie__item">
              <div key={movie.imdbID}>
                <a
                  onClick={() => openModal(movie)}
                  className="movie__image _ibg"
                  href="#"
                >
                  <picture>
                    <source srcSet={movie.Poster} type="image/avif" />
                    <source srcSet={movie.Poster} type="image/webp" />
                    <img src={movie.Poster} alt={movie.Title} />
                  </picture>
                </a>
                <div className="movie__body">
                  <div className="movie__title">{movie.Title}</div>
                  <div className="movie__title">Release: {movie.Year}</div>
                  <div className="action__button">
                    <button
                      className="movie__button button"
                      onClick={() => addFavouriteMovie(movie)}
                    >
                      Add to favourite
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
        <div className="favourites-title__container">
          <h2 className="favourites__title">Favourites movies</h2>
        </div>
        <section className="movie__container">
          {favourites.map((movie) => (
            <article key={movie.imdbID} className="movie__item favourite__item">
              <div key={movie.imdbID}>
                <a
                  onClick={() => openModal(movie)}
                  className="movie__image _ibg"
                  href="#"
                >
                   <picture>
                    <source srcSet={movie.Poster} type="image/avif" />
                    <source srcSet={movie.Poster} type="image/webp" />
                    <img src={movie.Poster} alt={movie.Title} />
                  </picture>
                </a>
                <div className="movie__body">
                  <div className="movie__title">{movie.Title}</div>
                  <div className="action__button">
                    <button
                      className="movie__button button"
                      onClick={() => removeFavouriteMovie(movie)}
                    >
                      Remove from favourite
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
      <Modal
        modalActive={modalActive}
        setModalActive={setModalActive}
        selectedMovieDetails={selectedMovieDetails}
      />
    </>
  );
}

export default Homepage;

export {};
