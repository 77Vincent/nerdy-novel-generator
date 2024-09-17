import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import fs from "fs";

export async function uploadImage(fileName) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const client = new S3Client({
        region: "ap-northeast-1",
        credentials: {
            accessKeyId, // These values can be anything when using local DynamoDB
            secretAccessKey,
        },
    });

    const command = new PutObjectCommand({
        Bucket: "nerdy-novel",
        Prefix: "image",
        Key: `${fileName}`,
        Body: fs.createReadStream(fileName),
        ContentType: "image/jpg",
    });

    try {
        const data = await client.send(command);
        if (data.$metadata.httpStatusCode === 200) {
            console.log("successfully uploaded image");
        }
    } catch (error) {
        console.error(error);
    } finally {
    }
}
