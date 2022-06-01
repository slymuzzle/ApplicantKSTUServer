import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const StyledLayoutWrapper = styled.div.attrs({
  className: 'bg-white shadow-sm p-4 py-4d-flex flex-column',
})``;

const StyledHeader = styled.div.attrs({
  className: 'bg-light px-4 py-3 d-flex shadow-sm justify-content-between rounded-top',
})``;

const StyledFooter = styled.div.attrs({
  className: 'bg-light px-4 py-3 d-flex shadow-sm justify-content-between rounded-bottom',
})``;

function AddRootNodeForm({ onCreate, onCancel }) {
  const [nodeForm, setNodeForm] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onCreate(nodeForm, {}, event);
  };

  const onChange = (event) => {
    setNodeForm({
      ...nodeForm,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Form style={{ marginBottom: '14px' }} onSubmit={handleSubmit}>
      <StyledHeader>
        <h6>
          Добавить новый корневой узел
        </h6>
      </StyledHeader>
      <StyledLayoutWrapper>
        <Form.Group className="form-group">
          <Form.Label>
            Название узла
            {' '}
            <sup className="text-danger">*</sup>
          </Form.Label>
          <Form.Control
            name="title"
            type="text"
            placeholder="..."
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Описание</Form.Label>
          <Form.Control
            name="description"
            as="textarea"
            rows={4}
            placeholder="..."
            onChange={onChange}
          />
        </Form.Group>
      </StyledLayoutWrapper>
      <StyledFooter>
        <Button
          bsPrefix="btn btn-default"
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          bsPrefix="btn btn-default"
        >
          Добавить
        </Button>
      </StyledFooter>
    </Form>
  );
}

export default AddRootNodeForm;
