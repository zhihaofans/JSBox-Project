class PluginExample {
  constructor() {
    this.PLUGIN_INFO = {
      NAME: "分享",
      ID: "share",
      VERSION: 1
    };
  }
  run(data) {
    return new Promise((resolve, reject) => {
      const { text, datetime, timestamp } = data;
      $console.info(data);
      $share.sheet([text]);
      resolve();
    });
  }
}
module.exports = PluginExample;
