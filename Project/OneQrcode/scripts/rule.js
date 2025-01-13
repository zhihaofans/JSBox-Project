const $ = require("$"),
  _Future = require("./future"),
  future = new _Future(),
  FT = future.TAG;
class RuleParse {
  constructor(app) {
    this.PluginLoader = app.PluginLoader;
  }
  hasRules() {
    /*
    $console.info({
      modLoader: this.PluginLoader != undefined,
      modList: this.ModLoader.getModList().id
    });*/
    return (
      this.PluginLoader != undefined &&
      $.hasArray(this.PluginLoader.getPluginList())
    );
  }
  getAllRules() {
    return this.PluginLoader.getPluginList();
  }
  runPlugin(pluginItem, text) {
    return new Promise((resolve, reject) => {
      if (pluginItem === undefined) {
        reject();
      } else {
        try {
          this.PluginLoader.runPlugin(pluginItem, text).then(resolve, reject);
        } catch (error) {
          $console.error(error);
          reject();
        }
      }
    });
  }
  parse(text, scanMode = false) {
    return new Promise((resolve, reject) => {
      try {
        const pluginList = this.getAllRules().filter(pluginItem => {
          const plugin = this.PluginLoader.getPlugin(pluginItem);
          // 筛选仅扫码插件
          if (pluginItem.hasFutureTag(FT.ONLY_SCAN) && scanMode !== true) {
            $console.info({
              plugin: pluginItem.ID,
              mode: "only_scan_fail"
            });
            return false;
          }
          if (pluginItem.canRegexp() && $.hasArray(plugin.REGEXP)) {
            $console.info({
              plugin: pluginItem.ID,
              mode: "reg"
            });
            var match = false;
            plugin.REGEXP.map(reg => {
              let isMatch = new RegExp(reg).test(text);
              $console.info({
                plugin: pluginItem.ID,
                text,
                reg,
                isMatch
              });
              if (isMatch) {
                match = true;
              }
            });
            return match;
          } else if ($.isLink(text)) {
            $console.info({
              plugin: pluginItem.ID,
              mode: "link"
            });
            return pluginItem.canLink();
          } else if ($.hasString(text)) {
            $console.info({
              plugin: pluginItem.ID,
              mode: "text"
            });
            return pluginItem.canText();
          } else {
            $console.info({
              plugin: pluginItem.ID,
              mode: "404"
            });
            return false;
          }
        });
        $console.info({
          pluginList
        });
        resolve(pluginList);
      } catch (error) {
        $console.error(error);
      } finally {
      }
    });
  }
  parseRules(text, pluginItemList) {
    return new Promise((resolve, reject) => {
      if ($.hasArray(pluginItemList)) {
      } else {
        reject();
      }
    });
  }
}
module.exports = RuleParse;
