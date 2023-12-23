const prefId = {
    EDITOR_FONT_SIZE: "editor.font.size",
    EDITOR_MODE: "editor.mode",
    DEFULIT_OPEN_EDITOR: "app.default_open_editor",
    DEFULIT_OPEN_FILE: "app.default_open_file"
  },
  editor = {
    getFontSize: () => $prefs.get(prefId.EDITOR_FONT_SIZE),
    setFontSize: fontSize => {
      $prefs.set(prefId.EDITOR_FONT_SIZE);
    },
    getMode: () => $prefs.get(prefId.EDITOR_MODE)
  },
  app = {
    defaultOpenEditor: () => $prefs.get(prefId.DEFULIT_OPEN_EDITOR),
    defaultOpenFile: () => $prefs.get(prefId.DEFULIT_OPEN_FILE)
  };
module.exports = {
  editor,
  app
};
