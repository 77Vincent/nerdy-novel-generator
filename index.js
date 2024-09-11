import OpenAI from "openai";
import {BASE_PROMPT} from "./src/constants.js";

(async function () {
    const openai = new OpenAI({
        apiKey: "",
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `${BASE_PROMPT}, 因此，写个50字的创意文章`,
            },
        ],
    });

    console.log(completion.choices[0].message);
}())
