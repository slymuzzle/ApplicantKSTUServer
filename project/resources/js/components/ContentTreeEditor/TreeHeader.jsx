import React from 'react';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

const StyledHeader = styled.div.attrs({
  className: 'bg-light px-4 py-3 d-flex shadow-sm justify-content-between rounded-top',
})``;

const StyledPlusOutlined = styled(PlusOutlined)`
  scale: 1.3;
  margin-top: 5px;
`;

function TreeHeader({ onAction }) {
  return (
    <StyledHeader>
      <h6>Дерево контента</h6>
      <StyledPlusOutlined onClick={(event) => onAction('ADD_ROOT', {}, event)} />
    </StyledHeader>
  );
}

export default TreeHeader;
