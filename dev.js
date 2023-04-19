import chokidar from "chokidar";
import build from "./build-script.js";

const sourceOutDirName = "dist";
const appOutDirName = "app-dev";

const watchFiles = [
  "./src",
  "./public",
  "vite.config.ts",
  "tsconfig.json",
  "index.html",
];

chokidar
  .watch(watchFiles)
  .on("change", () =>
    build(sourceOutDirName, appOutDirName, {}, { mode: "run", flavor: "sdk" })
  );

build(sourceOutDirName, appOutDirName, {}, { mode: "run", flavor: "sdk" });
