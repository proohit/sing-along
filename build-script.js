import { cp } from "fs/promises";
import nwbuild from "nw-builder";
import path from "path";
import * as url from "url";
import { build as viteBuild } from "vite";

/**
 * @typedef {import("vite").InlineConfig} ViteOptions
 * @typedef {import("nw-builder").OPTIONS} NwOptions
 */

const CURR_DIR = url.fileURLToPath(new URL(".", import.meta.url));
const packageJsonPath = path.join(CURR_DIR, "package.json");

function getSourceOutDir(sourceOutDirName) {
  return path.join(CURR_DIR, sourceOutDirName);
}

function getAppOutDir(appOutDirName) {
  return path.join(CURR_DIR, appOutDirName);
}

/**
 *
 * @param {string} sourceOutDirName
 * @param {string} appOutDirName
 * @param {ViteOptions} viteOptions
 * @param {NwOptions} nwOptions
 */
export default async function build(
  sourceOutDirName = "dist",
  appOutDirName = "app",
  viteOptions = {},
  nwOptions = {}
) {
  const sourceOutDir = getSourceOutDir(sourceOutDirName);

  console.debug("Building source files...");
  await viteBuild({
    ...viteOptions,
    build: {
      outDir: viteOptions?.build?.outDir ?? sourceOutDir,
    },
  });
  console.debug("Done.");

  console.debug("Copying package json...");
  const sourceOutDirPackageJsonPath = path.join(sourceOutDir, "package.json");
  await cp(packageJsonPath, sourceOutDirPackageJsonPath);
  console.debug("Done.");

  await buildApp(sourceOutDirName, appOutDirName, nwOptions);
}

/**
 *
 * @param {string} sourceOutDirName
 * @param {string} appOutDirName
 * @param {NwOptions} options
 */
export async function buildApp(
  sourceOutDirName = "dist",
  appOutDirName = "app",
  options = {}
) {
  console.debug("Building app...");
  await nwbuild({
    ...options,
    srcDir: options?.srcDir ?? getSourceOutDir(sourceOutDirName),
    outDir: options?.outDir ?? getAppOutDir(appOutDirName),
    glob: false,
    app: {
      name: "spotycs",
    },
  });
  console.debug("Done.");
}
