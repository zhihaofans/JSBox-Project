const $ = require("$"),
  { PluginCore } = require("../plugin"),
  _Future = require("../future"),
  future = new _Future(),
  futureTag = future.TAG;
//{ Http, Storage } = require("Next");
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "example",
      name: "例子",
      icon: "command",
      future_tag: [futureTag.ICON_NAME, futureTag.PARSE_LINK]
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
