import { Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../css/custom.css";


const TextQuestion = ({ question, value, onChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-0 mt-3" controlId={`question_${question.question_id}`}>
        <Col sm={3} className="pr-1">
          <Form.Label className="mt-1">{question.question_text}</Form.Label>
        </Col>
        <Col sm={9} className="pl-1">
        {onChange == null ? (
          <Form.Control
          size="sm"
          type="text"
          value={value}
          readOnly />
        ) : (  
          <Form.Control
            size="sm"
            type="text"
            value={value}
            onChange={onChange} />
        )}
        </Col>
      </Form.Group>
      <Row className="mb-3">
        <Col sm={3}></Col>
        <Col sm={8} className="ml-1 pl-0">
          <Form.Text className="text-muted">{question.description}</Form.Text>
        </Col>
      </Row>
    </>)
};

const IntegerQuestion = ({ question, value, onChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-0 mt-3" controlId={`question_${question.question_id}`}>
        <Col sm={3} className="pr-1">
          <Form.Label className="mt-1">{question.question_text}</Form.Label>
        </Col>
        <Col sm={2} className="pl-1">
        {onChange == null ? (
          <Form.Control
            size="sm"
            type="number"
            value={value}
            readOnly />
        ) : (
          <Form.Control
            size="sm"
            type="number"
            value={value}
            onChange={onChange} />
            )}
        </Col>
      </Form.Group>
      <Row className="mb-3">
        <Col sm={3}></Col>
        <Col sm={8} className="ml-1 pl-0">
          <Form.Text className="text-muted">{question.description}</Form.Text>
        </Col>
      </Row>
    </>)
};

const CheckQuestion = ({ question, value, onChange }) => {

  const optionButtons = question.options.map((option, idx) => {
    return (
      <Form.Check
        key={`${question.question_id}_${option.number}`}
        type={question.question_type}
        name={question.question_id}
        value={`${question.question_id}_${option.number}`}
        checked={question.question_type === "radio" ? value[question.question_id] == option.number : value[`${question.question_id}_${option.number}`]}
        onClick={onChange}
        onChange={e => {}}
        label={option.text}
      />
    )
  });

  const readOnlyButtons = question.options.map((option, idx) => {
    return (
      <Form.Check
        key={`${question.question_id}_${option.number}`}
        type={question.question_type}
        name={question.question_id}
        value={`${question.question_id}_${option.number}`}
        checked={question.question_type === "radio" ? value[question.question_id] == option.number : (value[`${question.question_id}_${option.number}`] ?? false )}
        label={option.text}
        readOnly
      />
    )
  });

  return (
    <Form.Group controlId={question.question_id}>
      <Row className="mt-4">
        <Col sm={12}>
          <Form.Label className="mb-0">{question.question_text}</Form.Label>
          <Form.Text className="text-muted mt-0 mb-1">{question.description}</Form.Text>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          {onChange == null ? readOnlyButtons : optionButtons}
        </Col>
      </Row>
    </Form.Group>
  )
};

const TextAreaQuestion = ({ question, value, onChange }) => {
  return (
    <Form.Group controlId={`question_${question.question_id}`} className="mt-3">
      <Row className="mt-4">
        <Col sm={12}>
          <Form.Label className="mb-0">{question.question_text}</Form.Label>
          <Form.Text className="text-muted mt-0 mb-1">{question.description}</Form.Text>
        </Col>
      </Row>
      <Row>
        <Col>
        {onChange == null ? (
          <Form.Control
            as="textarea"
            rows={6}
            value={value}
            readOnly />
        ) : (
          <Form.Control
            as="textarea"
            rows={6}
            value={value}
            onChange={onChange} />
            )}
        </Col>
      </Row>
    </Form.Group>
  )
};

export {
  TextQuestion,
  IntegerQuestion,
  CheckQuestion,
  TextAreaQuestion
}