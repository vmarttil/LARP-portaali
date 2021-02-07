import { Form, Row, Col } from 'react-bootstrap';

const TextField = ({ id, label, type, value, error, onChange, onBlur, keywords }) => {
  const asRow = keywords.filter( item => item.includes("horizontal"))[0]
  keywords = keywords.filter( item => !item.includes("horizontal"))

  if (asRow && asRow.length > 0) {
    console.log(asRow)
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    console.log(asRow)
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    console.log(asRow)
    return (
      <Form.Group controlId={id} as={Row} className="align-items-center">
        <Form.Label column sm={labelWidth}>{label}</Form.Label>
        <Col sm={inputWidth}>
          <Form.Control
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}/>
          {error && (
            <Form.Text className="text-danger">{error}</Form.Text>
          )}
        </Col>
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

const TextArea = ({ id, label, rows, value, error, onChange, onBlur, keywords }) => {
  const asRow = keywords.filter( item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))
  
  if (asRow && asRow.length > 0) {   
    console.log(asRow)
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    console.log(asRow)
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    console.log(asRow)
    return (
      <Form.Group controlId={id} as={Row}>
        <Form.Label column sm={labelWidth}>{label}</Form.Label>
        <Col sm={inputWidth}>
          <Form.Control
            as="textarea"
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur}/>
          {error && (
            <Form.Text className="text-danger">{error}</Form.Text>
          )}
        </Col> 
      </Form.Group>
    )
  } else {
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
  };
};

const RadioField = ({ id, label, options, value, error, onChange, onClick, onValidation, keywords }) => {

  const asRow = keywords.filter( item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  const optionButtons = Object.entries(options).map(( values, idx ) => {
    if (keywords.includes("inline")) {
      return (
        <Form.Check
          inline
          key={idx} 
          type="radio"
          id={id.concat("_",values[0])}
          value={values[0]}
          checked={value === values[0]}
          onChange={onChange}
          onClick={onClick}
          label={values[1]}
        />
      )
    } else {
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
        )
    }
  });

  if (asRow && asRow.length > 0) {
    console.log(asRow)
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    console.log(asRow)
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    console.log(asRow)
    return (
      <Form.Group controlId={id} as={Row} className="align-items-center">
        <Form.Label column sm={labelWidth}>{label}</Form.Label>
        <Col sm={inputWidth}>
          {optionButtons}
          {error && (
            <Form.Text className="text-danger">{error}</Form.Text>
          )}
        </Col>
      </Form.Group>
    )
  } else {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
          {optionButtons}
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  }
};


export {
  TextField,
  TextArea,
  RadioField
}