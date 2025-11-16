import React, { useContext, useState } from "react";
import { ResultCard } from "./ResultCard.jsx";
import LoadingBar from 'react-top-loading-bar';
import "./add.css";
import { ToastContainer } from "react-toastify";
import Header from "../header/Header.jsx";
import { Navigate } from "react-router";

import { Context } from "../../main.jsx";

export const Add = () => {

  const [movies, setMovies] = useState([]);
  const [progress, setProgress] = useState(0);
  const {isAuthenticated } = useContext(Context);
  console.log(progress);
  if (!isAuthenticated) return <Navigate to={"/"} />;

  const onchange = (e) => {
    e.preventDefault();
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_API_KEY}&include_adult=false&query=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setMovies(data.results);
        } else {
          setMovies([]);
        } 
      });
  };

  return (
    <div>
      <Header/>
      <div className="add-page">
      <LoadingBar progress={100} onLoaderFinished={() => setProgress(0)}/>
        <div className="add-content"> 
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search For a Movie..."
              onChange={onchange}
            />
          </div>
          <div className="result-wrapper">
          {movies.length > 0 && (
            <ul className="results">
              {movies.filter((movie) => movie.media_type !== "person").map((movie) => (
                <li key={movie.id}>
                  <ResultCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
        <ToastContainer />

      </div>
    </div>
  );
};

export default Add;
