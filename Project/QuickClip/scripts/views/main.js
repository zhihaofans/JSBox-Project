const $ = require("$");
const util = require("./util"),
  COLOR = require("../color");
const Clip = require("../clip");
let clipList = [];
function askInput() {
  $input.text({
    type: $kbType.text,
    placeholder: "",
    text: $.paste() || "",
    handler: text => {
      if ($.hasString(text)) {
        const addResult = Clip.addText(text);
        if (addResult.error === true) {
          $ui.error("添加失败");
          $console.error(addResult);
        } else {
          $ui.success("添加成功");
          clipList = Clip.getClipList();
          $ui.get("clipList").data = clipList.map(item => {
            return {
              labelTime: {
                text: $.dateTime.timestampToTimeStr(item.create_time)
              },
              labelText: {
                text: item.text
              }
            };
          });
        }
      }
    }
  });
}
function getClipItemTemplate() {
  const viewTemplate = {
    //    layout: (make, view) => {
    //      make.top.equalTo(120);
    //    },
    props: {
      //bgcolor: COLOR.videoItemBgcolor
    },
    views: [
      {
        type: "label",
        props: {
          id: "labelTime",
          align: $align.left,
          font: $font(15),
          lines: 1,
          text: "2023-01-01 00:11:22",
          textColor: COLOR.navTextColor
        },
        layout: (make, view) => {
          make.top.equalTo(0);
          make.left.right.equalTo(5);
        }
      },
      {
        type: "label",
        props: {
          id: "labelText",
          align: $align.left,
          font: $font(20),
          lines: 1,
          text: "这里是剪切板文本",
          textColor: COLOR.navSelectedTextColor
        },
        layout: (make, view) => {
          make.left.right.equalTo(5);
          make.top.equalTo($ui.get("labelTime").bottom);
        }
      }
    ]
  };
  return viewTemplate;
}
function getClipView(pluginLoader) {
  clipList = Clip.getClipList();
  $console.info({
    getClipView: clipList
  });
  const didSelect = (index, data) => {
      $console.info(data);
      $.copy(clipList[index].text);
      $ui.success("Copied!");
    },
    viewData = {
      type: "list",
      props: {
        id: "clipList",
        autoRowHeight: true,
        style: 1,
        estimatedRowHeight: 90, //每行高度
        template: getClipItemTemplate(),
        data:
          clipList.length > 0
            ? clipList.map(item => {
                return {
                  labelTime: {
                    text: $.dateTime.timestampToTimeStr(item.create_time)
                  },
                  labelText: {
                    text: item.text
                  }
                };
              })
            : [],
        actions: [
          {
            title: "delete",
            color: $color("gray"), // default to gray
            handler: function (sender, indexPath) {
              const item = clipList[indexPath.row],
                removeResult = Clip.removeItem({
                  id: item.id
                });
              clipList = Clip.getClipList();
              $ui.get("clipList").data = clipList.map(item => {
                return {
                  labelTime: {
                    text: $.dateTime.timestampToTimeStr(item.create_time)
                  },
                  labelText: {
                    text: item.text
                  }
                };
              });
              removeResult.success === true
                ? $ui.success("删除成功")
                : $ui.error("删除失败");
            }
          },
          {
            title: "插件",
            handler: function (sender, indexPath) {
              pluginLoader.showList(clipList[indexPath.row]);
            }
          }
        ],
        header: {
          type: "label",
          props: {
            height: 20,
            text: `共${clipList.length}个文本`,
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        },
        footer: {
          type: "label",
          props: {
            height: 20,
            text: "温馨提示:向左滑动有个菜单",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        }
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, data) => didSelect(indexPath.row, data)
      }
    };
  return viewData;
}

function showView(app) {
  const navList = [
      {
        title: "剪切板",
        icon: "list.dash",
        selected: true,
        func: () => {
          askInput();
        }
      },
      {
        title: "插件",
        icon: "command",
        func: () => {}
      },
      {
        title: "设置",
        icon: "gear",
        func: () => {
          require("./config").showConfigView();
        }
      }
    ],
    navData = navList.map(item => {
      return {
        menu_image: {
          symbol: item.icon,
          tintColor: item.selected
            ? COLOR.navSelectedIconColor
            : COLOR.navIconColor
        },
        menu_label: {
          text: item.title,
          textColor: item.selected
            ? COLOR.navSelectedTextColor
            : COLOR.navTextColor
        }
      };
    }),
    ViewData = [
      getClipView(app.PluginLoader),
      {
        type: "matrix",
        props: {
          id: "tab",
          columns: 3,
          itemHeight: 50,
          spacing: 0,
          scrollEnabled: false,
          //bgcolor: $color("clear"),
          template: [
            {
              type: "view",
              props: {
                id: "view_item"
              },
              layout: function (make, view) {
                make.size.equalTo(view.super);
                make.center.equalTo(view.super);
              },
              views: [
                {
                  type: "image",
                  props: {
                    id: "menu_image",
                    resizable: true,
                    clipsToBounds: false
                  },
                  layout: function (make, view) {
                    make.centerX.equalTo(view.super);
                    make.size.equalTo($size(25, 25));
                    make.top.inset(6);
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "menu_label",
                    font: $font(10)
                  },
                  layout: function (make, view) {
                    var preView = view.prev;
                    make.centerX.equalTo(preView);
                    make.bottom.inset(5);
                  }
                }
              ]
            }
          ],
          data: navData
        },
        layout: (make, view) => {
          make.bottom.inset(0);
          if ($device.info.screen.width > 500) {
            make.width.equalTo(500);
          } else {
            make.left.right.equalTo(0);
          }
          make.centerX.equalTo(view.super);
          make.height.equalTo(50);
        },
        events: {
          didSelect(sender, indexPath, data) {
            const navItem = navList[indexPath.row];
            if (
              navItem.func !== undefined &&
              typeof navItem.func === "function"
            ) {
              try {
                navItem.func();
              } catch (error) {
                $console.error(error);
                //showErrorAlertAndExit(error.message);
              }
            } else {
              $console.info(indexPath.row);
            }
          }
        }
      }
    ];
  util.showView({
    props: {
      title: "小剪切板"
    },
    views: [
      {
        type: "view",
        layout: $layout.fillSafeArea,
        views: ViewData
      }
    ]
  });
}
function init(app) {
  try {
    $.startLoading();
    Clip.init();
    showView(app);
  } catch (error) {
    $console.error(error);
  } finally {
    $.stopLoading();
  }
}
module.exports = {
  init
};
