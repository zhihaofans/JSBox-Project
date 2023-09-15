const $ = require("$"),
  Next = require("Next"),
  { AppKernel } = require("AppKernel"),
  PluginLoader = require("./plugin");
class App extends AppKernel {
  constructor({ appId, appName, author }) {
    super({ appId, appName, author, debug: true });
    this.PluginLoader = new PluginLoader();
  }
  init() {
    this.PluginLoader.loadPluginList();
    if ($.isKeyboardEnv()) {
      require("./views/keyboard").init();
    } else {
      require("./views/main").init(this);
    }
  }
}
function init() {
  new App({
    appId: "zhihaofans.quickcilp",
    appName: "小剪切板",
    author: "zhihaofans"
  }).init();
}
module.exports = {
  init
};
