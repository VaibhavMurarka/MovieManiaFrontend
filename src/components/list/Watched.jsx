import React, { useContext, useEffect, useState } from "react";
import { server, Context } from "../../main.jsx";
import { MovieCard } from "../moviecard/MovieCard.jsx";
import LoadingBar from "react-top-loading-bar";
import axios from "axios";
import { Navigate } from "react-router";
// Import toast to show messages
import { ToastContainer, toast } from "react-toastify";
import cookie from "react-cookies";
import Header from "../header/Header.jsx";
import Loader from "../loader/Loader.jsx";

export const Watched = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Destructure setIsAuthenticated from context
  const { 
    isAuthenticated, 
    setIsAuthenticated, // <-- Added this
    refresh, 
    setRefresh, 
    watched, 
    setWatched 
  } = useContext(Context);
  
  const token = cookie.load("token");
  

  useEffect(() => {
    // Define an async function inside the effect
    const fetchWatched = async () => {
      try {
        const { data } = await axios.get(`${server}/movies/watched`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          withCredentials: true,
        });
        
        // --- Success ---
        setWatched(data.data);

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
            toast.error(error.response.data.message || "Could not fetch watched list.");
          }
        } else {
          // Network errors
          toast.error("Could not fetch watched list. Please try again.");
        }
      } finally {
        // This runs on both success and error
        setLoading(false);
        setRefresh(false);
      }
    };

    fetchWatched();
  
  // Add dependencies for all props/state used inside the effect
  }, [refresh, setWatched, setRefresh, setIsAuthenticated, token]);
  
  if (!isAuthenticated) return <Navigate to={"/"} />;
  
  return (
    <div>
      <Header />
      <div>
        <LoadingBar progress={100} onLoaderFinished={() => setProgress(0)} />
        {/* Make sure your toast container is configured */}
        <ToastContainer 
          className={"toasty"} 
          closeButton={false} 
          autoClose={2000} 
          theme="dark"
        />
        <div className="top-container">
          <h1 className="page-head">
            <div className="v-line"></div>Watched Movies
          </h1>
          <div className="card-container">
            {watched.length > 0 ? (
              <div className="cards">
                {watched.map((movie) => (
                  <MovieCard
                    key={movie.movie.id}
                    movie={movie.movie}
                    type="watched"
                    id={movie.id}
                  />
                ))}
              </div>
            ) : (
              <div>
                {/* This logic will now work:
                  If loading is true, show Loader.
                  If loading is false and watched.length is 0, show "No movies".
                */}
                {loading ? <Loader/> : <h2 className="no">No movies in your watched list..</h2>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watched;