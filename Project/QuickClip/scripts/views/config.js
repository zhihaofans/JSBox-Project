const config = require("../config"),
  clipConfig = new config.Clip();
function showConfigView() {
  const listView = {
    type: "list",
    props: {
      data: [
        {
          title: "剪切板从新到旧",
          rows: [
            {
              type: "switch",
              layout: $layout.center,
              props: {
                on: clipConfig.getNewToOld() === true
              },
              events: {
                changed: sender => {
                  $console.info(sender.on);
                  const onResult = clipConfig.setNewToOld(sender.on);
                  $console.info(onResult);
                }
              }
            }
          ]
        },
        {
          title: "开发中",
          rows: [
            {
              type: "switch",
              props: {
                on: true,
                onColor: $color("#00EEEE"),
                thumbColor: $color("#EE00EE")
              },
              layout: $layout.center,
              events: {
                changed: sender => {
                  $console.info(sender.on);
                }
              }
            }
          ]
        }
      ]
    },
    layout: $layout.fill
  };
  $ui.push({
    props: {
      title: "设置"
    },
    views: [listView]
  });
}
module.exports = {
  showConfigView
};
