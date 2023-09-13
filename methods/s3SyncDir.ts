import fs from 'fs'
import path from 'path'
import url from 'url'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import invariant from 'invariant'

export async function s3SyncDir(
  s3Client: Pick<S3Client, 'send'>,
  dirPath: string,
  { bucket, bucketPath = '', verbose = true }: { bucket: string; bucketPath?: string; verbose?: boolean },
) {
  invariant(bucket, 'syncDir: bucket param is required')
  invariant(bucketPath, 'syncDir: bucketPath param is required. In case you want to delete full bucket, prefer to use console.')
  const keys: string[] = []

  await recursiveWalk(dirPath, async filePath => {
    let objectPath = filePath
    const relativeFilePath = path.relative(dirPath, filePath)
    const Key = url.resolve(bucketPath, relativeFilePath)

    const Body = fs.readFileSync(filePath)

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key,
        Body,
      })
      await s3Client.send(command)
      keys.push(Key)
      if (verbose) {
        console.log(`Successfully uploaded ${objectPath} to s3 bucket`)
      }
    } catch (error) {
      throw new Error(`error in uploading ${objectPath} to s3 bucket`)
    }
  })

  return keys
}

export async function recursiveWalk(currentDirPath: string, callback: (filePath: string, stat: any) => Promise<any>) {
  const list = fs.readdirSync(currentDirPath)

  for (let i = 0; i < list.length; i++) {
    const name = list[i]

    const filePath = path.join(currentDirPath, name)
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      await callback(filePath, stat)
    }
    if (stat.isDirectory()) {
      await recursiveWalk(filePath, callback)
    }
  }
}

export default s3SyncDir
