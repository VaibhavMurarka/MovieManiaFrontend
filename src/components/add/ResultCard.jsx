import React, { useContext } from "react";
import "./resultcard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server, Context } from '../../main.jsx';
import { Navigate } from "react-router";
import axios from "axios";
import cookie from "react-cookies";

export const ResultCard = ({ movie }) => {
  // We need 'setIsAuthenticated' from the context
  const { isAuthenticated, setIsAuthenticated, watched, watchlist, setRefresh } = useContext(Context);
  const token = cookie.load("token");

  const toastOptions = {
    autoClose: 1000,
    closeOnClick: false,
    pauseOnHover: false,
    theme: "dark",
  };

  const addToWatched = async () =>{
    try {
      await axios.post(`${server}/movies/addmovie`, {
        movie,
        movieType: "watched"
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        withCredentials: true,
      });

      // --- Success ---
      toast("Movie Added to Watched", toastOptions);
      setRefresh(true);

    } catch (error) {
      // --- Error Handling ---
      if (error.response) {
        // Check if it's an auth error (from get_current_user)
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Session expired. Please log in.", toastOptions);
          // This will trigger the redirect
          setIsAuthenticated(false);
        } else {
          // Other server errors
          toast.error(error.response.data.message || "Could not add movie.", toastOptions);
        }
      } else {
        // Network errors
        toast.error("Could not add movie. Please try again.", toastOptions);
      }
    }
  }

  const addToWatchlist = async () =>{
    try {
      await axios.post(`${server}/movies/addmovie`, {
        movie,
        movieType: "watchlist"
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        withCredentials: true,
      });

      // --- Success ---
      toast("Movie Added to Watchlist", toastOptions);
      setRefresh(true);
      
    } catch (error) {
      // --- Error Handling ---
      if (error.response) {
        // Check if it's an auth error (from get_current_user)
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Session expired. Please log in.", toastOptions);
          // This will trigger the redirect
          setIsAuthenticated(false);
        } else {
          // Other server errors
          toast.error(error.response.data.message || "Could not add movie.", toastOptions);
        }
      } else {
        // Network errors
        toast.error("Could not add movie. Please try again.", toastOptions);
      }
    }
  }

  // This line is now your redirect guard
  if(!isAuthenticated) return <Navigate to={"/"}/>
  
    let alrWatchlist = watchlist.find((o)=>o.movie.id === movie.id && o.movieType==='watchlist');
    let checkWatchlist = alrWatchlist ? true:false;

    let alrWatched = watched.find((o)=>o.movie.id === movie.id && o.movieType==='watched');
    let checkWatched = alrWatched ? true: false;

  return (
    <div className="result-card">
      <div className="poster-wrapper">
        {movie.poster_path ? (
          <img
            src={`http://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={`${movie.title?movie.title:movie.name} Poster`}
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
      <div className="header1">
        <h2 className="title">{movie.title?movie.title:movie.name}</h2>
        <h4 className="date">{movie.release_date?movie.release_date.slice(0,4):movie.first_air_date?movie.first_air_date.slice(0,4):""}</h4>
        {checkWatched||checkWatchlist?checkWatched?<div>Already Added in Watched</div>:<div>Already Added in Watchlist</div>:<div className="ctrlbtns">
          <button
            className={checkWatchlist ? "btn off" : "btn add"}
            disabled={checkWatchlist}
            onClick={() => addToWatchlist()}
          >
            {" "}
            Add to Watchlist
          </button>
          <button
            className={checkWatched ? "btn off" : "btn add"}
            disabled={checkWatched}
            onClick={() => addToWatched()}
          >
            {" "}
            Add to Watched
          </button>
        </div>}
      </div>
    </div>
  );
};

export default ResultCard;