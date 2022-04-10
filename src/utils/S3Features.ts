import aws, { S3 } from "aws-sdk";

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
        console.log(this.s3);
        console.log(this.bucketName);
    }

    async putObject(key: string, body: Buffer) {
        const params = { Bucket: this.bucketName, Key: key, Body: body };
        const uploadObject = await this.s3.upload(params).promise();
        return `s3://${this.bucketName}/${uploadObject.Key}`;
    }
}

export default S3Service;
