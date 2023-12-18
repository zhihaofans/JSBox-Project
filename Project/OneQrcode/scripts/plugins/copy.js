const $ = require("$"),
  { PluginCore } = require("../plugin");
//{ Http, Storage } = require("Next");
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "copy",
      name: "复制",
      icon: "command",
      future_tag: ["icon_name", "parse_link", "parse_text"]
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
