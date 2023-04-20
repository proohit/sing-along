import child_process from "child_process";
import chokidar from "chokidar";

const watchFiles = [
  "./src",
  "./public",
  "vite.config.ts",
  "tsconfig.json",
  "index.html",
];

let currentProcess = null;

function build() {
  if (currentProcess) {
    currentProcess.kill();
  }

  const newProcess = child_process.spawn(
    "node",
    [
      "-e",
      'import("./build-script.js").then(({ default: build }) => { build({}, { mode: "run", flavor: "sdk" });});',
    ],
    {
      stdio: "inherit",
    }
  );

  newProcess.on("exit", () => {
    currentProcess = null;
  });

  newProcess.on("message", (data) => {
    console.log(`${data}`);
  });

  newProcess.on("error", (data) => {
    console.error(`${data}`);
  });

  newProcess.on("spawn", () => {
    currentProcess = newProcess;
  });
}

chokidar.watch(watchFiles).on("change", build).on("ready", build);
