class PluginExample {
  constructor() {
    this.PLUGIN_INFO = {
      NAME: "分词",
      ID: "fenci",
      VERSION: 1
    };
  }
  run(data) {
    return new Promise((resolve, reject) => {
      const { text, datetime, timestamp } = data;
      $text.tokenize({
        text,
        handler: function(results) {
      $console.info(results);
        }
      })
      
    });
  }
}
module.exports = PluginExample;
