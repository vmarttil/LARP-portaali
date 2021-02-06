import { useState } from "react";

const useTextField = (id, label, type, maxlength, validator, initialValue, rows=1) => {
  
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
  
  return {
    id,
    label,
    type,
    rows,
    value,
    error,
    onChange,
    onBlur
  }
};

const useRadioField = (id, label, required, options, initialSelection) => {
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

  const onValidation = () => { required && !value ? setError("Valitse jokin vaihtoehto.") : setError("")}
  
  return {
    id,
    label,
    options,
    value,
    error,
    onChange,
    onClick,
    onValidation
  }
};

export {
  useTextField,
  useRadioField
}
