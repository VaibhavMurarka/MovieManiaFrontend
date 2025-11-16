import React from "react";
import "./moviecard.css";
import { MovieControls } from "./MovieControls";

export const MovieCard = ({ movie, type, id }) => {
  return (
    <div className="card-con">
      <div className="card-front" key={id}>
        <div className="image">
          {movie.poster_path ? (
            <img
              src={`http://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={`${movie.title} Poster`}
              width="200"
              height="300"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1600456899121-68eda5705257?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z3JheXxlbnwwfHwwfHw%3D&w=1000&q=80"
              alt="No preview available"
              width="200"
              height="300"
            />
          )}
        </div>
        <div className="f">
          <MovieControls movie={movie} type={type} />
          <div className="f-upper">
            <div>{movie.title || movie.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
