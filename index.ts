import s3DeleteDir, { S3UtilDeleteDirParams } from './methods/s3DeleteDir'
import s3SyncDir from './methods/s3SyncDir'

export { S3UtilDeleteDirParams }

export { s3SyncDir, s3DeleteDir }

export default {
  syncDir: s3SyncDir,
  deleteDir: s3DeleteDir,
}
