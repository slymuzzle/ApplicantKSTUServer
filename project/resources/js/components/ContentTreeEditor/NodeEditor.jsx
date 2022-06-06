import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import { createReactEditorJS } from 'react-editor-js';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import Delimiter from '@editorjs/delimiter';
import AttachesTool from '@editorjs/attaches';
import ImageTool from '@editorjs/image';
import Carousel from '@editorjs/carousel';
import List from '@editorjs/list';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import Button from 'react-bootstrap/Button';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { getNodeContent, uploadFile } from '@components/ContentTreeEditor/api';

const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ['aligment'],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['aligment'],
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  delimiter: Delimiter,
  aligment: {
    class: AlignmentTuneTool,
    config: {
      default: 'left',
      blocks: {
        header: 'center',
        list: 'left',
      },
    },
  },
};

const uploadByFile = (controller, file) => uploadFile(controller, file).then((response) => {
  const { data } = response;
  return {
    success: true,
    file: { ...file, ...data.file },
  };
});

const ReactEditorJS = createReactEditorJS();

export default function NodeMdEditor({ controller, node = {}, onSave }) {
  const editorCore = useRef(null);
  const [undo, setUndo] = useState({});
  const [editorContent] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [tools] = useState(() => {
    const configuredTools = {
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file) {
              return uploadByFile(controller, file);
            },
          },
        },
        inlineToolbar: true,
      },
      carousel: {
        class: Carousel,
        config: {
          uploader: {
            uploadByFile(file) {
              return uploadByFile(controller, file);
            },
          },
        },
        inlineToolbar: true,
      },
      attaches: {
        class: AttachesTool,
        config: {
          uploader: {
            uploadByFile(file) {
              return uploadByFile(controller, file);
            },
          },
        },
        types: ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'],
      },
      inlineToolbar: true,
    };
    return { ...EDITOR_JS_TOOLS, ...configuredTools };
  });

  useEffect(() => {
    if (Object.keys(node).length === 0) {
      return;
    }

    editorCore.current._editorJS.isReady.then(() => {
      getNodeContent(controller, node.id).then((content) => {
        if (content !== null && content !== '') {
          const parsedContent = JSON.parse(content);
          if (parsedContent.blocks.length !== 0) {
            editorCore.current.render(JSON.parse(content));
          }
        } else {
          editorCore.current.clear();
        }
      });
    });

    undo.clear();
  }, [node]);

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleOnReady = useCallback(() => {
    const editor = editorCore.current._editorJS;
    setUndo(new Undo({ editor }));
    new DragDrop(editor);
  }, []);

  const handleFullScreen = useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    editorCore.current.clear();
  }, []);

  const handleSave = useCallback(() => {
    editorCore.current.save().then((savedContent) => {
      const newNode = {
        ...node,
        ...{ content: savedContent },
      };

      onSave(node, newNode);
    });
  }, [node]);

  const handleCancel = useCallback(() => {
    getNodeContent(controller, node.id).then((content) => {
      if (content !== null && content !== '') {
        editorCore.current.render(JSON.parse(content));
      } else {
        editorCore.current.clear();
      }
    });
  }, [node]);

  const handleOnKeyDown = useCallback((event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      event.stopPropagation();
      handleSave();
    }
  }, [node]);

  return (
    <div
      role="textbox"
      tabIndex={0}
      className={fullScreen ? 'editor-fullscreen' : 'editor-container'}
      onKeyDown={handleOnKeyDown}
    >
      <div className={['bg-light', 'px-4', 'py-3', 'd-flex', 'shadow-sm', 'rounded-top'].join(' ')}>
        <div className="flex-grow-1">
          <h6>Редактор контента</h6>
        </div>
        <Button
          bsPrefix="btn btn-default"
          onClick={handleFullScreen}
          active={false}
        >
          {fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
        </Button>
        <Button
          bsPrefix="btn btn-default"
          onClick={handleClear}
        >
          Очистить
        </Button>
        <Button
          bsPrefix="btn btn-default"
          onClick={handleCancel}
        >
          Отмена
        </Button>
        <Button
          bsPrefix="btn btn-default"
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>
      <ReactEditorJS
        value={editorContent}
        tools={tools}
        holder="editor"
        onInitialize={handleInitialize}
        onReady={handleOnReady}
        logLevel="ERROR"
      >
        <div
          className={['bg-white', 'shadow-sm', 'rounded-bottom', 'mb-3', 'px-4', 'py-4', 'flex-column'].join(' ')}
          style={fullScreen ? { height: '100%', maxHeight: '100%', overflow: 'auto' } : {}}
          id="editor"
        />
      </ReactEditorJS>
    </div>
  );
}
