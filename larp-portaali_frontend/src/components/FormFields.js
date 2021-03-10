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
            <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords} />
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
            <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords} />
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
        <TextFieldControl type={type} value={value} onChange={onChange} onBlur={onBlur} keywords={keywords} />
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
      <Row className="my-2">
        <Col sm={labelWidth} className="pr-1">
          <Form.Label className="mt-2">{label}</Form.Label>
        </Col>
        <Col sm={inputWidth} className="pl-1">
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
      <FormControl value={value} onChange={onChange} />
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

const SelectField = ({ id, label, options, value, error, onChange, validate, keywords, initialSelection }) => {

  const asRow = keywords.filter(item => item.includes("horizontal"))[0]
  keywords = keywords.filter(item => !item.includes("horizontal"))

  const optionItems = Object.entries(options).map((values, idx) => {
    return (
      <option key={idx} value={values[0]}>{values[1]}</option>
    )
  });

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
            <Form.Control
              as="select"
              onChange={onChange}
              value={value}>
              <option value="0">{initialSelection}</option>
              {optionItems}
            </Form.Control>
            {error && (
              <Form.Text className="text-danger">{error}</Form.Text>
            )}
          </Col>
        </>
      )
    } else {
      return (
        <Form.Group controlId={id} as={Row} className="align-items-center my-2">
          <Form.Label column sm={labelWidth} className="pr-1">{label}</Form.Label>
          <Col sm={inputWidth} className="pl-1">
            <Form.Control
              as="select"
              onChange={onChange}
              value={value}>
              <option value="0">Valitse...</option>
              {optionItems}
            </Form.Control>
            {error && (
              <Form.Text className="text-danger">{error}</Form.Text>
            )}
          </Col>
        </Form.Group>
      )
    }
  } else {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="select"
          onChange={onChange}
          placeholder="Valitse...">
          {optionItems}
        </Form.Control>
        {error && (
          <Form.Text className="text-danger">{error}</Form.Text>
        )}
      </Form.Group>
    )
  }
};


const DummyField = ({ id, type, text, description, options }) => {
  if (type === "text") {
    return (
      <Row className="my-1">
        <Col sm={3} className="pr-1">
          <Form.Label className="mt-2">{text}</Form.Label>
        </Col>
        <Col sm={9} className="pl-1">
          <Form.Control type="text" disabled className="bg-white" />
          <Form.Text className="text-muted">{description}</Form.Text>
        </Col>
      </Row>
    )
  } else if (type === "integer") {
    return (
      <>
        <Row className="mt-1 mb-0">
          <Col sm={3} className="pr-1">
            <Form.Label className="mt-2">{text}</Form.Label>
          </Col>
          <Col sm={2} className="pl-1">
            <Form.Control type="number" disabled className="bg-white" />
          </Col>
        </Row>
        <Row className="mt-0 mb-1">
          <Col sm={3} className="pr-1"></Col>
          <Col sm={9} className="pl-1">
            <Form.Text className="text-muted mt-0">{description}</Form.Text>
          </Col>
        </Row>
      </>
    )
  } else if (type === "textarea") {
    return (
      <>
        <Row>
          <Col sm={12}>
            <Form.Label className="mt-2 mb-0">{text}</Form.Label>
            <Form.Text className="text-muted mt-0 mb-1">{description}</Form.Text>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Control as="textarea" disabled className="bg-white" rows="4" />
          </Col>
        </Row>
      </>
    )
  } else if (type === "radio") {
    return (
      <>
        <Row>
          <Col sm={12}>
            <Form.Label className="mt-2 mb-0">{text}</Form.Label>
            <Form.Text className="text-muted mt-0 mb-1">{description}</Form.Text>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {options.map(option => {
              return (
                <Form.Check key={`${id}_${option.number}`} type="radio" id={`${id}_${option.number}`} className="ml-3" disabled>
                  <Form.Check.Input type="radio" disabled />
                  <Form.Check.Label className="text-dark">{option.text}</Form.Check.Label>
                </Form.Check>
              )
            })}
          </Col>
        </Row>
      </>
    )
  } else if (type === "checkbox") {
    return (
      <>
        <Row>
          <Col sm={12}>
            <Form.Label className="mt-2 mb-0">{text}</Form.Label>
            <Form.Text className="text-muted mt-0 mb-1">{description}</Form.Text>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {options.map(option => {
              return (
                <Form.Check key={`${id}_${option.number}`} type="checkbox" id={`${id}_${option.number}`} className="ml-3" disabled>
                  <Form.Check.Input type="checkbox" disabled />
                  <Form.Check.Label className="text-dark">{option.text}</Form.Check.Label>
                </Form.Check>
              )
            })}
          </Col>
        </Row>
      </>
    )
  } else {
    return (
      <>
        {text}
      </>
    )
  }
}

export {
  TextField,
  TextArea,
  RadioField,
  DateField,
  SelectField,
  DummyField
}