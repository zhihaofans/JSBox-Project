const $ = require("$");
const viewUtil = require("./view_util");
class ParseCore {
  constructor(app) {
    this.App = app;
    this.RuleParse = app.RuleParse;
    this.PluginLoader = app.PluginLoader;
  }
  parse(text) {
    const parseView = require("./parse_view");
    $console.info(text);
    this.RuleParse.parse(text)
      .then(result => {
        $ui.success("解析成功");
        $console.info({
          result
        });
        new parseView(this.App).init(text, result);
      })
      .catch(result => {
        $console.error(result);
        $ui.error("解析失败");
      });
  }
}
class MainView {
  constructor(app) {
    this.App = app;
    this.Plugioader = app.PluginLoader;
    this.ParseCode = new ParseCore(this.App);
    this.QRCODE_TEXT =
      $prefs.get("history.qrcodetext") ||
      "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg";
  }
  scanQrcode() {
    const autoParse = $prefs.get("qrcode.scan.auto_parse") || false;
    $qrcode.scan(text => {
      $console.info(text);
      if ($.hasString(text)) {
        this.setQrcode(text);
        if (autoParse) {
          $ui.success("扫描成功");
          this.ParseCode.parse(text);
        } else {
          $input.text({
            type: $kbType.text,
            placeholder: "",
            text: text,
            handler: newText => {}
          });
        }
      } else {
        $ui.error("空白二维码");
      }
    });
  }
  setQrcode(text) {
    if ($.hasString(text)) {
      $prefs.set("history.qrcodetext", text);
      this.QRCODE_TEXT = text;
      $ui.get("image_qrcode").data = $qrcode.encode(this.QRCODE_TEXT).png;
    }
  }
  init() {
    const navList = [
        {
          title: "二维码",
          icon: "qrcode.viewfinder",
          selected: true,
          func: () => {
            this.scanQrcode();
          }
        },
        {
          title: "规则",
          icon: "list.dash",
          func: () => {
            if (this.App.RuleParse.hasRules()) {
              const ruleView = require("./rules_view");
              new ruleView(this.App).init();
            } else {
              $ui.error("找不到规则");
            }
          }
        },
        {
          title: "设置",
          icon: "gear",
          func: () => {
            $prefs.open(() => {
              // Done
            });
          }
        }
      ],
      mainViewData = {
        type: "list",
        props: {
          data: ["itemList"]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            const { section, row } = indexPath;
            $console.info(data);
          }
        }
      };
    viewUtil.showNavView({
      title: "OneQrcode",
      navList,
      mainViewData: this.getEditTextView()
    });
  }
  getEditTextView() {
    return {
      type: "view",
      props: {},
      layout: $layout.fill,
      events: {},
      views: [
        {
          type: "image",
          props: {
            id: "image_qrcode",
            data: $qrcode.encode(this.QRCODE_TEXT).png
          },
          layout: (make, view) => {
            make.top.equalTo(50);
            make.centerX.equalTo(view.super);

            make.size.equalTo($size(200, 200));
          },
          events: {
            tapped: sender => {
              $input.text({
                type: $kbType.text,
                placeholder: "",
                text: this.QRCODE_TEXT,
                handler: newText => {
                  if ($.hasString(newText)) {
                    this.setQrcode(newText);
                  }
                }
              });
            }
          }
        },
        {
          type: "button",
          props: {
            title: "解析内容"
          },
          layout: function (make, view) {
            make.centerX.equalTo(view.super);

            make.width.equalTo($ui.get("image_qrcode").width);
            make.top.equalTo($ui.get("image_qrcode").bottom).offset(50);
            make.height.equalTo(40);
          },
          events: {
            tapped: sender => {
              this.ParseCode.parse(this.QRCODE_TEXT);
            }
          }
        }
      ]
    };
  }
}
module.exports = MainView;
