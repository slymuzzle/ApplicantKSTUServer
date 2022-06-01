import React from 'react';
import EditNodeForm from '@components/ContentTreeEditor/NodeForm/EditNodeForm';
import AddNodeForm from '@components/ContentTreeEditor/NodeForm/AddNodeForm';
import AddRootNodeForm from '@components/ContentTreeEditor/NodeForm/AddRootNodeForm';
import FormPlaceHolder from '@components/ContentTreeEditor/NodeForm/FormPlaceHolder';

export const formStates = {
  ADD_ROOT: 'ADD_ROOT',
  ADD: 'ADD',
  EDIT: 'EDIT',
  HIDE: 'HIDE',
};

function NodeForm({
  formState, node, onSave, onCreate, onCancel,
}) {
  let form;
  switch (formState) {
    case 'ADD_ROOT':
      form = <AddRootNodeForm onCreate={onCreate} onCancel={onCancel} />;
      break;

    case 'ADD':
      form = <AddNodeForm node={node} onCreate={onCreate} onCancel={onCancel} />;
      break;

    case 'EDIT':
      form = <EditNodeForm node={node} onSave={onSave} onCancel={onCancel} />;
      break;

    case 'HIDE':
      form = null;
      break;

    default:
      form = null;
      break;
  }

  return <>{Object.keys(node).length !== 0 || formState === 'ADD_ROOT' ? form : <FormPlaceHolder />}</>;
}

export default NodeForm;
