import {generate} from "./src/generate.js";
import {putNovel} from "./src/db.js";
import {uploadImage} from "./src/s3.js";
import {uploadAuthor} from "./src/author.js";

(async function () {
    const novel = await generate('micro')
    await putNovel(novel)
    await uploadImage(novel.fileName)
    await uploadAuthor(String(novel.author_id))
}())
