const $ = require("$"),
  { PluginCore } = require("../plugin");
//{ Http, Storage } = require("Next");
class AlipayApp {
  constructor() {}
  openUrl(url) {
    if ($.hasString(url)) {
      const aliUrl = `alipays://platformapi/startapp?saId=10000007&qrcode=${$text.URLEncode(url)}`;
      $console.info({
        aliUrl
      });
      $app.openURL(aliUrl);
    } else {
      $console.error({
        url,
        error: "has not string"
      });
    }
  }
}
class AlipayParse {
  constructor() {}
  getReg(regexp) {
    return new RegExp(regexp);
  }
  isPayQrcode(url) {
    return this.getReg(/https:\/\/qr\.alipay\.com\/[A-Za-z0-9]+/).test(
      url
    );
  }
}
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "alipay",
      name: "支付宝",
      icon: "command",
      future_tag: ["icon_name", "regexp", "only_regexp"]
    });
    this.REGEXP = [/https:\/\/qr\.alipay\.com\/[A-Za-z0-9]+/];
  }
  parse(text) {
    $console.info({
      alipay: text
    });
    const core = new AlipayParse();
    const app = new AlipayApp();
    return new Promise((resolve, reject) => {
      const link = $.getLinks(text)[0] || "";
      $console.info({
        link
      });
      switch (true) {
        case core.isPayQrcode(text):
          $console.info("isPayQrcode");
          app.openUrl(link);
          resolve();
          break;
        default:
        $console.info("alipay:default");
          reject();
      }
    });
  }
  run() {
    try {
      $console.info();
    } catch (error) {
      $console.error(error);
    }
    //$ui.success("run");
  }
  runWidget(widgetId) {
    $widget.setTimeline({
      render: ctx => {
        return {
          type: "text",
          props: {
            text: widgetId || "Hello!"
          }
        };
      }
    });
  }
  runApi({ apiId, data, callback }) {
    $console.info({
      apiId,
      data,
      callback
    });
    switch (apiId) {
      case "alipay.scanqrcode":
        break;
      default:
    }
  }
  runSqlite() {
    const sqlite_key = "last_run_timestamp",
      lastRunTimestamp = this.SQLITE.getItem(sqlite_key);

    this.SQLITE.setItem(sqlite_key, new Date().getTime().toString());
    $console.info({
      mod: this.MOD_INFO,
      lastRunTimestamp
    });
  }
}
module.exports = Example;
