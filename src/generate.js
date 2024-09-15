import OpenAI from "openai";
import {genres, getBasePrompt, getNovelId, pick, randInt, TYPES} from "./utils.js";

const getSynopsis = async (base, genre, openai) => {
    const prompt = `想一个题材为${genre.join(",")}的小说概要，${randInt(20, 50)}字，避免俗套的剧情。`
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
    const prompt = `以下是故事概要：${synopsis}为它想一个原创性的名字，${randInt(2, 15)}字以内`
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
    const prompt = `你是爱伦·坡，以下是故事概要：${synopsis}以此创作一篇小说，受众为25岁以上的成年人，第一或第三人称，有清晰的故事线，有主角，可以是反派，有对白，有张力，有细节描述，比如人物表情，动作，声音，物品，以及环境，达到引人入胜的效果，有大团圆或悲惨的结局，可能有反转，不要政治正确，不要蜻蜓点水式的讲述，不需要标题，不要markdown格式，${len}字以内`;

    const content = await openai.chat.completions.create({
        model: "gpt-4o",
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
            id: getNovelId(title, synopsis),
            title: title.replace("《", "").replace("》", ""),
            synopsis: synopsis.replace("《", "").replace("》", ""),
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
