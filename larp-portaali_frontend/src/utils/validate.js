export const noValidate = (value) => {
  return null
}

export const validateRequired = (value) => {
  if (value === "") {
    return "Tämä kenttä on pakollinen."
  } else {
    return null
  };
};

export const validateEmail = (value) => {
  if (value === "") {
    return "Sähköpostiosoite on pakollinen."
  } else if (!isEmail(value)) {
    return "Syötä kelvollinen sähköpostiosoite."
  } else {
    return null
  };
};

export const validatePassword = (value) => {
  if (value === "") {
    return "Salasana on pakollinen."
  } else if (!isPassword(value)) {
    return "Salasanan on oltava 8-32 merkkiä pitkä."
  } else {
    return null
  };
};

export const validatePhoneNumber = (value) => {
  if (value === "") {
    return "Puhelinnumero on pakollinen."
  } else if (!isPhoneNumber(value)) {
    return "Puhelinnumero on annettava muodossa +xxx xx xxx xxxx."
  } else {
    return null
  };
};

export const validateDate = (value) => {
  if ( value !== "" && !isDate(value)) {
    return "Päivämäärä on annettava muodossa pp.kk.vvvv."
  } else {
    return null
  };
};


export function isEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export function isPassword(pwd) {
  const re = /.{8,32}/
  return re.test(pwd);
};

export function isPhoneNumber(number) {
  const re = /^\+[0-9]{2,3} [0-9]{2} [0-9]{3} [0-9]{4}$/;
  return re.test(number);
};

export function isDate(date) {
  const re = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\.(0[1-9]|1[0-2])\.(19[0-9]{2}|20[0-9]{2})$/;
  return re.test(date);
};