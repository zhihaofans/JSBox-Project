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
      id: "copy",
      name: "复制",
      icon: "command",
      future_tag: [
        futureTag.ICON_NAME,
        futureTag.PARSE_LINK,
        futureTag.PARSE_TEXT
      ]
    });
    this.REGEXP = [/https:\/\/qr\.alipay\.com\/[A-Za-z0-9]+/];
  }
  parse(text) {
    return new Promise((resolve, reject) => {
      $clipboard.copy(text);
      $ui.success("复制成功");
    });
  }
}
module.exports = Example;
