import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Game from './Game';
import Inf from "./Inf";
import Sub from "./Sub";


function App() {
  return(
    <div>
      <Router>
        <div className="menu-links">
          <Link to="/">Home</Link>
          <Link to="/sub">Get Subtitles</Link>
          <Link to="/inf">More Information</Link>
        </div>
        <Switch>
          <Route path="/inf">
            <Inf />
          </Route>
          <Route path="/sub">
            <Sub />
          </Route>
          <Route path="/">
            <Game />
          </Route>
        </Switch>
    </Router>
    </div>
  )
}

export default App;
