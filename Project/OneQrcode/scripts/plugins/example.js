const $ = require("$"),
  { PluginCore } = require("../plugin");
//{ Http, Storage } = require("Next");
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "example",
      name: "例子",
      icon: "command",
      future_tag: ["icon_name", "parse_link"]
    });
    this.REGEXP = [/https:\/\/qr\.alipay\.com\/[A-Za-z0-9]+/];
  }
  parse(text) {
    $console.info({
      example: text
    });
    return new Promise((resolve, reject) => {
      $app.openURL(text);
    });
  }
}
module.exports = Example;
