class PluginExample {
  constructor() {
    this.PLUGIN_INFO = {
      NAME: "例子",
      ID: "example",
      VERSION: 1
    };
  }
  run(data) {
    return new Promise((resolve, reject) => {
      const { text, datetime, timestamp } = data;
      $console.info(data);
      $ui.alert({
        title: datetime || timestamp || "datatime",
        message: text,
        actions: [
          {
            title: "OK",
            disabled: false, // Optional
            handler: () => {
              resolve();
            }
          },
          {
            title: "Cancel",
            handler: () => {
              reject();
            }
          }
        ]
      });
    });
  }
}
module.exports = PluginExample;
