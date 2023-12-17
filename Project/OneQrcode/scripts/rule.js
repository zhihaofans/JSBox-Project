const $ = require("$");
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
  parse(text) {
    return new Promise((resolve, reject) => {
      const pluginList = this.getAllRules().filter(pluginItem => {
        const plugin = this.PluginLoader.getPlugin(pluginItem);
        if (pluginItem.canRegexp() && $.hasArray(plugin.REGEXP)) {
          var match = false;
          plugin.REGEXP.map(reg => {
            if (new RegExp(reg).test(text)) {
              match = true;
            }
          });
          return match;
        } else if ($.isLink(text)) {
          return pluginItem.canLink();
        } else if ($.hasString(text)) {
          return pluginItem.canText();
        } else {
          return false;
        }
      });
      $console.info({
        pluginList
      });
      resolve(pluginList);
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
