import { PathOrFileDescriptor, readFileSync } from "fs";
import { jsonTransArrProcess, jsonTransProcess } from "./translate.functions";
import { Lang } from "./types/lang.type";

/**
 * @description
 * translate a specific json file to a lang or multiple langs
 * @example
 * const translatedFilePath = await translateJsonFile(jsonPath , 'ar' , 'en') // return the path of the new file
 * // or
 * const translatedFilePaths = await translateJsonFile(jsonPath , 'ar' , ['en' , 'fr' , 'de' ]) // return an array of the paths of the new files
 */

export async function translateJsonFile(
  jsonPath: PathOrFileDescriptor,
  fromLang: Lang,
  toLang: Lang | Lang[]
): Promise<PathOrFileDescriptor | PathOrFileDescriptor[]> {
  const jsonData = readFileSync(jsonPath).toString();
  const paresData: unknown = JSON.parse(jsonData);
  return Array.isArray(toLang)
    ? await jsonTransArrProcess(paresData, jsonPath, fromLang, toLang)
    : await jsonTransProcess(paresData, jsonPath, fromLang, toLang);
}

//TODO add funnctionality to translate a directory of json folder ** use it in i18n **
