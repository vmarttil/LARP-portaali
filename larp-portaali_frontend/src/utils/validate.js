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
    return "Salasanan on oltava 8-40 merkkiä pitkä."
  } else {
    return null
  };
};





export function isEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export function isPassword(pwd) {
  const re = /.{8,40}/
  return re.test(pwd);
};

export function isPhoneNumber(number) {
  const re = /^\+[0-9]{2,3} [0-9]{2} [0-9]{3} [0-9]{4}$/;
  return re.test(number);
};