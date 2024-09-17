import {generate} from "./src/generate.js";
import {putNovel} from "./src/db.js";
import {uploadImage} from "./src/s3.js";

(async function () {
    const novel = await generate('micro')
    await putNovel(novel)
    await uploadImage(novel.fileName)
}())
