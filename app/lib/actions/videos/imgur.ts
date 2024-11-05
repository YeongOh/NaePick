'use server';

import { OBJECT_ID_LENGTH } from '@/app/constants';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import { PassThrough, Readable } from 'stream';
import { S3client, videoBucket } from '../../bucket/config';

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
  const contentLength = response.headers.get('content-length');
  // mp4 upload => content type = video/mp4
  if (contentType !== 'video/mp4') {
    throw new Error(
      'imgur은 mp4 동영상 파일만 지원합니다. 주소가 올바른지 확인해보세요.'
    );
  }
  const objectId = nanoid(OBJECT_ID_LENGTH);
  const key = `worldcups/${worldcupId}/${objectId}.mp4`;

  const uploadParams = {
    Bucket: videoBucket,
    Key: key,
    Body: passThrough,
    ContentType: contentType,
  };
  // content length를 몰라서 lib-storage를 사용해야함
  const parallelUploads3 = new Upload({
    client: S3client,
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

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  fetch('https://api.imgur.com/3/image/i6uyHNs', requestOptions)
    .then((response) => response.json())
    .then((result) => console.dir(result, { depth: null }))
    .catch((error) => console.log('error', error));
}
