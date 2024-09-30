import {getDb} from "./utils.js";
import {PutItemCommand, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {generateAuthor} from "./generate.js";
import md5 from "md5";

const authorTableName = "nerdy-novel-author"

export async function uploadAuthor(authorId) {
    const db = await getDb()

    const params = {
        TableName: authorTableName,
        FilterExpression: "#a = :v",
        ExpressionAttributeNames: {
            "#a": "id",
        },
        ExpressionAttributeValues: {
            ":v": {
                S: authorId,
            },
        },
    }

    try {
        const {$metadata: {httpStatusCode}, Count} = await db.send(new ScanCommand(params))

        // TODO: handle the 4XX/5XX error case
        if (httpStatusCode !== 200) {
            return httpStatusCode
        }

        if (!Count) {
            const authorName = await generateAuthor()
            const params = {
                TableName: "nerdy-novel-author",
                Item: {
                    id: {S: md5(authorName)},
                    name: {S: authorName},
                    posts: {N: "1"}
                },
            };
            await db.send(new PutItemCommand(params));
            return
        }
    } catch (e) {
        throw Error(`failed to fetch the author ${authorId} info: ${e}`);
    }

    try {
        const params = {
            TableName: authorTableName,
            Key: {
                id: {S: authorId,},
            },
            UpdateExpression: "add #a :v",
            ExpressionAttributeNames: {
                "#a": "posts"
            },
            ExpressionAttributeValues: {
                ":v": {N: "1"}
            },
        };
        await db.send(new UpdateItemCommand(params))
    } catch (e) {
        throw Error(`failed to update the author ${authorId} info: ${e}`);
    }
}
