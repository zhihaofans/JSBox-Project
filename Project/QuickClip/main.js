try {
  require("./scripts/app").init();
} catch (error) {
  $console.error(error);
  if (error.line == 69) {
    const Next = require("Next");
    new Next.Storage.Keychain("zhihaofans.quickcilp.clip").set(
      "clip_list_data",
      ""
    );
  }
  $ui.alert({
    title: `Error Line${error.line - 1}`,
    message: error.message,
    actions: [
      {
        title: "Exit",
        handler: () => {
          $app.close();
        }
      }
    ]
  });
}
