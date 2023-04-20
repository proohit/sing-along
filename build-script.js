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
  console.log("CURR_DIR", CURR_DIR, "sourceOutDirName", sourceOutDirName);
  return path.join(CURR_DIR, sourceOutDirName);
}

function getAppOutDir(appOutDirName) {
  return path.join(CURR_DIR, appOutDirName);
}

/**
 *
 * @param {ViteOptions} viteOptions
 * @param {NwOptions} nwOptions
 * @param {string} sourceOutDirName
 * @param {string} appOutDirName
 */
export default async function build(
  viteOptions = {},
  nwOptions = {},
  appOutDirName = "app",
  srcOutDirName = "dist"
) {
  await buildSourceFiles(viteOptions, srcOutDirName);
  await buildApp(appOutDirName, nwOptions, srcOutDirName);
}

/**
 *
 * @param {string} sourceOutDir
 * @param {ViteOptions} viteOptions
 */
export async function buildSourceFiles(
  viteOptions = {},
  sourceOutDirName = "dist"
) {
  console.debug("Building source files...");
  const sourceOutDir = getSourceOutDir(sourceOutDirName);
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
}

/**
 *
 * @param {string} appOutDirName
 * @param {NwOptions} options
 * @param {string} sourceOutDirName
 */
export async function buildApp(
  appOutDirName = "app",
  options = {},
  sourceOutDirName = "dist"
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
