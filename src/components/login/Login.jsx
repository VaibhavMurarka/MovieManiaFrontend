import axios from "axios";
import React, { useState, useContext } from "react";
import { server, Context } from "../../main.jsx";
import { ToastContainer, toast } from "react-toastify";
import "./signup.css";
import { Link, Navigate } from "react-router-dom";
import cookie from "react-cookies";
import Loader from "../loader/Loader.jsx";

const Login = () => {
  const { setIsAuthenticated, isAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast(`Enter the details first!`, {
        autoClose: 1000,
        closeOnClick: false,
        pauseOnHover: false,
        theme: "dark",
      });
      return;
    }
    
    setLoading(true);

    try {
      // --- TRY block ---
      // This part runs if the API call is SUCCESSFUL (2xx status)
      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Handle the 200 OK response
      if (data.success) {
        // --- SUCCESS ---
        cookie.save("token", data.token, {
          path: "/",
          maxAge: 2 * 24 * 60 * 60, // 2 days
          secure: true,
          httpOnly: false, 
        });
        setIsAuthenticated(true); // This will trigger the redirect
        toast.success(data.message, { // Use success toast
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
          theme: "dark",
        });
        // No need to set loading false, component will unmount
      } else {
        // --- LOGICAL FAILURE (e.g., 200 OK, but success: false) ---
        setLoading(false); // Stop loading
        toast.error(data.message, { // Use error toast
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
          theme: "dark",
        });
      }

    } catch (error) {
      // --- CATCH block ---
      // This part runs if the API call FAILS (4xx, 5xx status)
      setLoading(false); // Stop loading

      if (error.response && error.response.data && error.response.data.message) {
        // This is the error body from your backend: {"success": false, "message": "..."}
        toast.error(error.response.data.message, {
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
          theme: "dark",
        });
      } else {
        // Fallback for network errors, etc.
        toast.error("Login failed. Please try again.", {
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
          theme: "dark",
        });
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/watchlist"} />;
  }
  
  return (
    <>
      {loading ? (
        <div>
          <Loader/>
          <div className="transition-signup">
            <h2>Please wait...</h2>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <form action="post" onSubmit={formSubmit} className="form login-form">
            <h3>Login</h3>

            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-submit">
              <button type="submit">Log In</button>

              <Link className="links" to="/signup">
                <button className="link-btn">Sign Up</button>
              </Link>
            </div>
          </form>
          <ToastContainer closeButton="false" />
        </div>
      )}
    </>
  );
};

export default Login;