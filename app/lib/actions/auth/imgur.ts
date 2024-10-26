'use server';

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough, Readable } from 'stream';

const Bucket = process.env.AWS_S3_BUCKET;
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials,
});

export async function downloadAndUploadMp4ToS3(imgurUrl: string, key: string) {
  // Fetching the MP4 file from Imgur
  const response = await fetch(imgurUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download file from Imgur: ${response.statusText}`
    );
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }
  const nodeStream = convertToNodeStream(response.body);
  const passThrough = new PassThrough();
  nodeStream.pipe(passThrough);
  const contentType = response.headers.get('Content-Type') as string;
  console.log(contentType);
  // mp4 upload => content type = video/mp4

  const uploadParams = {
    Bucket,
    Key: key,
    Body: passThrough,
    ContentType: contentType,
  };
  // content length를 모르게 lib-storage를 상요하여 Upload
  const parallelUploads3 = new Upload({
    client: s3,
    params: uploadParams,

    // optional tags
    tags: [
      /*...*/
    ],
    // additional optional fields show default values below:

    // // (optional) concurrency configuration
    queueSize: 4,

    // // (optional) size of each part, in bytes, at least 5MB
    partSize: 1024 * 1024 * 5,

    // // (optional) when true, do not automatically call AbortMultipartUpload when
    // // a multipart upload fails to complete. You should then manually handle
    // // the leftover parts.
    leavePartsOnError: false,
  });
  parallelUploads3.on('httpUploadProgress', (progress) => {
    console.log(progress);
  });

  await parallelUploads3.done();
  //   const command = new PutObjectCommand(uploadParams);

  //   await s3.send(command);
  console.log('MP4 streamed and uploaded to S3');
}

function convertToNodeStream(webStream: ReadableStream<Uint8Array>) {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

// 앨범 링크 지원해야 할때 사용
export async function testImgurAPI() {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Client-ID ${process.env.IMGUR_CLIENT_ID}`);

  // var formdata = new FormData();

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // redirect: 'follow',
  };

  fetch('https://api.imgur.com/3/album/2HukUxt', requestOptions)
    .then((response) => response.json())
    .then((result) => console.dir(result, { depth: null }))
    .catch((error) => console.log('error', error));
}
