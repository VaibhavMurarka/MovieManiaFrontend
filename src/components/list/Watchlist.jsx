import React, { useContext, useEffect, useState } from "react";
import "./watchlist.css";
import { MovieCard } from "../moviecard/MovieCard.jsx";
// Import 'toast' to show error messages
import { ToastContainer, toast } from "react-toastify";
import { RiSearchEyeLine } from "react-icons/ri";
import {FaTimes, FaBars} from 'react-icons/fa'
import { server, Context } from "../../main.jsx";
import LoadingBar from "react-top-loading-bar";
import axios from "axios";
import { Navigate } from "react-router";
import cookies from "react-cookies";
import Header from "../header/Header.jsx";
import Loader from '../loader/Loader.jsx';

export const Watchlist = () => {
  const [progress, setProgress] = useState(0);
  const [loading , setLoading] = useState(true);

  const { 
    isAuthenticated, 
    setIsAuthenticated, // <-- Added this to trigger redirect
    refresh, 
    setRefresh, 
    setWatchlist, 
    watchlist 
  } = useContext(Context);
  
  const token = cookies.load("token");

  // This guard is perfect and will catch auth changes from the effect
  
  useEffect(() => {
    // Define an async function inside the effect
    const fetchWatchlist = async () => {
      try {
        const { data } = await axios.get(`${server}/movies/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        
        // --- Success ---
        setWatchlist(data.data);

      } catch (error) {
        // --- Error Handling ---
        if (error.response) {
          // Check if it's an auth error (from get_current_user)
          if (error.response.status === 401) {
            toast.error(error.response.data.message || "Session expired. Please log in.");
            // This will trigger the redirect on the next render
            setIsAuthenticated(false);
          } else {
            // Other server errors
            toast.error(error.response.data.message || "Could not fetch watchlist.");
          }
        } else {
          // Network errors
          toast.error("Could not fetch watchlist. Please try again.");
        }
      } finally {
        // This runs on both success and error
        setLoading(false);
        setRefresh(false);
      }
    };

    fetchWatchlist();
  
  // Update dependencies array
  }, [refresh, setRefresh, setWatchlist, setIsAuthenticated, token]);

  if (!isAuthenticated) return <Navigate to={"/"} />;

  return (
    <div>
      <Header/>
      <div className="top-container">
      <LoadingBar progress={100} onLoaderFinished={() => setProgress(0)} />
      <h1 className="page-head">
        <div className="v-line"></div>My Watchlist
      </h1>
      <div className="card-container">
        {watchlist.length > 0 ? (
          <div className="cards">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.movie.id}
                movie={movie.movie}
                type="watchlist"
              />
            ))}
          </div>
        ) : (
          <div>
           {loading ? <Loader/> :
              <h2 className="no">
                <span className="mobile-text">Add movies by going in <FaBars/> and clicking <RiSearchEyeLine /></span>
                <span className="icon-text">Add movies by clicking <RiSearchEyeLine /></span>
              </h2>
           }
           </div>
        )}
      </div>
      <ToastContainer 
        className={"toasty"} 
        closeButton={false}
        autoClose={2000}
        theme="dark" 
      />
    </div>
    </div>
  );
};

export default Watchlist;
