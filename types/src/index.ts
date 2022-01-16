#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { printTSNodes, createImport } from "./utils/ts";
import { generate } from "./customTypes";
import fetch from "node-fetch";

export interface IPrismicTypeGenConfig {
  repo: string;
  token: string;
  outputPath?: string;
}

const CONFIG_FILE_NAME_TS = "prismicTypeGen.config.ts";
const CONFIG_FILE_NAME_JSON = "prismicTypeGen.config.json";

const CUSTOM_TYPES_ENDPOINT = "https://customtypes.prismic.io/customtypes";

const defaults = {
  outputPath: "prismicTypes.ts",
};
export const mkdir = util.promisify(fs.mkdir);
export const readFile = util.promisify(fs.readFile);
export const readJSON = async <T>(p: any) =>
  JSON.parse((await readFile(p)) as any) as T;
export const writeFile = util.promisify(fs.writeFile);
export const writeJSON = async (p, contents, space = 2) =>
  writeFile(p, JSON.stringify(contents, undefined, space) + "\n");

const getConfig = async () => {
  const appRootDir = process.cwd();
  const configPath = path.resolve(appRootDir, CONFIG_FILE_NAME_JSON);
  const data = await readJSON<IPrismicTypeGenConfig>(configPath);

  return data;
};

const run = async () => {
  const config = await getConfig();
  const response = await fetch(CUSTOM_TYPES_ENDPOINT, {
    method: "GET",
    headers: {
      repository: config.repo,
      Authorization: `Bearer ${config.token}`,
    },
  });

  const data = await response.json();

  await writeFile(
    config?.outputPath || defaults.outputPath,
    printTSNodes([
      createImport("@prismicio/types", [
        // "KeyTextField",
        // "BooleanField",
        "RichTextField",
        "ImageField",
        "IntegrationFields",
        "LinkField",
        "EmbedField",
        "SelectField",
        "GeoPointField",
        "NumberField",
        "ColorField",
        "DateField",
        "TimestampField",
        "RelationField",
      ]),
      ...generate(data),
    ])
  );
};

run();
