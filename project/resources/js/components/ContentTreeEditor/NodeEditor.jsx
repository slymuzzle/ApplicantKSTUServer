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
import Spinner from 'react-bootstrap/Spinner';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { getNodeContent, uploadFile } from '@components/ContentTreeEditor/api';

const i18n = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': 'Нажмите, чтобы настроить',
          'or drag to move': 'или перетащите',
        },
      },
      inlineToolbar: {
        converter: {
          'Convert to': 'Конвертировать в',
        },
      },
      toolbar: {
        toolbox: {
          Add: 'Добавить',
        },
      },
    },
    toolNames: {
      Text: 'Параграф',
      Heading: 'Заголовок',
      List: 'Список',
      Quote: 'Цитата',
      Delimiter: 'Разделитель',
      Link: 'Ссылка',
      Bold: 'Полужирный',
      Italic: 'Курсив',
      Image: 'Изображение',
      Carousel: 'Коллаж',
      Attaches: 'PDF',
    },
    tools: {
      warning: {
        Title: 'Название',
        Message: 'Сообщение',
      },
      link: {
        'Add a link': 'Вставьте ссылку',
      },
      stub: {
        'The block can not be displayed correctly.': 'Блок не может быть отображен',
      },
      image: {
        'Stretch image': 'Растянуть изображение',
        'With border': 'C рамкой',
        'With background': 'C фоном',
      },
      list: {
        Ordered: 'Упорядоченный',
        Unordered: ' Неупорядоченный',
      },
    },
    blockTunes: {
      delete: {
        Delete: 'Удалить',
      },
      moveUp: {
        'Move up': 'Переместить вверх',
      },
      moveDown: {
        'Move down': 'Переместить вниз',
      },
    },
  },
};

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
  const editorContainer = useRef(null);
  const editorCore = useRef(null);
  const [loading, setLoading] = useState(false);
  const [undo, setUndo] = useState(null);
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
          buttonText: 'Выбрать PDF файл для загрузки',
        },
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
      setLoading(true);
      getNodeContent(controller, node.id).then((content) => {
        undo.clear();
        if (content !== null && content !== '') {
          const parsedContent = JSON.parse(content);
          if (parsedContent.blocks !== 0) {
            editorCore.current.render(parsedContent);
            undo.initialize(parsedContent);
          }
        } else {
          editorCore.current.clear();
        }
        setLoading(false);
        editorContainer.current.scrollTo(0, 0);
      });
    });
  }, [node]);

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleReady = useCallback(() => {
    const editor = editorCore.current._editorJS;
    const config = {
      debounceTimer: 100,
    };
    setUndo(new Undo({ editor, config }));
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
    setLoading(true);
    getNodeContent(controller, node.id).then((content) => {
      undo.clear();
      if (content !== null && content !== '') {
        const parsedContent = JSON.parse(content);
        if (parsedContent.blocks !== 0) {
          editorCore.current.render(parsedContent);
          undo.initialize(parsedContent);
        }
      } else {
        editorCore.current.clear();
      }
      setLoading(false);
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
      <div className="bg-light px-4 py-3 d-flex shadow-sm rounded-top">
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
        tools={tools}
        i18n={i18n}
        holder="editor"
        onInitialize={handleInitialize}
        onReady={handleReady}
        logLevel="ERROR"
      >
        <div
          ref={editorContainer}
          className="bg-white shadow-sm rounded-bottom mb-3 px-4 py-4 flex-column"
          style={
            fullScreen
              ? {
                height: '100%',
                maxHeight: '100%',
                overflow: 'auto',
                display: loading ? 'none' : 'flex',
              }
              : {
                maxHeight: '1000px',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                display: loading ? 'none' : 'flex',
              }
         }
          id="editor"
        />
      </ReactEditorJS>
      {loading && (
      <div
        className="bg-white shadow-sm rounded-bottom mb-3 px-4 py-4 flex-column"
        style={fullScreen ? { height: '100%', overflow: 'hidden' } : { minHeight: '1000px', overflow: 'hidden' }}
      >
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      </div>
      )}
    </div>
  );
}
