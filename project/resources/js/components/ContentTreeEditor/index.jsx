import React, { useState, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Tree as AntdTree } from 'antd';
import styled from 'styled-components';
import Node from '@components/ContentTreeEditor/Node';
import NodeForm, { formStates } from '@components/ContentTreeEditor/NodeForm';
import TreeHeader from '@components/ContentTreeEditor/TreeHeader';
import NodeMdEditor from '@components/ContentTreeEditor/NodeMdEditor';
import {
  createNode, saveNode, deleteNode, saveTree,
} from '@components/ContentTreeEditor/api';
import { loop, drop } from '@components/ContentTreeEditor/Utils';

const StyledTreeContainer = styled.div.attrs({
  className: 'bg-white shadow-sm rounded-bottom mb-3 px-4 pb-4 flex-column',
})``;

function ContentTreeEditor({ controller, tree }) {
  const [treeData, setTreeData] = useState(tree);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [formState, setFormState] = useState('');

  useEffect(() => {
    const flatMap = (e) => ([
      e.id,
      ...e.children.flatMap(flatMap), // recursive call
    ]);

    const data = treeData.flatMap(flatMap);
    setExpandedKeys(data);
  }, [tree]);

  const onSelect = (keys, event) => {
    const { tagName } = event.nativeEvent.target;
    const eventKey = event.nativeEvent.target.getAttribute('href');

    if (tagName === 'svg') {
      return;
    }

    const data = [...treeData];

    if (keys.length === 0 && tagName !== 'A') {
      setSelectedItem({});
      setSelectedKeys([]);
    } else {
      loop(data, keys[0], (item) => {
        switch (eventKey) {
          case 'ADD':
            setSelectedItem(item);
            setSelectedKeys([item.id]);
            setFormState(formStates.ADD);
            break;

          case 'DELETE':
            setFormState(formStates.HIDE);
            break;

          default:
            setSelectedItem(item);
            setSelectedKeys([item.id]);
            setFormState(formStates.EDIT);
            break;
        }
      });
    }
  };

  const onDrop = (changeInfo) => {
    const data = drop(changeInfo, [...treeData]);

    saveTree(controller, data).then(() => {
      setTreeData(data);
    });
  };

  const onAction = (eventKey, node) => {
    const data = [...treeData];

    switch (eventKey) {
      case 'ADD_ROOT':
        setSelectedItem({});
        setSelectedKeys([]);
        setFormState(formStates.ADD_ROOT);
        break;

      case 'ADD':
        loop(data, node.id, (item) => {
          setSelectedItem(item);
          setSelectedKeys([item.id]);
          setExpandedKeys((prevState) => [...prevState, item.id]);
          setFormState(formStates.ADD);
        });
        break;

      case 'DELETE':
        loop(data, node.id, (item) => {
          deleteNode(controller, item.id).then((response) => {
            setTreeData(response.data.tree);
            if (item.id === selectedItem.id) {
              setSelectedItem({});
              setSelectedKeys([]);
            }
          });
        });
        break;

      default:
        break;
    }
  };

  const onSave = (node, nodeForm) => {
    saveNode(controller, node, nodeForm).then((response) => {
      const { data } = response;
      setTreeData(data.tree);
    });
  };

  const onCreate = (nodeForm, parentNode = {}) => {
    createNode(controller, nodeForm, parentNode).then((response) => {
      const { data } = response;
      setTreeData(data.tree);
      setSelectedKeys([data.createdNode.id]);
      setSelectedItem(data.createdNode);
      setFormState(formStates.EDIT);
    });
  };

  const onCancel = () => {
    setSelectedItem({});
    setSelectedKeys([]);
    setFormState(formStates.HIDE);
  };

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
  };

  const MemoizedNode = useCallback(
    (nodeData) => (<Node node={nodeData} onAction={onAction} />),
    [treeData],
  );

  return (
    <Container style={{ padding: 0 }}>
      <Row>
        <Col>
          <TreeHeader onAction={onAction} />
          <StyledTreeContainer>
            <AntdTree
              rootStyle={{
                overflow: 'auto',
                maxHeight: '500px',
                minHeight: '250px',
                scrollBehavior: 'smooth',
              }}
              treeData={treeData}
              titleRender={MemoizedNode}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              fieldNames={{ key: 'id' }}
              showLine={{ showLeafIcon: false }}
              draggable={{ icon: false }}
              onDrop={onDrop}
              onSelect={onSelect}
              onExpand={onExpand}
              motion={false}
              blockNode
            />
          </StyledTreeContainer>
        </Col>
        <Col>
          <NodeForm
            formState={formState}
            node={selectedItem}
            onCreate={onCreate}
            onSave={onSave}
            onCancel={onCancel}
          />
        </Col>
      </Row>
      <Row>
        <Col style={{ visibility: Object.keys(selectedItem).length === 0 ? 'hidden' : 'visible' }}>
          <NodeMdEditor
            controller={controller}
            node={selectedItem}
            onSave={onSave}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ContentTreeEditor;
