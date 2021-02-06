import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';
import UserService from "../services/user.service";
import { useTextField, useRadioField } from "../utils/hooks"
import { TextField, RadioField } from "./FormFields"
import { noValidate, validateRequired, validateEmail, validatePassword, validatePhoneNumber, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Profile = (props) => {

  const currentUser = UserService.getCurrentUser();
  const userId = currentUser.id;

  /* Fields for user profile data */
  const emailField = useTextField("email", "Sähköposti","email", 32, validateEmail, currentUser.email);
  const passwordField = useTextField("password", "Salasana","password", 32, validatePassword, currentUser.password);
  
  /* Fields for personal data */
  const firstNameField = useTextField("first_name", "Etunimi","text", 32, validateRequired, currentUser.personalData.first_name ?? "");
  const lastNameField = useTextField("last_name", "Sukunimi","text", 32, validateRequired, currentUser.personalData.last_name ?? "");
  const nicknameField = useTextField("nickname", "Lempinimi","text", 32, noValidate, currentUser.personalData.nickname ?? "");
  const phoneField = useTextField("phone", "Puhelinnumero","text", 0, validatePhoneNumber, currentUser.personalData.phone ?? "");
  const hometownField = useTextField("hometown", "Kotipaikkakunta","text", 32, noValidate, currentUser.personalData.hometown ?? "");
  const genderOptions = {1: "Mies", 2: "Nainen", 9: "Muu"};
  const genderField = useRadioField("gender", "Sukupuoli", false, genderOptions, currentUser.personalData.gender ?? null);
  const birthdateField = useTextField("birthdate", "Syntymäaika","text", 10, validateDate, currentUser.personalData.birthdate ?? "");
  const dietaryRestrictionsField = useTextField("dietary_restrictions", "Ruokavaliorajoitteet", "textarea", 3000, noValidate, currentUser.personalData.dietary_restrictions ?? "", 8);
  const healthInformationField = useTextField("health_information", "Terveystiedot", "textarea", 3000, noValidate, currentUser.personalData.health_information ?? "", 8);
  
  /*
  const [playerProfile,setPlayerProfile] = useState(currentUser.profileData.playerProfile ?? "");
  const [answerTemplates,setAnswerTemplates] = useState(currentUser.profileData.answerTemplates ?? []);

  const [profileData, setProfileData] = useState(currentUser.profileData) 
  */

  const [successful, setSuccessful] = useState(false);
  const [saveType, setSaveType] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => { 
      setMessage('');
      setSaveType(null) }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // Form submission handlers
  
  const saveAccountData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let updateData =  {id: userId, 
                      email: emailField.value, 
                      password: passwordField.value};
    
    if (!emailField.error && !passwordField.error) {
      currentUser.email = emailField.value;
      UserService.updateCurrentUser(currentUser);
      setSaveType("account");
      saveData(updateData);
    }
  };

  const savePersonalData = async (e) => {
    e.preventDefault();
    setMessage("");
    let updateData =  {id: userId, 
                        personalData: {
                          first_name: firstNameField.value, 
                          last_name: lastNameField.value,
                          nickname: nicknameField.value,
                          phone: phoneField.value,
                          hometown: hometownField.value,
                          gender: genderField.value,
                          birthdate: birthdateField.value,
                          dietary_restrictions: dietaryRestrictionsField.value,
                          health_information: healthInformationField.value
                        }
                      };
    if (!firstNameField.error &&
        !lastNameField.error &&
        !nicknameField.error &&
        !phoneField.error &&
        !hometownField.error &&
        !genderField.error &&
        !birthdateField.error &&
        !dietaryRestrictionsField.error &&
        !healthInformationField.error) {
      currentUser.personalData = updateData.personalData;
      UserService.updateCurrentUser(currentUser);
      setSaveType("personal");
      saveData(updateData);
    };
  };

  /*
  const saveProfileData = async (e) => {
    e.preventDefault();
    setMessage("");
    profileDataForm.current.validateAll();
    let updateData =  {id: userId,
                      profileData: profileData}
    if (checkProfileDataBtn.current.context._errors.length === 0) {
      saveData(updateData)
    }
  };
  */

  async function saveData(updateData) {
    try {
      let response = await UserService.saveUserProfile(updateData)
      setMessage(response.data.message);
      setSuccessful(true);
    } catch (error) {
      setMessage(errorMessage(error));
      setSuccessful(false);
    }
  }

  return (
    <Card style={{ width: "48rem" }}>
      <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
      <h2>Käyttäjätilin tiedot</h2>      
      <Form className="align-items-center" onSubmit={saveAccountData}>

        <TextField {...emailField} />
        <TextField {...passwordField} />

        <Form.Group controlId="submit">
          <Button variant="primary" type="submit" block>
            <span>Tallenna käyttäjätilin tiedot</span>
          </Button>
        </Form.Group>

        <Alert show={message !== "" && saveType === "account"} variant={successful ? "success" : "danger"}>
          {message}
        </Alert>

      </Form>

      <h2>Henkilökohtaiset tiedot</h2>      
      <Form className="align-items-center" onSubmit={savePersonalData}>

        <TextField {...firstNameField} />
        <TextField {...lastNameField} />
        <TextField {...nicknameField} />
        <TextField {...phoneField} />
        <TextField {...hometownField} />
        <RadioField {...genderField} />
        <TextField {...birthdateField} />
        <TextField {...dietaryRestrictionsField} />
        <TextField {...healthInformationField} />

        <Form.Group controlId="submit">
          <Button variant="primary" type="submit" block>
            <span>Tallenna henkilökohtaiset tiedot</span>
          </Button>
        </Form.Group>

        <Alert show={message !== "" && (saveType === "personal")} variant={successful ? "success" : "danger"}>
          {message}
        </Alert>

      </Form>


    </Card>




     /* <div className="col-md-12">
       <div className="card card-container">
         <h2>Käyttäjätilin tiedot</h2>

         { <Form onSubmit={saveAccountData} ref={accountDataForm}>
             <div>
               <div className="form-group">
                 <label>Käyttäjänumero</label>
                 <label>{userId}</label>
               </div>
               <div className="form-group">
                 <label htmlFor="email">Sähköpostiosoite</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="email"
                   value={email}
                   onChange={onChangeEmail}
                   validations={[required, validEmail]}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="password">Salasana</label>
                 <Input
                   type="password"
                   className="form-control"
                   name="password"
                   value={password}
                   onChange={onChangePassword}
                   validations={[required, validPassword]}
                 />
               </div>
               <div className="form-group">
                 <button className="btn btn-primary btn-block">Tallenna käyttäjätilin tiedot</button>
               </div>
             </div>

           {message && (
             <div className="form-group">
               <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                 {message}
               </div>
             </div>
           )}

           <CheckButton ref={checkAccountDataBtn} />
         </Form>


         <h2>Henkilökohtaiset tiedot</h2>
         <Form onSubmit={savePersonalData} ref={personalDataForm}>
             <div>
               <div className="form-group">
                 <label htmlFor="firstName">Etunimi</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="firstName"
                   value={personalData.firstName}
                   onChange={onChangePersonalData}
                   validations={[required]}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="lastName">Sukunimi</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="lastName"
                   value={personalData.lastName}
                   onChange={onChangePersonalData}
                   validations={[required]}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="lastName">Lempinimi</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="nickname"
                   value={personalData.nickname}
                   onChange={onChangePersonalData}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="phone">Puhelinnumero</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="phone"
                   value={personalData.phone}
                   onChange={onChangePersonalData}
                   validations={[validPhoneNumber]}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="hometown">Kotipaikkakunta</label>
                 <Input
                   type="text"
                   className="form-control"
                   name="hometown"
                   value={personalData.hometown}
                   onChange={onChangePersonalData}
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="gender">Sukupuoli</label>
                 <div className="radio">
                   <label>
                     <Input
                       type="radio"
                       className="form-control"
                       name="gender"
                       value="2"
                       checked={personalData.gender === "2"}
                       onChange={onChangePersonalData}
                     />
                     Nainen
                   </label>
                 </div>
                 <div className="radio">
                   <label>
                     <Input
                       type="radio"
                       className="form-control"
                       name="gender"
                       value="1"
                       checked={personalData.gender === "1"}
                       onChange={onChangePersonalData}
                     />
                     Mies
                   </label>
                 </div>
                 <div className="radio">
                   <label>
                     <Input
                       type="radio"
                       className="form-control"
                       name="gender"
                       value="9"
                       checked={personalData.gender === "9"}
                       onChange={onChangePersonalData}
                     />
                     Muu
                   </label>
                 </div>
               </div>
              

 birthDate: birthDate,
 dietaryRestrictions: dietaryRestrictions,
 healthInformation: healthInformation





               <div className="form-group">
                 <button className="btn btn-primary btn-block">Tallenna käyttäjätilin tiedot</button>
               </div>
             </div>

           {message && (
             <div className="form-group">
               <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                 {message}
               </div>
             </div>
           )}

           <CheckButton ref={checkAccountDataBtn} />
         </Form> }









       </div>
     </div> */
   );
};



export default Profile;