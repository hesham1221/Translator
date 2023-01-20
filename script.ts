import { join } from "path";
import { translateJsonFile } from "./translator";

// test translation script 

(async function getTransData() {
  const jsonPath = join(process.cwd(), "json", "test.json");
  // console.log(await translateJson(jsonPath, "ar", "en"));
  // console.log(await translateJson(jsonPath, "ar", ["en" , 'da' , 'de']))
})();
