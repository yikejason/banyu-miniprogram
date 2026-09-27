export default {
  pages: [
    "pages/cover/index",
    "pages/planet/index",
    "pages/emotions/index",
    "pages/journal/index",
    "pages/share/index",
    "pages/journal-edit/index",
    "pages/share-new/index",
    "pages/share-view/index",
    "pages/mood/index",
  ],
  window: {
    backgroundTextStyle: "dark",
    navigationBarBackgroundColor: "#0d0a16",
    navigationBarTitleText: "伴语星球",
    navigationBarTextStyle: "white",
    backgroundColor: "#0d0a16",
  },
  tabBar: {
    color: "#948f99",
    selectedColor: "#cbbdff",
    backgroundColor: "#141318",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/planet/index",
        text: "星球",
        iconPath: "assets/tab/planet.png",
        selectedIconPath: "assets/tab/planet-on.png",
      },
      {
        pagePath: "pages/emotions/index",
        text: "情绪",
        iconPath: "assets/tab/heart.png",
        selectedIconPath: "assets/tab/heart-on.png",
      },
      {
        pagePath: "pages/journal/index",
        text: "日记",
        iconPath: "assets/tab/journal.png",
        selectedIconPath: "assets/tab/journal-on.png",
      },
      {
        pagePath: "pages/share/index",
        text: "分享",
        iconPath: "assets/tab/share.png",
        selectedIconPath: "assets/tab/share-on.png",
      },
    ],
  },
};
