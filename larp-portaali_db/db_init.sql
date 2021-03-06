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
  price int NOT NULL,
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

CREATE TABLE question_type (
  id int GENERATED ALWAYS AS IDENTITY,
  name varchar(32) NOT NULL,
  display_text varchar(64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE question (
  id int GENERATED ALWAYS AS IDENTITY,
  question_type_id int NOT NULL,
  question_text text NOT NULL,
  description text,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_optional BOOLEAN NOT NULL DEFAULT TRUE,
  prefill_tag varchar(64),
  PRIMARY KEY (id),
  CONSTRAINT fk_question_question_type
    FOREIGN KEY (question_type_id) 
	  REFERENCES question_type(id)
    ON DELETE CASCADE
);

CREATE TABLE form_question (
  form_id int NOT NULL,
  question_id int NOT NULL,
  position int NOT NULL,
  PRIMARY KEY (form_id, question_id),
  CONSTRAINT fk_form_question
    FOREIGN KEY (form_id) 
	  REFERENCES form(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_question_form
    FOREIGN KEY (question_id) 
	  REFERENCES question(id)
    ON DELETE CASCADE
);

CREATE TABLE option (
  id int GENERATED ALWAYS AS IDENTITY,
  question_id int NOT NULL,
  option_text text NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_option_question
    FOREIGN KEY (question_id) 
	  REFERENCES question(id)
    ON DELETE CASCADE
);

