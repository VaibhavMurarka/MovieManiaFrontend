import './App.css';
import { BrowserRouter as Router,  Routes, Route} from 'react-router-dom';
import Home from './components/home/Home.jsx';
import {Watched} from './components/list/Watched.jsx'
import {Watchlist} from './components/list/Watchlist.jsx'
import {Add} from './components/add/Add.jsx'
import SignUp from './components/login/Signup.jsx'
import Login from './components/login/Login.jsx'



function App() {
  return (
    <Router> 
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/watchlist" element={<Watchlist/>}/>
        <Route exact path="/watched" element={<Watched/>}/>
        <Route exact path="/add" element={<Add/>}/>
        <Route exact path="/signup" element={<SignUp/>}/>
        <Route exact path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
