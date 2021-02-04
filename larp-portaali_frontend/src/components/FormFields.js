import { Form } from 'react-bootstrap';

const TextField = ({ label, type, value, error, onChange, onBlur }) => {

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur} />
      {error && (
        <Form.Text className="text-danger">{error}</Form.Text>
      )}
    </Form.Group>
  )
};

export {
  TextField
}