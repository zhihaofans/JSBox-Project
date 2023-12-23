const $ = require("$"),
  prefs = require("./prefs"),
  editView = require("./view_edit");
class App {
  constructor() {}
  openConfigView() {
    $prefs.open(() => {
      // Done
      $console.info("Done");
      const fontSize = prefs.editor.getFontSize() || 12;
      if (fontSize < 1 || fontSize > 60) {
        prefs.editor.setFontSize(12);
        $ui.alert({
          title: "字体大小超出范围",
          message: "已调至12",
          actions: [
            {
              title: "OK",
              disabled: false, // Optional
              handler: () => {}
            }
          ]
        });
      }
    });
  }
  initView() {
    $.showView({
      props: {
        title: "listview"
      },
      views: [
        {
          type: "list",
          props: {
            data: ["设置", "开始使用"]
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              const { section, row } = indexPath;
              switch (row) {
                case 0:
                  this.openConfigView();
                  break;
                case 1:
                  new editView().init();
                  break;
                default:
              }
            }
          }
        }
      ]
    });
  }
  init() {
    $app.autoKeyboardEnabled = true;
    if (prefs.app.defaultOpenEditor()) {
      new editView().init();
    } else {
      this.initView();
    }
  }
}

module.exports = App;
