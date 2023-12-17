const { AppKernel } = require("AppKernel"),
  { PluginLoader } = require("./plugin"),
  RuleParse = require("./rule"),
  $ = require("$");
class App extends AppKernel {
  constructor({ appId, l10nPath }) {
    super({ appId, l10nPath });
    this.PLUGIN_DIR = "/scripts/plugins/";
    this.PluginLoader = new PluginLoader(this, this.PLUGIN_DIR);
    this.RuleParse = new RuleParse(this);
  }
  init() {
    try {
      this.PluginLoader.loadPluginList()
      const mainView = require("./main_view");
      new mainView(this).init();
      $console.info(`has rules:${this.RuleParse.hasRules()}`);
      const matchLinkList = this.RuleParse.getLinkModList(
        "https://qr.alipay.com/fkx18195si0ykoduaxzfi4e"
      );
      $console.info(matchLinkList);
    } catch (error) {
      $console.error(error);
    } finally {
      $.info(`启动耗时${new Date().getTime() - this.START_TIME}ms`);
    }
  }
  initPluginList() {}
}
function run() {
  try {
    const app = new App({
      appId: "zhihaofans.one_qrcode",
      l10nPath: "/strings/l10n.js"
    });
    app.init();
  } catch (error) {
    $console.error(error);
    $ui.alert({
      title: "app.js throw",
      message: error.name + "\n" + error.message,
      actions: [
        {
          title: "OK",
          disabled: false, // Optional
          handler: () => {}
        }
      ]
    });
  }
}
module.exports = { run };
