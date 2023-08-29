function getGridData({
  itemList,
  title,
  columns,
  callback = (idx, data) => {},
  itemHeight,
  spacing,
  itemColor
}) {
  const viewData = {
    type: "matrix",
    props: {
      id: "tab",
      columns: columns || 3,
      itemHeight: itemHeight || 90,
      spacing: spacing || 5,
      scrollEnabled: false,
      template: [
        {
          type: "view",
          layout: (make, view) => {
            make.size.equalTo(view.super);
            make.center.equalTo(view.super);
          },
          views: [
            {
              type: "image",
              props: {
                id: "menu_image",
                resizable: true,
                clipsToBounds: false
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.size.equalTo($size(50, 50));
                make.top.inset(6);
              }
            },
            {
              type: "label",
              props: {
                id: "menu_label",
                font: $font(10)
              },
              layout: (make, view) => {
                var preView = view.prev;
                make.centerX.equalTo(preView);
                make.bottom.inset(5);
              }
            }
          ]
        }
      ],
      data: itemList.map(item => {
        return {
          menu_image: {
            symbol: item.icon,
            tintColor: itemColor || $color("gray")
          },
          menu_label: {
            text: item.title,
            textColor: itemColor || $color("gray")
          }
        };
      })
    },
    layout: $layout.fill,
    events: {
      didSelect(sender, indexPath, data) {
        callback ? callback(indexPath.row, data) : undefined;
      }
    }
  };
  return viewData;
}
function showGrid3({ itemList, title, callback = (idx, data) => {} }) {
  /*itemList=[{
    title:"title",icon:"symbol"
  }]*/
  const viewData = getGridData({
    itemList,
    callback
  });
  showView({
    props: {
      title
    },
    views: [viewData]
  });
}
function showView(viewData) {
  $ui.window === undefined ? $ui.render(viewData) : $ui.push(viewData);
}
module.exports = {
  showGrid3,
  showView
};
