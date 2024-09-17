import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";

export async function putNovel(novel) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const client = new DynamoDBClient({
        region: "ap-northeast-1",
        // region: 'local', // Can be any valid AWS region
        // endpoint: 'http://localhost:8000', // Connect to local DynamoDB
        credentials: {
            accessKeyId, // These values can be anything when using local DynamoDB
            secretAccessKey,
        },
    });

    const {
        id, title, size, synopsis, length, genre,
        author_id, created_at, updated_at, chapters,
        fileName,
    } = novel

    const paramsNovel = {
        TableName: "nerdy-novel",
        Item: {
            id: {S: id},
            title: {S: title},
            synopsis: {S: synopsis},
            size: {S: size},
            length: {N: `${length}`},
            genre: {SS: genre},
            author_id: {N: `${author_id}`},
            created_at: {N: `${created_at}`},
            updated_at: {N: `${updated_at}`},
            img_url: {S: `https://nerdy-novel.s3.ap-northeast-1.amazonaws.com/${fileName}`},
        },
    };

    try {
        await client.send(new PutItemCommand(paramsNovel));
    } catch (error) {
        console.error(error);
    } finally {
        // finally.
    }

    for (let i in chapters) {
        const chapter = chapters[i];
        const {title, content, length} = chapter;
        const paramsChapter = {
            TableName: "nerdy-novel-chapters",
            Item: {
                id: {N: `${i + 1}`},
                novel_id: {S: id},
                title: {S: title},
                content: {S: content},
                length: {N: `${length}`},
            }
        }

        try {
            await client.send(new PutItemCommand(paramsChapter));
        } catch (error) {
            console.error(error);
            break
        } finally {
            // finally.
        }
    }
}
