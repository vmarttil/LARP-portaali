import React from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          Käyttäjän <strong>{currentUser.username}</strong> profiili
        </h3>
      </header>
      <p>
        <strong>Tunniste:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Käyttäjänumero:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Sähköpostiosoite:</strong> {currentUser.email}
      </p>
      <strong>Valtuudet:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;