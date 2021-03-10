import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useLocation } from "react-router-dom";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import fi from 'date-fns/locale/fi';
import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";

import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";
import Game from "./components/Game";
import EditGame from "./components/EditGame";
import NewGame from "./components/NewGame";
import EditForm from "./components/EditForm";
import RegistrationForm from "./components/RegistrationForm";
import Profile from "./components/Profile";
import PlayerPortal from "./components/PlayerPortal";
import OrganiserPortal from "./components/OrganiserPortal";
import AdminPortal from "./components/AdminPortal";

registerLocale('fi', fi)
setDefaultLocale('fi');

const App = () => {
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = UserService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminPortal(user.admin);
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
              <Link to={"/mainPage"} className="nav-link">
                Pääsivu
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item">
                <Link to={"/portal/player"} className="nav-link">
                  Omat ilmoittautumiset
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/game/new"} className="nav-link">
                  Luo uusi peli
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/portal/organiser"} className="nav-link">
                  Omat pelit
                </Link>
              </li>
            )}

            {showAdminPortal && (
              <li className="nav-item">
                <Link to={"/portal/admin"} className="nav-link">
                  Hallintaportaali
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/home" className="nav-link" onClick={logOut}>
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
            <Route exact path={["/", "/home", "/mainPage"]}>
              <MainPage />
            </Route>
            <Route exact path="/login">
              <Login setCurrentUser={setCurrentUser}/>
            </Route>
            <Route exact path="/register">
              <Register />  
            </Route>
            <Route exact path="/profile">
              <Profile/>  
            </Route>
            <Route exact path="/game/new">
              <NewGame />  
            </Route>
            <Route path="/game/:game_id/form/:form_id/edit">
              <EditForm />  
            </Route>
            <Route path="/game/:game_id/form/:form_id/register">
              <RegistrationForm />
            </Route>
            <Route path="/game/:id/edit">
              <EditGame />  
            </Route>
            <Route path="/game/:id">
              <Game />  
            </Route>
            <Route path="/portal/player">
              <PlayerPortal />  
            </Route>
            <Route path="/portal/organiser">
              <OrganiserPortal />  
            </Route>
            <Route path="/portal/admin">
              <AdminPortal />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;