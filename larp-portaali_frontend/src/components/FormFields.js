import { Form } from 'react-bootstrap';

const TextField = ({ id, label, type, rows, value, error, onChange, onBlur }) => {
  if (type === "textarea") {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="textarea"
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}/>
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  } else {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}/>
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  }
};

const RadioField = ({ id, label, options, value, error, onChange, onClick, onValidation }) => {

  const optionButtons = Object.entries(options).map(( values, idx ) => {
    return (
    <Form.Check
      key={idx} 
      type="radio"
      id={id.concat("_",values[0])}
      value={values[0]}
      checked={value === values[0]}
      onChange={onChange}
      onClick={onClick}
      label={values[1]}
    />
  )});

  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
        {optionButtons}
      {error && (
        <Form.Text className="text-danger">{error}</Form.Text>
      )}
    </Form.Group>
  )
};


export {
  TextField,
  RadioField
}