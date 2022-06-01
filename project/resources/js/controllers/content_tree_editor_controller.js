import ReactDOM from 'react-dom';
import React from 'react';
import ContentTreeEditor from '@components/ContentTreeEditor';

export default class extends window.Controller {
  static values = {
    tree: Array,
  };

  connect() {
    ReactDOM.render(
      <ContentTreeEditor controller={this} tree={this.treeValue} />,
      this.element,
    );
  }
}
