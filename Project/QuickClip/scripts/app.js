const $ = require("$"),
  Next = require("Next"),
  { AppKernel } = require("AppKernel");
class App extends AppKernel {
  constructor({ appId, appName, author }) {
    super({ appId, appName, author,debug:true });
  }
  init() {
    require("./views/main").init();
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
