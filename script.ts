import { join } from "path";
import { translateJson } from "./translator";

// test translation script 

(async function getTransData() {
  const jsonPath = join(process.cwd(), "json", "test.json");
  console.log(await translateJson(jsonPath, "ar", "en"));
})();
