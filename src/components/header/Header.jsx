import React, {useContext, useRef, useState} from 'react';
import { Link } from "react-router-dom";
import './header.css'
import {ImVideoCamera} from 'react-icons/im'
import {FaTimes, FaBars} from 'react-icons/fa'
import {RiSearchEyeLine} from 'react-icons/ri'
import LoadingBar from 'react-top-loading-bar';
import { server, Context } from '../../main.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import cookie from 'react-cookies'

export const Header = () => {
  const {setWatched, setWatchlist } = useContext(Context);
  const {isAuthenticated, setIsAuthenticated} = useContext(Context);
  const [progress, setProgress] = useState(0);
  console.log(progress);
  const logoutHandler = async () => {
    cookie.remove('token', { path: '/' });
    toast("Logged Out", {
      autoClose: 1000,
      closeOnClick: false,
      pauseOnHover: false,
      theme: "dark",
    });
    setIsAuthenticated(false);
    setWatched([]);
    setWatchlist([]);
    showNavbar();
  }
  const navRef = useRef();
    const showNavbar = () =>{
        navRef.current.classList.toggle("responsive-nav");
    }
  return (
    <header className='nav'>
        <h3><ImVideoCamera/>  MovieMania</h3>
        <LoadingBar progress={100} onLoaderFinished={() => setProgress(0)}/>
        <nav ref={navRef}>
            <Link className= "links" to='/watchlist' onClick={showNavbar}>
              Watchlist
            </Link>
            <Link className= "links" to='/watched' onClick={showNavbar}>Watched</Link>
            {isAuthenticated? <Link className= "links" to='/' onClick={()=>logoutHandler()}>Logout</Link>:<Link className= "links" to='/signup' onClick={showNavbar}>Sign Up</Link>}
            <Link className="links add" to='/add' onClick={showNavbar}><RiSearchEyeLine/></Link>
            <button className='nav-btn nav-close-btn' onClick={showNavbar}><FaTimes/></button>
        </nav>
        <button className='nav-btn' onClick={showNavbar}><FaBars/></button>
    </header>

  )
}

export default Header;
