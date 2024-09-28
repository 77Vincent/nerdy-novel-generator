import md5 from "md5";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const writers = [
    '鲁迅', '莫泊桑', '巴尔扎克', '莎士比亚', '莫言',
    '村上春树', '海明威', '爱伦·坡', '马克·吐温', '伏尔泰',
    '曹雪芹', '拜伦', '列夫·托尔斯泰', '狄更斯', '司汤达',
    '萧伯纳', '刘慈欣', '雨果', '歌德', '普鲁斯特',
]

export const genres = [
    '都市', '古装', '悬疑', '言情', '玄幻',
    '科幻', '奇幻', '耽美', '家庭', '校园',
    '青春', '伦理', '惊悚', '武侠', '推理',
    '历史', '军事', '穿越', '魔幻', '政治',
]

export const TYPES = {
    micro: [20, 100],
    short: [500, 2000],
    medium: [2000, 8000],
    long: [8000, 20000],
}

export function getBasePrompt() {
    return `你是著名小说家`
}

export function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(data, count) {
    let i = 0
    const output = []

    while (i < count) {
        const g = data[randInt(0, data.length - 1)]
        if (output.includes(g)) {
            continue
        }
        output.push(g);
        i++
    }

    return output;
}

export const getNovelId = (title, synopsis) => {
    return `${md5(title).toString().substring(0, 10)}-${md5(synopsis).toString().substring(0, 10)}`;
}

export const getDb = async () => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    return new DynamoDBClient({
        region: "ap-northeast-1",
        // region: 'local', // Can be any valid AWS region
        // endpoint: 'http://localhost:8000', // Connect to local DynamoDB
        credentials: {
            accessKeyId, // These values can be anything when using local DynamoDB
            secretAccessKey,
        },
    });
}
