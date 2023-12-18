const $ = require("$");
class ParseView {
  constructor(app) {
    this.PluginLoader = app.PluginLoader;
  }
  init(text, pluginItemList) {
    if ($.hasString(text) && $.hasArray(pluginItemList)) {
      $ui.push({
        props: {
          title: "解析结果"
        },
        views: [
          {
            type: "list",
            props: {
              data: pluginItemList.map(item => item.NAME)
            },
            layout: $layout.fill,
            events: {
              didSelect: (sender, indexPath, data) => {
                const { section, row } = indexPath;
                const pluginItem = pluginItemList[row];
                this.PluginLoader.runPlugin(pluginItem, text);
                $prefs.set("history.pluginname", pluginItem.NAME);
              }
            }
          }
        ]
      });
    } else {
      $ui.error("空白结果");
    }
  }
}
module.exports = ParseView;
