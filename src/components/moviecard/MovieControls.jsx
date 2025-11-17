import React, { useContext } from "react";
import { BsEyeFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { AiFillEyeInvisible } from "react-icons/ai";
import "./moviecontrol.css";
import { server, Context } from "../../main.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import cookie from 'react-cookies'

export const MovieControls = ({ movie, type }) => {
  // Add setIsAuthenticated to trigger redirects on auth failure
  const { setRefresh, setIsAuthenticated } = useContext(Context);
  const token = cookie.load("token");
  const {isAuthenticated } = useContext(Context);
  // Helper object for toast options
  const toastOptions = {
    autoClose: 1000,
    closeOnClick: false,
    pauseOnHover: false,
    theme: "dark",
  };

  const changeType = async () => {
    try {
      await axios.put(
        `${server}/movies/changetype`,
        { movie, type },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          withCredentials: true,
        }
      );

      // --- Success ---
      toast(`Moved to ${type === "watchlist" ? "watched" : "watchlist"}`, toastOptions);
      setRefresh(true);

    } catch (error) {
      // --- Error Handling ---
      if (error.response) {
        // Check for 401 Unauthorized
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Session expired.", toastOptions);
          // This will trigger the redirect in the parent component
          setIsAuthenticated(false);
        } else {
          // Handle other server errors
          toast.error(error.response.data.message || "Could not change type.", toastOptions);
        }
      } else {
        // Handle network errors
        toast.error("Network error. Please try again.", toastOptions);
      }
    }
  };

  const deleteMovie = async () => {
    try {
      await axios.delete(`${server}/movies/deletemovie`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        withCredentials: true,
        data: {
          movie: movie
        }
      });

      // --- Success ---
      toast(`Movie Deleted`, toastOptions);
      setRefresh(true);

    } catch (error) {
      // --- Error Handling ---
      if (error.response) {
        // Check for 401 Unauthorized
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Session expired.", toastOptions);
          // This will trigger the redirect in the parent component
          setIsAuthenticated(false);
        } else {
          // Handle other server errors
          toast.error(error.response.data.message || "Could not delete movie.", toastOptions);
        }
      } else {
        // Handle network errors
        toast.error("Network error. Please try again.", toastOptions);
      }
    }
  };
  if (!isAuthenticated) return <Navigate to={"/"} />;
  return (
    <div className="controls">
      <div className="card-control">
        <button
          className="ctrl-btn"
          onClick={() => changeType()}
          title={type === "watchlist" ? "Mark as Watched" : "Move to Watchlist"}
        >
          {type === "watchlist" ? <BsEyeFill /> : <AiFillEyeInvisible />}
        </button>
        <button
          className="ctrl-btn"
          onClick={() => deleteMovie()}
          title="Remove"
        >
          <RxCross1 />
        </button>
      </div>
    </div>
  );
};

export default MovieControls;