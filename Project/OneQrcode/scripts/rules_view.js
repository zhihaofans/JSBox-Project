const $ = require("$");
class RulesView {
  constructor(app) {
    this.App = app;
    this.ModLoader = app.ModLoader;
    this.RuleParse = this.App.RuleParse;
  }
  init() {
    const ruleGroupList = this.RuleParse.getAllRules().map(rule => {
      return {
        title: rule.NAME,
        rows: [
          `id:${rule.ID}`,
          `文件名:${rule.FILE_NAME}`,
          `支持链接:${$.booleanToText(rule.canLink(), "是", "否")}`,
          `支持文本:${$.booleanToText(rule.canText(), "是", "否")}`,
          `内置规则:${$.booleanToText(rule.hasFutureTag("regexp"), "是", "否")}`
        ]
      };
    });
    $console.info(ruleGroupList);
    $ui.push({
      props: {
        title: "规则"
      },
      views: [
        {
          type: "list",
          props: {
            data: ruleGroupList
          },
          layout: $layout.fill,
          events: {
            didSelect: (sender, indexPath, data) => {
              const { section, row } = indexPath;
            }
          }
        }
      ]
    });
  }
}
module.exports = RulesView;
