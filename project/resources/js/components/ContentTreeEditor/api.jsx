export const saveTree = (controller, data) => {
  const promise = window.axios.post(controller.prefix('/content_tree_editor/saveTree'), data)
    .then((response) => {
      controller.alert(
        'Дерево перестроено',
        `Статус: ${response.status} ${response.statusText}`,
        'success',
      );

      return response;
    }).catch((error) => {
      controller.alert(
        'Ошибка',
        `${error}`,
        'error',
      );

      throw error;
    });

  return promise;
};

export const createNode = (controller, nodeForm, parentNode = {}) => {
  const promise = window.axios.post(
    controller.prefix('/content_tree_editor/createNode'),
    {
      nodeForm,
      parentNode,
    },
  ).then((response) => {
    controller.alert(
      'Узел создан',
      `Статус: ${response.status} ${response.statusText}`,
      'success',
    );

    return response;
  }).catch((error) => {
    controller.alert(
      'Ошибка',
      `${error}`,
      'warning',
    );

    throw error;
  });

  return promise;
};

export const saveNode = (controller, node, nodeForm) => {
  const promise = window.axios.post(
    controller.prefix('/content_tree_editor/saveNode'),
    {
      node,
      nodeForm,
    },
  ).then((response) => {
    controller.alert(
      'Узел обновлен',
      `Статус: ${response.status} ${response.statusText}`,
      'success',
    );

    return response;
  }).catch((error) => {
    controller.alert(
      'Ошибка',
      `${error}`,
      'warning',
    );

    throw error;
  });

  return promise;
};

export const deleteNode = (controller, nodeId) => {
  const promise = window.axios.post(
    controller.prefix('/content_tree_editor/deleteNode'),
    {
      nodeId,
    },
  ).then((response) => {
    controller.alert(
      'Узел удален',
      `Статус: ${response.status} ${response.statusText}`,
      'success',
    );

    return response;
  }).catch((error) => {
    controller.alert(
      'Ошибка',
      `${error}`,
      'warning',
    );

    throw error;
  });

  return promise;
};

export const getNodeContent = (controller, nodeId) => {
  const promise = window.axios.post(
    controller.prefix('/content_tree_editor/getNodeContent'),
    {
      nodeId,
    },
  ).then((response) => {
    const { content } = response.data;
    return content;
  }).catch((error) => {
    throw error;
  });

  return promise;
};

export const uploadFile = (controller, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const promise = window.axios.post(
    controller.prefix('/content_tree_editor/uploadFile'),
    formData,
    config,
  ).then((response) => {
    controller.alert(
      'Файл загружен',
      `Статус: ${response.status} ${response.statusText}`,
      'success',
    );

    return response;
  }).catch((error) => {
    controller.alert(
      'Ошибка',
      `${error}`,
      'warning',
    );

    throw error;
  });

  return promise;
};
