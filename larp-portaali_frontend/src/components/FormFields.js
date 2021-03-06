import { Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import { Calendar } from 'react-bootstrap-icons';
import "react-datepicker/dist/react-datepicker.css";
import "../css/custom.css";

const TextField = ({ id, label, type, value, error, onChange, onBlur, validate, keywords }) => {
  const asRow = keywords.filter(item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  if (asRow && asRow.length > 0) {
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    if (keywords.includes("partialRow")) {
      return (
        <>
          <Col sm={labelWidth} className="pr-1">
            <Form.Label className="mt-2">{label}</Form.Label>
          </Col>
          <Col sm={inputWidth} className="pl-1">
            <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords}/>
            {error && (
              <Form.Text className="text-danger">{error}</Form.Text>
            )}
          </Col>
        </>
      )
    } else {
      return (
        <Row className="my-2">
          <Col sm={labelWidth} className="pr-1">
            <Form.Label className="mt-2">{label}</Form.Label>
          </Col>
          <Col sm={inputWidth} className="pl-1">
          <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords}/>
          {error && (
            <Form.Text className="text-danger">{error}</Form.Text>
          )}
          </Col>
        </Row>
      )
    }
  } else {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
        <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords}/>
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  }
};

const TextFieldControl = ({ type, value, onChange, onBlur, keywords }) => {
  if (type === "number" && keywords.includes("currency")) {
    return (
        <InputGroup>
          <Form.Control
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur} />
          <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
    )
  } else {
    return (
        <Form.Control
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur} />
    )
  }
}


const TextArea = ({ id, label, rows, value, error, onChange, onBlur, validate, keywords }) => {
  const asRow = keywords.filter(item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  if (asRow && asRow.length > 0) {
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    return (
      <Row>
        <Col sm={labelWidth}>
          <Form.Label>{label}</Form.Label>
        </Col>
        <Col sm={inputWidth}>
          <Form.Control
            as="textarea"
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur} />
          {error && (
            <Form.Text className="text-danger">{error}</Form.Text>
          )}
        </Col>
      </Row>
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
          onBlur={onBlur} />
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  };
};


const RadioField = ({ id, label, options, value, error, onChange, onClick, validate, keywords }) => {

  const asRow = keywords.filter(item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  const optionButtons = Object.entries(options).map((values, idx) => {
    if (keywords.includes("inline")) {
      return (
        <Form.Check
          inline
          key={idx}
          type="radio"
          id={id.concat("_", values[0])}
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
          id={id.concat("_", values[0])}
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
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
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


const CustomDateInput = ({ value, onClick, onChange }) => {
  return (
    <InputGroup onClick={onClick}>
      <FormControl value={value} onChange={onChange}/>
      <InputGroup.Append>
        <InputGroup.Text><Calendar /></InputGroup.Text>
      </InputGroup.Append>
    </InputGroup>
  )
}

const DateField = ({ id, label, minDate, updateMinDate, maxDate, updateMaxDate, value, onChange, validate, keywords }) => {

  const asRow = keywords.filter(item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  if (asRow && asRow.length > 0) {
    const labelWidth = parseInt(asRow.split("_")[1].split("-")[0])
    const inputWidth = parseInt(asRow.split("_")[1].split("-")[1])
    if (keywords.includes("partialRow")) {
      return (
        <>
          <Col sm={labelWidth} className="pr-1">
            <Form.Label className="mt-2">{label}</Form.Label>
          </Col>
          <Col sm={inputWidth} className="pl-1">
            <div className="customDatePickerWidth">
              <DatePicker
                className="form-control"
                selected={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd.MM.yyyy"
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={70}
                scrollableYearDropdown
                scrollableMonthDropdown
                customInput={<CustomDateInput onChange={onChange} />}
              />
            </div>
          </Col>
        </>
      )
    } else {
      return (
        <Row className="my-2">
          <Col sm={labelWidth} className="pr-1">
            <Form.Label className="mt-2">{label}</Form.Label>
          </Col>
          <Col sm={inputWidth} className="pl-1">
            <div className="customDatePickerWidth">
              <DatePicker
                className="form-control"
                selected={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd.MM.yyyy"
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={70}
                scrollableYearDropdown
                scrollableMonthDropdown
                customInput={<CustomDateInput />}
              />
            </div>
          </Col>
        </Row>
      )
    }
  } else {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
        <div className="customDatePickerWidth">
          <DatePicker
            className="form-control"
            selected={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="dd.MM.yyyy"
            showYearDropdown
            showMonthDropdown
            yearDropdownItemNumber={70}
            scrollableYearDropdown
            scrollableMonthDropdown
            customInput={<CustomDateInput />}
          />
        </div>
      </Form.Group>
    )
  }
};

export {
  TextField,
  TextArea,
  RadioField,
  DateField
}