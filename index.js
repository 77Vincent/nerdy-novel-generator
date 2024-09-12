import {generate} from "./src/generate.js";

(async function () {
    const story = await generate()
    console.log(story)
}())
