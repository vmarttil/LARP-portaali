import { useState } from "react";

const useField = (label, type, validator) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onBlur = (event) => {
    setError(validator(event.target.value))
  }

  return {
    label,
    type,
    value,
    error,
    onChange,
    onBlur
  }
}

export default useField