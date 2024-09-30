import {getDb} from "./utils.js";
import {PutItemCommand, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {generateAuthor} from "./generate.js";

const authorTableName = "nerdy-novel-author"

export async function uploadAuthor(authorNo) {
    const db = await getDb()

    try {
        // get the author
        const {$metadata: {httpStatusCode}, Count, Items} = await db.send(new ScanCommand({
            TableName: authorTableName,
            FilterExpression: "#a = :v",
            ExpressionAttributeNames: {
                "#a": "no",
            },
            ExpressionAttributeValues: {
                ":v": {
                    N: authorNo,
                },
            },
        }))

        // TODO: handle the 4XX/5XX error case
        if (httpStatusCode !== 200) {
            return httpStatusCode
        }

        // create a new user if not exist
        if (!Count) {
            const authorName = await generateAuthor()
            const now = new Date().getTime()
            const params = {
                TableName: "nerdy-novel-author",
                Item: {
                    id: {S: `${authorName}#${now}#${authorNo}`},
                    no: {N: `${authorNo}`},
                    name: {S: authorName},
                    posts: {N: "1"},
                    created_at: {N: `${now}`},
                },
            };
            await db.send(new PutItemCommand(params));
            return
        }

        // otherwise update the existing
        const {id: {S: id}} = Items[0] // the fetched author id
        const params = {
            TableName: authorTableName,
            Key: {
                id: {S: id,},
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
        throw Error(`failed to create or update the author ${authorNo} info: ${e}`);
    }
}
