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
      id: "share",
      name: "分享",
      icon: "command",
      future_tag: [
        futureTag.ICON_NAME,
        futureTag.PARSE_LINK,
        futureTag.PARSE_TEXT
      ]
    });
  }
  parse(text) {
    return new Promise((resolve, reject) => {
      $share.sheet([text]);
    });
  }
}
module.exports = Example;
