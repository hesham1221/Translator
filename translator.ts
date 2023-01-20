import axios from "axios";
import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";
import { Lang } from "./types/lang.type";

export async function translateJson(
  jsonPath: PathOrFileDescriptor,
  fromLang: Lang,
  toLang: Lang
): Promise<PathOrFileDescriptor> {
  const jsonData = readFileSync(jsonPath).toString();
  const paresData: unknown = JSON.parse(jsonData);
  let translatedJson = Array.isArray(paresData)
    ? await transArray(paresData, fromLang, toLang)
    : isObject(paresData) && (await transObject(paresData, fromLang, toLang));
  const newPath: string = String(jsonPath).replace(".json", `-${toLang}.json`);
  writeFileSync(newPath, JSON.stringify(translatedJson));
  return newPath;
}

export async function translateText(
  text: string,
  fromLang: Lang,
  toLang: Lang
): Promise<string> {
  try {
    const { data } = await axios.get(
      `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`
    );
    return data.responseData.translatedText;
  } catch (error) {
    throw new Error(error);
  }
}
export function isObject(value: unknown): value is Object {
  return typeof value === "object";
}

async function transObject(value: Object, fromLang: Lang, toLang: Lang) {
  let translatedJson = {};
  for (let k in value) {
    let valueOfK = value[k]; // initially == the value as if it failed or a number it will return the same value
    valueOfK =
      typeof value[k] === "string"
        ? await translateText(value[k], fromLang, toLang)
        : Array.isArray(value[k])
        ? await transArray(value[k], fromLang, toLang)
        : isObject(value[k]) && (await transObject(value[k], fromLang, toLang));
    translatedJson[k] = valueOfK;
  }
  return translatedJson;
}

async function transArray(value: Array<any>, fromLang: Lang, toLang: Lang) {
  let translatedJson: Array<any> = [];
  for (let i in value) {
    typeof value[i] === "string"
      ? translatedJson.push(await translateText(value[i], fromLang, toLang))
      : Array.isArray(value[i])
      ? translatedJson.push(await transArray(value[i], fromLang, toLang))
      : typeof value[i] === "number"
      ? translatedJson.push(value[i])
      : isObject(value[i]) &&
        translatedJson.push(await transObject(value[i], fromLang, toLang));
  }
  return translatedJson;
}
