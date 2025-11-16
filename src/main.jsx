import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createContext } from "react";
import cookie from 'react-cookies'
//exchange see
export const server = "https://movie-mania-server-nu.vercel.app";
//export const server = "http://localhost:4000";
const token = cookie.load('token')
const temp = token?true:false;

export const Context = createContext({ isAuthenticated: temp});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(temp);
  const [watchlist, setWatchlist] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [watched, setWatched] = useState([]);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        watchlist,
        setWatchlist,
        watched,
        setWatched,
        refresh,
        setRefresh
      }}
    >
      <App />
    </Context.Provider>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <AppWrapper />
);
