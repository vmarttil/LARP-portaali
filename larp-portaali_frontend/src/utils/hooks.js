import { useState } from "react";

const useTextField = (id, label, type, maxlength, validator, initialValue, keywords) => {
  
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(null)

  const onChange = (event) => {
    if ( maxlength > 0 && event.target.value.length === maxlength) {
      setValue(event.target.value)
      setError(("Tekstin enimmäispituus on ").concat(maxlength, " merkkiä."))
    } else if (maxlength > 0 && event.target.value.length > maxlength) {
      setError(("Tekstin enimmäispituus on ").concat(maxlength, " merkkiä."))
    } else {
      setValue(event.target.value)
      setError("")
    }
  };

  const onBlur = validator ? (event) => {setError(validator(event.target.value))} : (event) => {}
  const validate = validator ? () => {
    setError(validator(value));
    return validator(value) === null ? true : false
  } : () => {}
  
  return {
    id,
    label,
    type,
    value,
    error,
    onChange,
    onBlur,
    validate,
    keywords
  }
};

const useTextArea = (id, label, maxlength, validator, initialValue, keywords, rows=1) => {
  
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(null)

  const onChange = (event) => {
    if ( maxlength > 0 && event.target.value.length === maxlength) {
      setValue(event.target.value)
      setError(("Tekstin enimmäispituus on ").concat(maxlength, " merkkiä."))
    } else if (maxlength > 0 && event.target.value.length > maxlength) {
      setError(("Tekstin enimmäispituus on ").concat(maxlength, " merkkiä."))
    } else {
      setValue(event.target.value)
      setError("")
    }
  };

  const onBlur = validator ? (event) => {setError(validator(event.target.value))} : (event) => {}
  const validate = validator ? () => {
    setError(validator(value));
    return validator(value) === null ? true : false
  } : () => {}
  
  return {
    id,
    label,
    rows,
    value,
    error,
    onChange,
    onBlur,
    validate,
    keywords
  }
};

const useRadioField = (id, label, required, options, initialSelection, keywords) => {
  const [value, setValue] = useState(initialSelection)
  const [error, setError] = useState("")

  const onChange = (event) => { 
    setValue(event.target.value)
    setError(false)
  };

  const onClick = (event) => {
    if (value === event.target.value && !required) {
      setValue(null)
    }
  }

  const validate = () => {
    required && !value ? setError("Valitse jokin vaihtoehto.") : setError("")
    return required && !value ? false : true
  }
  
  return {
    id,
    label,
    options,
    value,
    error,
    onChange,
    onClick,
    validate,
    keywords
  }
};

const useDateField = (id, label, minDate, maxDate, validator, initialValue, keywords) => {

  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState("")

  const onChange = (date) => { 
      setValue(date)
  };
  
  const validate = validator ? () => {
    setError(validator(value))
    return validator(value) === null ? true : false
  } : () => {}

  return {
    id,
    label,
    minDate,
    maxDate,
    value,
    error,
    onChange,
    validate,
    keywords
  }
};


export {
  useTextField,
  useTextArea,
  useRadioField,
  useDateField
}
