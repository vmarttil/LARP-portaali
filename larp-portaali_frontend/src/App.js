import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PlayerPortal from "./components/PlayerPortal";
import OrganiserPortal from "./components/OrganiserPortal";
import AdminPortal from "./components/AdminPortal";

const App = () => {
  const [showOrganiserPortal, setShowOrganiserPortal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = UserService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowOrganiserPortal(user.roles.includes("ROLE_ORGANISER"));
      setShowAdminPortal(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            LARP-portaali
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Pääsivu
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item">
                <Link to={"/player"} className="nav-link">
                  Pelaajaportaali
                </Link>
              </li>
            )}

            {showOrganiserPortal && (
              <li className="nav-item">
                <Link to={"/organiser"} className="nav-link">
                  Pelinjärjestäjäportaali
                </Link>
              </li>
            )}

            {showAdminPortal && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Hallintaportaali
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  Kirjaudu ulos
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Kirjaudu sisään
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Rekisteröidy
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/player" component={PlayerPortal} />
            <Route path="/organiser" component={OrganiserPortal} />
            <Route path="/admin" component={AdminPortal} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;