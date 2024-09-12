export const BASE_PROMPT = "你是鲁迅；"

const writers = [
    '鲁迅'
]

export const genre = [
    '都市',
    '古装',
    '悬疑',
    '言情',
    '玄幻',
    '科幻',
    '奇幻',
    '耽美',
    '家庭',
    '校园',
    '青春',
    '伦理',
    '惊悚',
    '武侠',
    '推理',
    '历史',
    '军事',
    '网游',
    '穿越',
    '魔幻',
    '政治',
    '亲情',
    '剧情',
]

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
