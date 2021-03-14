# LARP-portaali
![Node.js CI](https://github.com/vmarttil/LARP-portaali/workflows/Node.js%20CI/badge.svg)

LARP-portaali on verkkosovellus, joka tarjoaa liveroolipelien (LARP) järjestäjille ja osallistujille helppokäyttöisen ja tarkoitusta varten suunnitellun ympäristön pelien ilmoittautumisten ja hahmojakojen toteutukseen ja hallintaan. Sovellus tarjoaa peleihin liittyvän tiedon tarkasteluun ja käsittelyyn erilliset käyttöliittymät pelinjärjestäjille ja pelaajille. Pelinjärjestäjän käyttöliittymän kautta on tällä hetkellä mahdollista tarkastella, määritellä, laskea ja hallinnoida peliin liittyviä tietoja, kuten pelin julkisia tietoja ja ilmoittautumislomaketta sekä siihen tehtyjä ilmoittautumisia. Pelaajan käyttöliittymän kautta on mahdollista tarkastella tarjolla olevia pelejä ja niihin liittyviä julkisia tietoja sekä täyttää pelien ilmoittautumislomakkeita ja tarkastella omia ilmoittautumisia.

Sovelluksen tämänhetkinen versio on perustoiinnot sisältävä MVP-versio, jota on tarkoitus kehittää edelleen, jotta se olisi jonakin päivänä mahdollista ottaa harrastajakunnan käyttöön. Sovellus on suunniteltu helposti laajennettavaksi, ja siihen on suunniteltu jatkokehityksenä esimerkiksi seuraavan kaltaisia toiminnallisuuksia:

- lomakkeiden ja pelien poistomahdollisuus (ensimmäinen prioriteetti)
- ilmoittautumisen vastausten ja muokattavan lomakkeen kenttien tallennus localStorageen
- mahdollisuus viedä pelin vastaanotetut ilmoittautumiset sovelluksesta JSON-tai XML-muodossa jatkokäsittelyä varten
- linkki pelin kotisivuille pelin tietoihin
- mahdollisuus määrittää lomakkeiden kysymykset pakollisiksi tai vapaaehtoisiksi
- uusia kysymystyyppejä (Likert-asteikko)
- mahdollisuus luoda omiin profiilitietoihin uusia kenttiä ja tuoda profiilikentän sisältö vastauksen pohjaksi ilmoittautumislomakkeessa
- valintojen minimi- ja maksimimäärän määritys ilmoittautumislomakkeen valintaruutu-tyyppisille kysymyksille

## Projektin tuntikirjanpito

Kirjanpito projektiin käytetystä ajasta ja sen työvaiheista löytyy [erillisestä dokumentista](dokumentaatio/tuntikirjanpito.md).

## Sovelluksen käyttöhje

Sovellus on käytettävissä osoitteessa [https://larp-portaali.herokuapp.com/](https://larp-portaali.herokuapp.com/).

### Pääsivu

Sovelluksen pääsivulla näkyy lista sovelluksessa julkaistuista peleistä ja niiden tietoja on mahdollista
tarkastella (myös kirjautumatta sovellukseen) napsauttamalla pelin nimeä listassa. Jos peliin on mahdollista 
ilmoittautua, tämä näkyy pelin nimen vieressä. Sivun oikeassa yläreunassa on linkit sovellukseen rekisteröitymistä ja 
rekisteröityneiden käyttäjien sisäänkirjautumista varten. Rekisteröitymällä on mahdollista luoda omia pelejä ja 
ilmoittautua muiden luomiin peleihin. Rekisteröityneet käyttäjät voivat muokata profiiliaan, jonka tietoja käytetään
(toistaiseksi rajoitetusti, mutta jatkossa laajemmin) ilmoittautumislomakkeiden esitäyttämiseen, napsauttamalla 
omaa nimeään yläpalkissa. Kirjautuneiden käyttäjien navigointipalkissa näkyy myös linkit omien ilmoittautumisten 
tarkastelusivulle, uuden pelin luontisivulle ja omien pelien tarkastelusivulle.

### Pelien tarkastelu

Pelin nimeä pääsivun listassa napsauttamalla aukeaa pelin tietosivu, joka sisältää tiedot pelistä. Jos pelin 
ilmoittautuminen on avattu, pelin nimen perässä näkyy myös "Ilmoittaudu"-merkintä, ja pelin tietosivulla näkyy 
painike (tai useampi, jos pelille on avattu useamman tyyppisiä ilmoittautumislomakkeita) peliin ilmoittautumista 
varten. Jos käyttäjä on jo ilmoittautunut peliin, tämä korvautuu painikkella, josta käyttäjä pääsee tarkastelemaan 
omaa täytettyä ilmoittautumislomakettaan.

### Omien ilmoittautumisten tarkastelu

Tällä sivulla käyttäjä näkee tiedot kaikista peleihin tekemistään ilmoittautumisista peleittäin ryhmiteltyinä ja 
pelin alkuajankohdan mukaisessa aikajärjestyksessä. Pelaaja voi tarkastella lähettämiään ilmoittautumisia napsauttamalla 
niiden nimeä.

### Pelin luonti

Sivun yläreunan navigointipalkin linkki "Luo uusi peli" vie sivulle, jonka kautta on mahdollista lisätä
sovellukseen uusi peli tietoineen. Uuden pelin luonti -sivulla "Tallenna uusi peli" -painike
tallentaa pelin tiedot, mutta ei vielä luo sille ilmoittautumislomaketta.

### Omien pelien tarkastelu

Sivun yläreunan navigointipalkin linkki "Omat pelit" vie sivulle, jolla käyttäjä näkee kaikki pelit, jotka on joko
luonut tai johon hänet on liitetty järjestäjäksi. Kunkin pelin kohdalla olevaa "Muokkaa tietoja" -painikkeesta 
pääsee pelin muokkaussivulle, jossa on mahdollista muuttaa pelin tietoja sekä hallinnoida pelin järjestäjiä. Jos peliin 
on tehty ilmoittautumisia, edellisten painikkeiden lisäksi pelin kohdalla näkyy myös "Tarkastele ilmoittautumisia" -painike, 
jolla pelin järjestäjä pääsee tarkastelemaan peliin tehtyjä ilmoittautumisia ilmoittautumistyypeittäin (pelaajailmoittautuminen, 
NPC- eli ei-pelaajahahmoilmoittautuminen ja avustajailmoittautuminen). Yksittäistä ilmoittautumista voi tarkastella napsauttamalla 
ilmoittautujan nimeä luettelossa. Pelin tietojen alla näkyy luettelo sille luoduista ilmoittautumislomakkeista sekä niiden kautta 
tehtyjen ilmoittautumisten määrä. Kunkin lomakkeen kohdalla olevan "Muokkaa"-painikkeen avulla pääsee lomakkeen muokkaussivulle
(jonka toiminta on kuvattu alla kohdassa "Ilmoittautumislomakkeen luonti"), edellyttäen, että ilmoittautumislomaketta ei ole 
avattu eikä sen kautta ole tehty ilmoittautumisia. Muokkauspainikkeen vieressä oleva "Avaa/Sulje" painike joko avaa lomakkeen 
ilmoittautumisille, jolloin käyttäjien on mahdollista ilmoittautua peliin lomakkeen kautta. (Tähän kohtaan tulee myöhemmin myös 
painike lomakkeiden poistamiseen.) Lomakkeen tila näkyy sen nimen vasemmalla puolella olevasta kuvakkeesta; yhteen peliin voi olla 
kerrallaan auki vain yksi kappale kutakin lomaketyyppiä.

### Pelin tietojen ja järjestäjien muokkaus

Pelin muokkaussivulla on mahdollista paitsi päivittää pelin luonnin yhteydessä annettuja tietoja, myös hallinnoida sen 
järjestäjiä, eli käyttäjiä, joilla on mahdollisuus muokata pelin tietoja ja ilmoittautumislomakkeita sekä tarkastella 
siihen lähetettyjä ilmoittautumisia. Pelin järjestäjät näkyvät pelin tietolomakkeen alla. Käyttäjän lisääminen pelin 
järjestäjäksi tapahtuu painamalla järjestäjäluettelon alla olevaa +-painiketta ja kirjoittamalla avautuvaan 
ikkunaan lisättävän käyttäjän sähköpostiosoite (jolla käyttäjä on rekisteröitynyt sovellukseen). Jos annettu 
sähköpostiosoite löytyy käyttäjien joukosta, lisättävän henkilön nimi tulee näkyviin ikkunaan ja käyttäjän voi lisätä 
pelin järjestäjäksi napsauttamalla "Lisää järjestäjäksi" -painiketta. Käyttäjiä voi poistaa pelin järjestäjien joukosta 
napsauttamalla nimen vieressä olevaa X-painiketta. Käyttäjä voi poistaa myös itsensä pelin järjestäjistä, jolloin hän ei enää 
näe tai pääse muokkaamaan pelin tietoja ja hänet ohjataan pääsivulle. Pelin viimeistä järjestäjää ei ole mahdollista poistaa.

### Ilmoittautumislomakkeen luonti

Pelille voi luoda ilmoittautumislomakkeita omien pelien tarkastelusivulla pelin kohdalla olevalla "Luo uusi ilmoittautumislomake" 
-painikkeella. Tämä painike luo uuden lomakkeen ja vie käyttäjän lomakkeen muokkaussivulle. Sivun yläreunassa on tekstikentät 
lomakkeen nimelle ja tarkemmalle kuvaukselle, monivalintapainike sen tyypin valitsemiseen, ja näiden alla luettelo lomakkeen 
kysymyksistä.

Luotuun lomakkeeseen on lisätty valmiiksi 
joukko oletuskysymyksiä, joista kuitenkin vain "Nimi"- ja "Sähköpostiosoite"-kysymykset ovat pakollisia, eli niitä ei voi poistaa. 
Muiden kysymysten poistaminen onnistuu napsauttamalla niiden oikeassa yläreunassa olevaa roskakoripainiketta. Kysymyksiä (sekä 
oletuskysymyksiä että käyttäjän itse luomia kysymyksiä) on mahdollista muokata napsauttamalla kysymyksen oikeassa yläreunassa olevaa 
kynäpainiketta. 

Avautuvassa muokkausikkunassa käyttäjä voi muokata kysymyksen tyyppiä, tekstiä ja selitettä, ja valintakysymysten 
tapauksessa myös sen valittavissa olevia vaihtoehtoja. Vaihtoehtoja voi lisätä kirjoittamalla uuden vaihtoehdon vaihtoehtojen alla 
olevaan tekstikenttään ja napsauttamalla "Lisää"-painiketta. Vaihtoehtoja voi poistaa napsauttamalla niiden vieressä olevaa X-painiketta 
ja niiden järjestystä voi muuttaa vetämällä ne uuteen paikkaan. "Tallenna"-painike tallentaa kysymyksen muokatut tiedot ja sulkee ikkunan ja 
"Peruuta"-painike sulkee ikkunan tallentamatta muutoksia. 

Kysymysten järjestystä voi muuttaa vetämällä kysymyksen uuteen paikkaan lomakkeella. Uusia kysymyksiä voi lisätä joko 
valitsemalla lomakkeen lopussa olevassa "Lisää kysymys" -ruudussa valmiin kysymyksen alasvetovalikosta ja napsauttamalla 
"Lisää"-painiketta tai napsauttamalla "Luo uusi kysymys" -painiketta ja määrittelemällä uuden kysymyksen edellä kuvatussa 
muokkausikkunassa. Alasvetovalikossa näkyvät paitsi ne oletuskysymykset, joita ei ole valittu lomakkeelle, myös käyttäjän 
muihin hallinnoimiinsa lomakkeisiin luomat kysymykset. Molemmilla tavoilla lisätyt kysymykset lisätään lomakkeen loppuun, 
jonka jälkeen niitä on mahdollista siirtää ja muokata normaalisti.

### Ilmoittautuminen

Kun joku pelin järjestäjistä on avannut pelin ilmoittautumisen, kuka tahansa kirjautunut käyttäjä voi ilmoittautua peliin 
napsauttamalla pelin tietosivulla olevaa ilmoittautumispainiketta, täyttämällä avautuvan ilmoittautumislomakkeen kaikki 
kentät (toistaiseksi kaikki ilmoittautumislomakkeen kysymykset ovat pakollisia). Kun lomake 
on täytetty ja käyttäjä napsauttaa sivun alareunassa olevaa "Lähetä ilmoittautuminen" -painiketta, ilmoittautumisen tiedot tallennetaan 
tietokantaan ja sovellus palauttaa käyttäjän omien ilmoittautumisten tarkastelusivulle. 

## Tekninen toteutus 

Sovelluksen backend on toteutettu käyttäen node.js:ää ja Express-palvelinta. Sovelluksen tietojen tallennukseen käytetään PostgreSQL-tietokantaa 
ja tietokantayhteyksien hallintaan node-pg-kirjastoa. Frontend on toteutettu käyttäen Reactia. Backend-yhteyksien toteuttamiseen on käytetty 
Axios-kirjastoa ja käyttöliittymä on muotoiltu React Bootstrap -käyttöliittymäkirjastolla. Lisäksi on käytetty muutamaa valmista käyttöliittymäkirjastoa 
kuten React-datepicker ja React-beautiful-dnd.
