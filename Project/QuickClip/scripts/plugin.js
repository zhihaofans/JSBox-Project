const $ = require("$");
class FileCore {
  constructor(dir) {
    this.DIR = dir;
    $console.info({
      FileCore: this.DIR
    });
  }
  getJSFileList() {
    const fileList = $file.list(this.DIR);
    if ($.hasArray(fileList)) {
      const jsList = fileList.filter((ele, idx) => {
        return (
          $file.isDirectory(this.DIR + ele) === false &&
          ele.endsWith(".js") >= 0
        );
      });
      $console.info(jsList);
      return jsList;
    } else {
      return [];
    }
  }
}
class PluginLoader {
  constructor() {
    this.PLUGIN_DIR = "/scripts/plugins/";
    this.PLUGIN_LIST = {};
    this.FileCore = new FileCore(this.PLUGIN_DIR);
  }
  loadPluginList() {
    const jsList = this.FileCore.getJSFileList();
    $console.info({
      jsList
    });
    jsList.map(js => {
      try {
        const jsfile = require(this.PLUGIN_DIR + js),
          plugin = new jsfile(),
          { NAME, ID, VERSION } = plugin.PLUGIN_INFO;
        if (
          $.hasString(NAME) &&
          $.hasString(ID) &&
          VERSION > 0 &&
          this.PLUGIN_LIST[ID] === undefined
        ) {
          this.PLUGIN_LIST[ID] = plugin;
          $console.info({
            message: "加载插件成功",
            NAME,
            ID,
            VERSION
          });
        } else {
          $console.error({ NAME, ID, VERSION, message: "加载插件失败" });
        }
      } catch (error) {
        $console.error("加载插件错误", js);
        $console.error(error);
      }
    });
  }
  run(id, data = { text: "", datetime: "time", timestamp: 0 }) {
    return new Promise((resolve, reject) => {
      const plugin = this.PLUGIN_LIST[id];
      if ($.hasString(id) && plugin !== undefined && $.isFunction(plugin.run)) {
        try {
          return plugin.run(data);
        } catch (error) {
          $console.error(error);
          reject(error);
        }
      } else {
        $console.error({
          id,
          data,
          plugin
        });
        reject({
          message: "id或插件不存在"
        });
      }
    });
  }
  showList(clipItem) {
    const data = {
        text: clipItem.text,
        timestamp: clipItem.create_time,
        datetime: $.dateTime.timestampToTimeStr(clipItem.create_time)
      },
      pluginIdList = Object.keys(this.PLUGIN_LIST),
      pluginList = pluginIdList.map(id => this.PLUGIN_LIST[id]);
    $ui.menu({
      items: pluginList.map(plugin => plugin.PLUGIN_INFO.NAME),
      handler: (title, idx) => {
        const id = pluginList[idx].PLUGIN_INFO.ID;
        this.run(id, data).then(
          result => {
            $console.info({
              _: "runPlugin",
              id,
              data
            });
          },
          fail => {
            $console.error({
              _: "runPlugin",
              id,
              data
            });
          }
        );
      }
    });
  }
}
module.exports = PluginLoader;
