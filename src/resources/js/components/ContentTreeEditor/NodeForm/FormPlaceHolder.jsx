import React from 'react';
import styled from 'styled-components';

const StyledFormPlaceHolder = styled.div.attrs({
  className: 'd-flex justify-content-center align-items-center text-muted',
})`
  height: 100%;
`;

function FormPlaceHolder() {
  return (
    <StyledFormPlaceHolder>
      <h4>Выберите узел</h4>
    </StyledFormPlaceHolder>
  );
}

export default FormPlaceHolder;
