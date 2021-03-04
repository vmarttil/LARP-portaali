CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS person (
  id int GENERATED ALWAYS AS IDENTITY,
  email varchar(64) UNIQUE NOT NULL,
  password varchar(64) NOT NULL,
  personal_data bytea NOT NULL,
  profile_data bytea NOT NULL,
  admin boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game (
  id int GENERATED ALWAYS AS IDENTITY,
  name varchar(128) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  place varchar(64) NOT NULL,
  description varchar NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_organiser (
  game_id int NOT NULL,
  person_id int NOT NULL,
  PRIMARY KEY (game_id, person_id),
  CONSTRAINT fk_game_person
    FOREIGN KEY (game_id) 
	  REFERENCES game(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_person_game
    FOREIGN KEY (person_id) 
	  REFERENCES person(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form (
  id int GENERATED ALWAYS AS IDENTITY,
  name varchar(64) NOT NULL,
  description varchar(256) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_form (
  game_id int NOT NULL,
  form_id int NOT NULL,
  is_open boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (game_id, form_id),
  CONSTRAINT fk_game_form
    FOREIGN KEY (game_id) 
	  REFERENCES game(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_form_game
    FOREIGN KEY (form_id) 
	  REFERENCES form(id)
    ON DELETE CASCADE
);