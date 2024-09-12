import OpenAI from "openai";
import {BASE_PROMPT, genre, pick, randInt} from "./utils.js";

export const generate = async () => {
    const apiKey = process.env.OPEN_AI_API_KEY;

    const openai = new OpenAI({
        apiKey,
    });

    const prompt0 = `${BASE_PROMPT}想一个题材为${pick(genre, randInt(1,3)).join(",")}的故事，${randInt(10,40)}字。`

    try {
        const overview = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt0,
                },
            ],
            n: 1,
        });

        const len = randInt(50, 100)
        const prompt1 = `${BASE_PROMPT}以下是故事概要：${overview.choices[0].message.content}写一个充满悬念的小说或故事，别重复概要的内容，${len}字，不要太正经，没意思`;

        const content = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt1,
                },
            ],
            n: 1,
        });

        return {
            title: "",
            overview: overview.choices[0].message.content,
            story: content.choices[0].message.content,
        };
    } catch (e) {
        throw new Error(`failed to generate story: ${e}`)
    }
}
