const $ = require("$"),
  { PluginCore } = require("../plugin");
//{ Http, Storage } = require("Next");
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "share",
      name: "分享",
      icon: "command",
      future_tag: ["icon_name", "parse_link", "parse_text"]
    });
  }
  parse(text) {
    return new Promise((resolve, reject) => {
      $share.sheet([text]);
    });
  }
}
module.exports = Example;
