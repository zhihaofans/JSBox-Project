const $ = require("$");
const util = require("./util"),
  COLOR = require("../color");
const Clip = require("../clip");
function askInput() {
  $input.text({
    type: $kbType.text,
    placeholder: "",
    text: $.paste() || "",
    handler: text => {
      if ($.hasString(text)) {
        Clip.addText(text);
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
function getClipView() {
  const clipList = Clip.getClipList(),
    didSelect = (index, data) => {
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
        data: clipList.map(item => {
          return {
            labelTime: {
              text: $.dateTime.timestampToTimeStr(item.create_time)
            },
            labelText: {
              text: item.text
            }
          };
        }),
        actions: [
          {
            title: "delete",
            color: $color("gray"), // default to gray
            handler: function (sender, indexPath) {
              $ui.get("clipList").data=clipList
            }
          },
          {
            title: "share",
            handler: function (sender, indexPath) {}
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

function showView() {
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
        title: "快捷短语",
        icon: "tag",
        func: () => {}
      },
      {
        title: "设置",
        icon: "gear",
        func: () => {}
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
      getClipView(),
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
function init() {
  showView();
}
module.exports = {
  init
};
