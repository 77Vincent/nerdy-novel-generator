import {generate} from "./src/generate.js";
import {putNovel} from "./src/db.js";

(async function () {
    const novel = await generate('micro')
    await putNovel(novel)
}())
