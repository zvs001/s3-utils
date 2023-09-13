import {
  ListObjectsCommand, S3Client, ListObjectsCommandInput, DeleteObjectCommand, DeleteObjectsCommand, ObjectIdentifier,
} from '@aws-sdk/client-s3'

export interface S3UtilDeleteDirParams extends ListObjectsCommandInput {
  Prefix: string
}

export interface S3UtilDeleteDirResponse {
  deletedCount: number
}
async function s3DeleteDir(s3Client: Pick<S3Client, 'send'>, params: S3UtilDeleteDirParams): Promise<S3UtilDeleteDirResponse> {
  const ListObjectCommand = new ListObjectsCommand(params)
  const list = await s3Client.send(ListObjectCommand)
  const result = { deletedCount: 0 }
  if (!list.Contents) return result

  const isDirEmpty = !list.Contents.length
  if (isDirEmpty) {
    const deleteDirObjectCommand = new DeleteObjectCommand({
      Bucket: params.Bucket,
      Key: params.Prefix,
    })
    await s3Client.send(deleteDirObjectCommand)

    // todo here we can check if directory id deleted.

    return result
  }

  const Objects: ObjectIdentifier[] = []
  list.Contents.forEach(({ Key }) => {
    if (!Key) return null
    Objects.push({ Key })
  })

  const deleteListCommand = new DeleteObjectsCommand({
    Bucket: params.Bucket,
    Delete: { Objects },
  })
  const deleteResponse = await s3Client.send(deleteListCommand)
  result.deletedCount += deleteResponse.Deleted ? deleteResponse.Deleted.length : 0

  const recursiveResult = await s3DeleteDir(s3Client, params)
  result.deletedCount += recursiveResult.deletedCount

  return result
}

export default s3DeleteDir
