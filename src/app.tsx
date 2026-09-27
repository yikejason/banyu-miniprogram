import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
import "./app.scss";

function App({ children }: PropsWithChildren<Record<string, unknown>>) {
  useLaunch(() => {
    // App-level launch hook (device vault init happens on the cover page).
  });

  return children;
}

export default App;
