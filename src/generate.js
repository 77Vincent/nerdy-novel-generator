import OpenAI from "openai";
import {genres, getBasePrompt, pick, randInt, TYPES} from "./utils.js";

const getSynopsis = async (base, genre, openai) => {
    const prompt = `${base}想一个题材为${genre.join(",")}的故事，${randInt(10, 40)}字。`
    const synopsis = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        n: 1,
    });
    return synopsis.choices[0].message.content
}

const getTitle = async (base, synopsis, openai) => {
    const prompt = `${base}以下是故事概要：${synopsis}为它想一个原创性的名字，${randInt(2, 15)}字以内，只需要名字`
    const title = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        n: 1,
    });

    return title.choices[0].message.content
}

const getContent = async (base, synopsis, len, openai) => {
    const prompt = `${base}以下是故事概要：${synopsis}写一个充满悬念的小说或故事，别重复概要的内容，${len}字，不要太正经，没意思`;

    const content = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        n: 1,
    });
    return content.choices[0].message.content
}

export const generate = async (size) => {
    const BASE_PROMPT = getBasePrompt()
    const genre = pick(genres, randInt(1, 3))
    const apiKey = process.env.OPEN_AI_API_KEY;
    const openai = new OpenAI({
        apiKey,
    });

    // safeguard
    if (!TYPES[size]) {
        size = "micro"
    }
    const min = TYPES[size][0]
    const max = TYPES[size][1]
    const len = randInt(min, max)

    try {
        const synopsis = await getSynopsis(BASE_PROMPT, genre, openai);
        const title = await getTitle(BASE_PROMPT, synopsis, openai);
        const content = await getContent(BASE_PROMPT, synopsis, len, openai);

        return {
            title,
            synopsis,
            size,
            chapters: [{
                title: "",
                content,
                length: len,
            }],
            length: len,
            genre,
            author_id: randInt(1, 500),
            created_at: Date.now(),
            updated_at: Date.now(),
        };
    } catch (e) {
        throw new Error(`failed to generate story: ${e}`)
    }
}
