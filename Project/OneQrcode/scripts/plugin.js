const $ = require("$");
class PluginCore {
  constructor({ appKernel, id, name, icon, future_tag }) {
    this.App = appKernel;
    this.ID = id;
    this.NAME = name;
    this.ICON = icon;
    this.FUTURE_TAG = future_tag || [];
  }
}
class PluginItem {
  constructor(file_name, id, name, icon, future_tag, regexp) {
    this.FILE_NAME = file_name;
    this.ID = id;
    this.NAME = name;
    this.ICON = icon;
    this.FUTURE_TAG = future_tag || [];
  }
  hasFutureTag(tag) {
    return $.hasArray(this.FUTURE_TAG) && this.FUTURE_TAG.includes(tag);
  }
  canLink() {
    return this.hasFutureTag("parse_link");
  }
  canText() {
    return this.hasFutureTag("parse_text");
  }
  canRegexp() {
    return this.hasFutureTag("regexp");
  }
}
class PluginLoader {
  constructor(appKernel, plugin_dir) {
    this.App = appKernel;
    this.DIR = plugin_dir;
    this.PLUGIN_LIST = [];
  }
  loadPluginList() {
    this.PLUGIN_LIST = [];
    const fileList = $file
      .list(this.DIR)
      .filter(file => $.hasString(file) && file.endsWith(".js"));
    $console.info({
      fileList
    });
    if ($.hasArray(fileList)) {
      fileList.map(file => {
        try {
          const pluginFile = require(this.DIR + file),
            plugin = new pluginFile(this.App);
          if (plugin && plugin.ID && plugin.NAME && plugin.FUTURE_TAG) {
            this.PLUGIN_LIST.push(
              new PluginItem(
                file,
                plugin.ID,
                plugin.NAME,
                plugin.ICON,
                plugin.FUTURE_TAG
              )
            );
          }
        } catch (error) {
          $console.error(error);
        }
      });
    }
    $console.info({
      PLUGIN_LIST: this.PLUGIN_LIST
    });
  }
  getPlugin(pluginItem) {
    if (pluginItem !== undefined) {
      const pluginPath = this.DIR + pluginItem.FILE_NAME;
      if ($.file.isFileExist(pluginPath)) {
        const pluginFile = require(pluginPath);
        if (pluginFile !== undefined) {
          const plugin = new pluginFile(this.App);
          $console.info(plugin);
          return plugin;
        }
      }
    }
    return undefined;
  }
  getPluginList() {
    return this.PLUGIN_LIST;
  }
  runPlugin(pluginItem, text) {
    return new Promise((resolve, reject) => {
      try {
        this.getPlugin(pluginItem).parse(text).then(resolve, reject);
      } catch (error) {
        $console.error(error);
        reject();
      }
    });
  }
}
module.exports = { PluginCore, PluginLoader };
