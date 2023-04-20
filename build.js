import { buildApp, buildSourceFiles } from "./build-script.js";

const target = process.argv[2];

async function buildTargets() {
  const validTargets = ["win", "linux", "osx"];
  if (validTargets.includes(target)) {
    console.debug("Building app for target:", target);
  } else {
    console.debug("Building app for all targets");
  }
  await buildSourceFiles();

  switch (target) {
    case "win":
      await buildApp("app-win", { mode: "build", platform: "win" });
      break;
    case "linux":
      await buildApp("app-linux", { mode: "build", platform: "linux" });
      break;
    case "osx":
      await buildApp("app-osx", { mode: "build", platform: "osx" });
      break;
    default:
      await Promise.all([
        buildApp("app-win", { mode: "build", platform: "win" }),
        buildApp("app-linux", { mode: "build", platform: "linux" }),
        buildApp("app-osx", { mode: "build", platform: "osx" }),
      ]);
      break;
  }
}

buildTargets();
