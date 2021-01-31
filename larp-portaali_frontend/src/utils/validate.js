
export function isEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export function isPhoneNumber(number) {
  const re = /^\+[0-9]{2,3} [0-9]{2} [0-9]{3} [0-9]{4}$/;
  return re.test(number);
};