const $ = require("$"),
  { PluginCore } = require("../plugin"),
  _Future = require("../future"),
  future = new _Future(),
  FT = future.TAG;

//{ Http, Storage } = require("Next");
class WechatCore {
  constructor() {}
  openScanQrcode() {
    return new Promise((resolve, reject) => {
      $app.openURL("weixin://scanqrcode");
    });
  }
}
class Example extends PluginCore {
  constructor(appKernel) {
    super({
      appKernel,
      id: "wechat",
      name: "微信",
      icon: "command",
      future_tag: [FT.ICON_NAME, FT.REGEXP, FT.ONLY_REGEXP, FT.ONLY_SCAN]
    });
    this.REGEXP = [/https:\/\/u\.wechat\.com\/[A-Za-z0-9]+/];
    this.Wechat = new WechatCore();
  }
  parse(text) {
    $console.info({
      example: text
    });
    //    return new Promise((resolve, reject) => {
    //      //$app.openURL(text);
    //
    //    });
    return this.Wechat.openScanQrcode();
  }
}
module.exports = Example;
