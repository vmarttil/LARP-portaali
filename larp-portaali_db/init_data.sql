

INSERT INTO person (
  email,
  password,
  personal_data,
  profile_data,
  admin
)
VALUES 
(
  'ville.marttila@iki.fi',
  '$2a$08$PRzn6/kn9/AQTizb04kXq.1jj/QGApy8lHnajwC8VGd5wQc5bTiPy',
  decode('c30d04070302a7f390db8b8492fa71d2c059010d7dde718a9c07d90c175a117d5e459efe35c74ab74f90656394223f7834375a042f2f6b134de86fc4027bd50bc5745af6374fadcd06352b92ed529ee1c68b891cf6352986be3916c6341a34a687c936ffd1cdba506bfb5467f71531773c7b54ec5293a285042799f4af3bafab396fb9d76649bbdb931d12b9ae8b3ac65f4e7ce6bfb18586b2ea5f66ae168e0d1284e6ad7ca392e85bee0a2e97dbb753670445240e3b1675c2ffa84b0a15b74ef9db1fe0b08c3e620791dfce7d88bc59a6edc0f40ef78a757cce029ae6ffc49d3efb256015230bdb02d8aa42a5c92fbc4493104ad676795bd29a5b986f8e3d940e82a668ad20af1f43bdab6aaafc9cec9def8cf39f7c518ee15e29942198039fc33d9a425c358b28eeaf6e', 'hex'),
  decode('c30d040703028b8bbd2b3e6061347dd2c01201ae12ff8b3fa29833d2f82963d5289e46c50d222e220c419651fd3eec5ca3e0462c00a3672d9fe25596b302769e9700a8165cf1a4282b694dcdf85b5809e4f04b69b112dd017ec482a84bd6674d289c5ceb36296a02c315cb1091a42a6bb1f0879878ba37444129fa5eeb260c839689a467e29602b10d37c4064c94928de6ceed11fd6c9720e8e2738801369a1f787483864376fe16944120611fbb9dbe642fbae932dae3dcaf7e2b65b56a25023a0fd1881121f7d028fca3c9a3090f6f308d2e06534af60bb07cf142b23861d8c6a9d2a9', 'hex'),
  false
);



INSERT INTO question_type (
  name, 
  display_text
  )
  VALUES 
    ('text', 'Tekstikenttä'),
    ('integer', 'Numerokenttä'),
    ('radio', 'Valintanappi'),
    ('checkbox', 'Valintaruutu'),
    ('textarea', 'Tekstialue');



INSERT INTO question (
  question_type_id, 
  question_text, 
  description, 
  is_default,
  is_optional,
  prefill_tag
  )
  VALUES
    (1,'Nimi','Ilmoittautujan koko nimi.',true, false, 'name'),
    (1,'Sähköposti','Sähköpostiosoite johon peliin liittyvät tiedotteet lähetetään.',true, false, 'email'),
    (1,'Puhelinnumero','Puhelinnumero, josta ilmoittautujan tavoittaa tarvittaessa.',true, true, 'phone'),
    (2,'Ikä','Ilmoittautujan ikä pelin aikaan.',true, true, 'age'),
    (5,'Kuvaile itseäsi pelaajana','Kuvaile pelityyliäsi ja -mieltymyksiäsi, minkä tyyppisestä pelisisällöstä yleensä nautit, oletko enemmän aktiivinen vai reaktiivinen pelaaja, jne.',true, true, 'player_profile'),
    (3,'Hahmon toivottu sukupuoli','Sukupuoli jota edustavaa hahmoa haluat pelata (ei välttämättä sama kuin pelaajan sukupuoli).',true, true, null),
    (4,'Itsellesi tärkeimmät elementit pelissä','Valitse ne elementit, joita toivot pelisi eniten sisältävän. Mitä useamman elementin valitset, sitä pienempi on yksittäisen valinnan painoarvo.',true, true, null),
    (4,'Teemat, joita et halua pelata','Valitse ne teemat, joita et halua hahmossasi käsiteltävän tai joita et halua pelisisältöösi.',true, true, null),
    (5,'Minkä tyyppistä hahmoa haluaisit pelata tässä pelissä?','Kuvaile vapaasti, minkälaisia ominaisuuksia, luonteenpiirteitä, tms. toivoisit hahmollesi, minkälaisessa asemassa toivoisit hahmon olevan, jne.',true, true, null),
    (5,'Minkä tyyppisiä juonikuvioita tai teemoja toivoisit peliisi?','Kuvaile minkä tyyppistä pelisisältöä haluaisit pelata ja kerro mahdollisista juoni-ideoista jollaisia haluaisit pelata.',true, true, null),
    (5,'Muita terveisiä pelinjohdolle','Tähän voit kirjoittaa ilmoittautumistasi koskevia huomioita pelinjohdolle ja muita olennaiseksi katsomiasi seikkoja, jotka eivät sopineet muihin kenttiin.',true, true, null);



INSERT INTO option (
  question_id,
  option_number,
  option_text
  )
  VALUES
    (6,1,'Mies'),
    (6,2,'Nainen'),
    (6,3,'Muu'),
    (6,4,'Ei väliä'),
    (7,1,'Seikkailu'),
    (7,2,'Romantiikka'),
    (7,3,'Parisuhde'),
    (7,4,'Ystävyys'),
    (7,5,'Juonittelu'),
    (7,6,'Toiminta'),
    (7,7,'Politiikka'),
    (7,8,'Vastoinkäymiset'),
    (7,9,'Yllätykset'),
    (8,1,'Läheisen kuolema'),
    (8,2,'Fyysinen väkivalta'),
    (8,3,'Seksuaalisuus'),
    (8,4,'Alistaminen'),
    (8,5,'Yksinäisyys'),
    (8,6,'Henkinen väkivalta'),
    (8,7,'Mielenterveysongelmat'),
    (8,8,'Fyysiset vammat');



INSERT INTO game (
  name, 
  start_date,
  end_date,
  place,
  price,
  description
  ) 
  VALUES 
    (
    'Testipeli',
    DATE '2021-05-21',
    DATE '2021-05-21',
    'Helsinki',
    35,
    'Tässä on lyhyt kuvaus pelistä.'
    );



INSERT INTO game_organiser (
  person_id,
  game_id
  ) 
  VALUES 
    (1, 1);


INSERT INTO form_class (
  name, 
  button_text
  )
  VALUES 
    ('player', 'Ilmoittaudu pelaajaksi'),
    ('npc', 'Ilmoittaudu ei-pelaajahahmoksi'),
    ('helper', 'Ilmoittaudu avustajaksi');


INSERT INTO form (
	game_id,
  name, 
	description,
  	is_open,
	form_class_id
  ) 
  VALUES
    (1, 'Oletuslomake', 'Uudelle pelille käytettävä oletuslomakepohja.', false, 1);




INSERT INTO form_question (
    form_id,
    question_id,
    position
    )
    VALUES
    (1,1,1),
    (1,2,2),
    (1,3,3),
    (1,4,4),
    (1,5,5),
    (1,6,6),
    (1,7,7),
    (1,8,8),
    (1,9,9),
    (1,10,10),
    (1,11,11);
