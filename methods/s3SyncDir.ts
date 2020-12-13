import fs from 'fs'
import path from 'path'
import url from 'url'
import invariant from 'invariant'
import { S3ClientMinimal } from '../typings/aws'

export async function s3SyncDir(
  s3: S3ClientMinimal, dirPath: string,
  { bucket, bucketPath = '/' }: { bucket: string; bucketPath?: string},
) {
  invariant(bucket, 'syncDir: bucket param is required')
  const keys: string[] = []

  await recursiveWalk(dirPath, async filePath => {
    let objectPath = filePath
    const relativeFilePath = path.relative(dirPath, filePath)
    const Key = url.resolve(bucketPath, relativeFilePath)
    const params = { Bucket: bucket, Key, Body: fs.readFileSync(filePath) }

    try {
      await s3.putObject(params).promise()
      keys.push(Key)
      console.log(`Successfully uploaded ${objectPath} to s3 bucket`)
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
