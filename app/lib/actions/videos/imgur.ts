'use server';

import { OBJECT_ID_LENGTH } from '@/app/constants';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
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

export async function downloadImgurUploadS3(
  imgurUrl: string,
  worldcupId: string
) {
  const pathname = new URL(imgurUrl).pathname;
  const originalVideoURL = `https://i.imgur.com${pathname}.mp4`;
  const response = await fetch(originalVideoURL);

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
  console.log(originalVideoURL);
  console.dir(response.headers, { depth: null });
  const contentLength = response.headers.get('content-length');
  console.log(contentLength);
  // mp4 upload => content type = video/mp4
  if (contentType !== 'video/mp4') {
    throw new Error(
      'imgur은 mp4 동영상 파일만 지원합니다. 주소가 올바른지 확인해보세요.'
    );
  }
  const objectId = nanoid(OBJECT_ID_LENGTH);
  const key = `worldcups/${worldcupId}/${objectId}.mp4`;

  const uploadParams = {
    Bucket,
    Key: key,
    Body: passThrough,
    ContentType: contentType,
  };
  // content length를 몰라서 lib-storage를 사용해야함
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
  return key;
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

  //   fetch('https://api.imgur.com/3/album/2HukUxt', requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => console.dir(result, { depth: null }))
  //     .catch((error) => console.log('error', error));

  fetch('https://api.imgur.com/3/image/i6uyHNs', requestOptions)
    .then((response) => response.json())
    .then((result) => console.dir(result, { depth: null }))
    .catch((error) => console.log('error', error));
}
