const $ = require("$");
class Preview {
  constructor() {}
  markdown(text) {
    const mkView = {
      type: "markdown",
      props: {
        content: text || "# Hello, *World!*"
        // optional, custom style sheet
        //        style: `
        //        body {
        //          background: #f0f0f0;
        //        }
        //        `
      },
      layout: $layout.fill
    };
    $.showView({
      props: {
        title: "预览"
      },
      views: [
        {
          type: "view",
          props: {
            id: ""
          },
          layout: $layout.fill,
          events: {},
          views: [mkView]
        }
      ]
    });
  }
}
module.exports = Preview;
