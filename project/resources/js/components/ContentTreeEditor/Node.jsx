import { React, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import { MoreOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const NodeContainer = styled.div.attrs({
  className: 'd-flex flex-row justify-content-between',
})``;

const StyledMoreOutlined = styled(MoreOutlined).attrs({
  className: 'btn',
})``;

const StyledDeleteOutlined = styled(DeleteOutlined)`
  padding-right: 5px;
`;

const StyledPlusOutlined = styled(PlusOutlined)`
  padding-right: 5px;
`;

const Title = styled.div.attrs({
  className: '',
})``;

const DropdownToggleContainer = styled.div.attrs({
  className: '',
})``;

function Node({ node, onAction }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const onToggle = (nextShown) => {
    setShowDropdown(nextShown);
  };

  return (
    <NodeContainer>
      <Title>
        {node.title}
      </Title>
      <Dropdown
        onToggle={onToggle}
        onSelect={(eventKey, event) => onAction(eventKey, node, event)}
      >

        <DropdownToggleContainer>
          <Dropdown.Toggle
            as={StyledMoreOutlined}
            id="dropdown-actions"
          />
        </DropdownToggleContainer>

        <Dropdown.Menu show={showDropdown} renderOnMount>
          <Dropdown.Item
            href="ADD"
            eventKey="ADD"
          >
            <StyledPlusOutlined />
            Добавить узел
          </Dropdown.Item>
          <Dropdown.Item
            href="DELETE"
            eventKey="DELETE"
          >
            <StyledDeleteOutlined />
            Удалить узел
          </Dropdown.Item>
        </Dropdown.Menu>

      </Dropdown>
    </NodeContainer>
  );
}

export default Node;
