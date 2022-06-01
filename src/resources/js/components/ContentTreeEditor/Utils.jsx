export const loop = (data, key, callback) => {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loop(data[i].children, key, callback);
    }
  }
  return null;
};

export const drop = (info, data) => {
  const dropKey = info.node.id;
  const dragKey = info.dragNode.id;
  const dropPos = info.node.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  // Find dragObject
  let dragObj;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 // Has children
    && info.node.expanded // Is expanded
    && dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert
      item.children.unshift(dragObj);
      // item to the tail of the children
    });
  } else {
    let ar;
    let i;
    loop(data, dropKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }

  return data;
};
