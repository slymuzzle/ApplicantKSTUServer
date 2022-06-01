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

function EditNodeForm({ node, onSave, onCancel }) {
  const [nodeForm, setNodeForm] = useState({
    title: node.title,
    description: node.description,
  });

  React.useEffect(() => {
    setNodeForm({
      title: node.title,
      description: node.description,
    });
  }, [node]);

  const onChange = (event) => {
    setNodeForm({
      ...nodeForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onSave(node, nodeForm, event);
  };

  return (
    <Form onSubmit={handleSubmit} style={{ marginBottom: '14px' }}>
      <StyledHeader>
        <h6>{`Изменить узел ${node.title}`}</h6>
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
            value={nodeForm.title || ''}
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
            value={nodeForm.description || ''}
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
          Сохранить
        </Button>
      </StyledFooter>
    </Form>
  );
}

export default EditNodeForm;
