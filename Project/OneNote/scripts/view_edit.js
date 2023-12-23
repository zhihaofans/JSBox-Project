const $ = require("$"),
  prefs = require("./prefs"),
  previewView = require("./view_preview");
class TextEdit {
  constructor() {
    this.IS_INIT = false;
    this.FILE_NAME = "file.txt";
    this.PreviewView = new previewView();
  }
  init() {
    if (prefs.app.defaultOpenFile() === true) {
      this.openFile();
    } else {
      this.initView();
    }
  }
  reloadData(text) {
    $ui.get("editor_text").text = text;
    this.reloadTextLength(text.length);
  }
  reloadTextLength(length) {
    $ui.title = `共${length || 0}个字符`;
  }
  openFile() {
    $drive.open({
      types: ["public.plain-text"],
      handler: data => {
        if (data) {
          $console.info(data);
          this.FILE_NAME = data.fileName;
          if (this.IS_INIT) {
            this.reloadData(data.string);
          } else {
            this.initView(data.string);
          }
        } else {
          $ui.warning("取消打开");
        }
      }
    });
  }
  saveFile(text) {
    return new Promise((resolve, reject) => {
      try {
        $drive.save({
          data: $data({ string: text }),
          name: this.FILE_NAME || "File.txt",
          handler: filePath => {
            $console.info({
              filePath
            });
            resolve(filePath);
          }
        });
      } catch (error) {
        $console.error(error);
        reject();
      }
    });
  }
  showEditorMenu() {
    $ui.menu({
      items: ["设置", "打开文件", "保存", "预览"],
      handler: (title, idx) => {
        switch (idx) {
          case 0:
            $prefs.open();
            break;
          case 1:
            this.openFile();
            break;
          case 2:
            this.saveFile($ui.get("editor_text").text)
              .then(filePath => {
                $.hasString(filePath)
                  ? $ui.success("保存成功")
                  : $ui.error("未保存");
              })
              .catch(() => {
                $ui.error("保存失败");
              });
            break;
          case 3:
            this.preview();
            break;
          default:
        }
      }
    });
  }
  initView(textData) {
    $.showView({
      props: {
        title: ""
      },
      views: [
        {
          type: "view",
          props: {
            id: ""
          },
          layout: $layout.fill,
          events: {},
          views: [
            {
              type: "text",
              props: {
                id: "editor_text",
                font: $font(prefs.editor.getFontSize()),
                text:
                  textData ||
                  "你好，这是个文本编辑器，双指点击编辑器可以打开设置"
              },
              layout: $layout.fill,
              events: {
                ready: sender => {
                  this.reloadTextLength(sender.text.length);
                  $ui.get("editor_text").whenTouched({
                    touches: 2,
                    taps: 1,
                    handler: () => {
                      this.showEditorMenu();
                    }
                  });
                  this.IS_INIT = true;
                },
                didChange: sender => {
                  this.reloadTextLength(sender.text.length);
                }
              }
            }
          ]
        }
      ]
    });
  }
  preview() {
    if (this.FILE_NAME.endsWith(".md")) {
      this.PreviewView.markdown($ui.get("editor_text").text);
    } else {
      $ui.error("不支持该格式");
    }
  }
}
class EditView {
  constructor() {
    this.MODE = prefs.editor.getMode();
  }
  init() {
    $console.info(this.MODE);
    switch (this.MODE) {
      case 0:
        new TextEdit().init();
        break;
      default:
        $ui.error("当前版本仅支持纯文本模式");
    }
  }
}
module.exports = EditView;
