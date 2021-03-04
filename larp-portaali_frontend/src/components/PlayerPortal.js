import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import UserService from "../services/user.service";

const PlayerPortal = () => {
  
  const [content, setContent] = useState("");


  useEffect(() => {
    UserService.getPlayerPortal().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);




  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default PlayerPortal;