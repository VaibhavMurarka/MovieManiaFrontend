import axios from "axios";
import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./signup.css";
import { Link, Navigate } from "react-router-dom";
import { server, Context } from "../../main.jsx";
import cookie from 'react-cookies'
import Loader from "../loader/Loader.jsx";

const Signup = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- THIS FUNCTION HAS BEEN CORRECTED ---
  const formSubmit = async (e) => {
    e.preventDefault();
    if(name==="" || email==="" || password===""){
      toast(`Enter the details first!`, {
        autoClose: 1000,
        closeOnClick: false,
        pauseOnHover: false,
        theme: "dark",
      });
      return ;
    }
    
    setLoading(true);

    try {
      // --- TRY block ---
      // This part runs if the API call is SUCCESSFUL (2xx status)
      const {data} = await axios.post(
        `${server}/users/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      // Handle the 200 OK / 201 Created response
      if (data.success) {
        // --- SUCCESS ---
        cookie.save('token', data.token, {
          path: '/',
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
        toast.error("Registration failed. Please try again.", {
          autoClose: 1000,
          closeOnClick: false,
          pauseOnHover: false,
          theme: "dark",
        });
      }
    }
  };
  // --- END OF CORRECTED FUNCTION ---

  if (isAuthenticated) return <Navigate to={"/watchlist"} />;

  return (
    <>
    {loading?(
      <div>
        <Loader/>
        <div className="transition-signup"><h2>Please wait...</h2></div>
      </div>
    ):(<div className="form-container">
      <form action="post" className="signup-form form" onSubmit={formSubmit}>
        <h3>Sign Up</h3>

        <label >Name</label>
        <input type="text" placeholder="Name"  value={name} onChange={(e)=>setName(e.target.value)}/>

        <label >Email</label>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <label>Password</label>
        <input type="password" placeholder="Password"  value={password} onChange={(e)=>setPassword(e.target.value)}/>

        <div className="button-submit">
        <button type="submit">Register</button>

 <Link className="links" to="/login"><button>Log In</button></Link>
        </div>
      </form>
      <ToastContainer closeButton="false" />
    </div>)}
    </>
  );
};

export default Signup;