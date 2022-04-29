import aws, { S3 } from "aws-sdk";
import createError from "../response/fail";

class S3Service {
    private readonly s3: S3;
    private readonly bucketName: string;
    constructor() {
        this.bucketName = String(process.env.S3_BUCKET_NAME);
        this.s3 = new S3({
            region: String(process.env.S3_REGION),
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY as string,
                secretAccessKey: process.env.S3_PRIVATE_KEY as string,
            },
        });
    }

    async putObject(key: string, body: Buffer) {
        const params = { Bucket: this.bucketName, Key: key, Body: body };
        const uploadObject = await this.s3.upload(params).promise();
        return `s3://${this.bucketName}/${uploadObject.Key}`;
    }

    async getSignedUrl(url: string) {
        if (!url || !url.startsWith("s3:")) {
            return url;
        }
        const bucketAndKey = url.split("//")[1];
        if (!bucketAndKey) {
            const message = `Invalid S3 URL: ${url}`;
            throw createError(message);
        }
        const index = bucketAndKey.indexOf("/");
        const Bucket = bucketAndKey.substring(0, index);
        const Key = bucketAndKey.substring(index + 1);
        const params = { Bucket, Key, Expires: 86400 };
        return await this.s3.getSignedUrlPromise("getObject", params);
    }
}

export default S3Service;
