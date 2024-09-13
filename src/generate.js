import OpenAI from "openai";
import {BASE_PROMPT, genre, pick, randInt} from "./utils.js";

export const generate = async () => {
    const apiKey = process.env.OPEN_AI_API_KEY;
    const openai = new OpenAI({
        apiKey,
    });

    try {
        const promptForOverview = `${BASE_PROMPT}想一个题材为${pick(genre, randInt(1,3)).join(",")}的故事，${randInt(10,40)}字。`
        const synopsis = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: promptForOverview,
                },
            ],
            n: 1,
        });

        const promptForTitle = `${BASE_PROMPT}以下是故事概要：${synopsis.choices[0].message.content}为它想一个原创性的名字，${randInt(2,15)}字以内，只需要名字`
        const title = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: promptForTitle,
                },
            ],
            n: 1,
        });

        const len = randInt(10, 30)
        const promptForContent = `${BASE_PROMPT}以下是故事概要：${synopsis.choices[0].message.content}写一个充满悬念的小说或故事，别重复概要的内容，${len}字，不要太正经，没意思`;

        const content = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: promptForContent,
                },
            ],
            n: 1,
        });

        return {
            title: title.choices[0].message.content,
            length: len,
            synopsis: synopsis.choices[0].message.content,
            story: content.choices[0].message.content,
        };
    } catch (e) {
        throw new Error(`failed to generate story: ${e}`)
    }
}
