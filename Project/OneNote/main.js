try {
  const App = require("./scripts/app");
  new App().init();
} catch (error) {
  $console.error(error);
  $ui.alert({
    title: "Error",
    message: error.message,
    actions: [
      {
        title: "Exit",
        disabled: false, // Optional
        handler: () => $app.close()
      }
    ]
  });
} finally {
  $console.info("App.init finally");
}
