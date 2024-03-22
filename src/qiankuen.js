import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "hmzs-screen", // app name registered
    entry: "//localhost:8888",
    container: "#yourContainer",
    activeRule: "/big-screen",
  },
]);

start();
