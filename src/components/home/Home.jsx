import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import {useContext } from "react";
import './home.css'
import { Context } from "../../main.jsx";

function HomePage() {
  const {isAuthenticated } = useContext(Context);
  if (isAuthenticated) return <Navigate to={"/watchlist"} />;
  return (
    <div>
      <div className="landing-frame">
        <div className="landing-frame-message">
          <div className="legend-head">Welcome To MovieMania!</div>

          <div className="legend-body">
          Browse, bookmark, and curate your movie journey with MovieMania's personalized watchlist.
          </div>
          <br />
          
          <div className="btn-wrapper">
          <Link className="links" to="/signup"><button className="btn">Sign Up</button></Link>
          
          
          <Link className="links" to="/login"><button className="btn">Log In</button></Link>
          </div>
          
            
        </div>
      </div>
    </div>
  );
}
export default HomePage;
