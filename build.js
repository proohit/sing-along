import build, { buildApp } from "./build-script.js";

const sourceOutDirName = "dist";
const appOutDirName = "app";

async function buildTargets() {
  await build(
    sourceOutDirName,
    "app-win",
    {},
    { mode: "build", platform: "win" }
  );

  await Promise.all([
    buildApp(
      sourceOutDirName,
      "app-linux",
      {},
      { mode: "build", platform: "linux" }
    ),
    buildApp(
      sourceOutDirName,
      "app-osx",
      {},
      { mode: "build", platform: "osx" }
    ),
  ]);
}

buildTargets();
