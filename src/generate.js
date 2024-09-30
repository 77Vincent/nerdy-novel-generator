import OpenAI from "openai";
import fs from 'fs'
import {genres, getBasePrompt, getNovelId, pick, randInt, TYPES} from "./utils.js";

const getSynopsis = async (base, genre, openai) => {
    const prompt = `${base}, 想一个题材为${genre.join(",")}的小说概要，${randInt(20, 50)}字，避免俗套的剧情。`
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
    const prompt = `${base}, 以下是故事概要：${synopsis}为它想一个原创性的名字，约${randInt(2, 15)}字`
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
    const prompt = `${base}, 以下是故事概要：${synopsis}以此创作一篇小说，受众为25岁以上的成年人，第一或第三人称，有清晰的故事线，有主角，可以是反派，有对白，有张力，有细节描述，比如人物表情，动作，声音，物品，以及环境，达到引人入胜的效果，结局可喜可悲，也可以没有结局，可能有反转，不要政治正确，不要蜻蜓点水式的讲述，不需要标题，不要markdown格式，约${len}字`;

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

const getImage = async (id, synopsis, openai) => {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `${synopsis}, draw a creative picture with some comic style, no need for text`,
        response_format: "b64_json",
        n: 1,
        size: "1024x1024",
    });

    const {b64_json} = response.data[0];
    const buffer = Buffer.from(b64_json, "base64");
    try {
        const fileName = `novel-image-${id}.jpg`
        fs.writeFileSync(fileName, buffer);
        return fileName;
    } catch (error) {
        console.error(error);
    }
}

export const generateAuthor = async () => {
    const apiKey = process.env.OPEN_AI_API_KEY;
    const openai = new OpenAI({
        apiKey,
    });

    const prompt = `想一个名字，用于社交平台，可真实可虚构，不要局限于刻板印象，1到15个字，中英文都可以，只需要一个名字，只有名字本身，无需其他信息`
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
    const limit = randInt(min, max)

    try {
        const synopsis = await getSynopsis(BASE_PROMPT, genre, openai);
        const title = await getTitle(BASE_PROMPT, synopsis, openai);
        const content = await getContent(BASE_PROMPT, synopsis, limit, openai);
        const novelId = getNovelId(title, synopsis)
        const fileName = await getImage(novelId, synopsis, openai);

        return {
            id: novelId,
            title: title.replace("《", "").replace("》", ""),
            synopsis: synopsis.replace("《", "").replace("》", ""),
            size,
            chapters: [{
                title: "",
                content,
                length: content.length,
            }],
            length: content.length,
            genre,
            author_id: randInt(1, 100),
            created_at: Date.now(),
            updated_at: Date.now(),
            fileName,
        };
    } catch (e) {
        throw new Error(`failed to generate story: ${e}`)
    }
}
