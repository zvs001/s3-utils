import { S3 } from 'aws-sdk'
import { S3ClientMinimal } from '../typings/aws'

export interface S3UtilDeleteDirParams extends S3.Types.ListObjectsRequest {
  Prefix: string
}

export interface S3UtilDeleteDirResponse {
  deletedCount: number
}
async function s3DeleteDir(s3Client: S3ClientMinimal, params: S3UtilDeleteDirParams): Promise<S3UtilDeleteDirResponse> {
  const list = await s3Client.listObjects(params).promise()
  const result = { deletedCount: 0 }
  if (!list.Contents) return result

  const isDirEmpty = !list.Contents.length
  if (isDirEmpty) {
    await s3Client.deleteObject({
      Bucket: params.Bucket,
      Key: params.Prefix,
    }).promise()

    // todo here we can check if directory id deleted.

    return result
  }

  const deleteParams: S3.Types.DeleteObjectsRequest = {
    Bucket: params.Bucket,
    Delete: { Objects: [] },
  }

  list.Contents.forEach(({ Key }) => {
    if (!Key) return null
    deleteParams.Delete.Objects.push({ Key })
  })

  const deleteResponse = await s3Client.deleteObjects(deleteParams).promise()
  result.deletedCount += deleteResponse.Deleted ? deleteResponse.Deleted.length : 0

  const recursiveResult = await s3DeleteDir(s3Client, params)
  result.deletedCount += recursiveResult.deletedCount

  return result
}

export default s3DeleteDir
