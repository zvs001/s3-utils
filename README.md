
Library provides additional useful methods, 
that doesn't exists in aws-sdk

### Getting Started

yarn: `yarn add @zvs001/s3-utils`

npm: `npm i -S @zvs001/s3-utils`

```typescript
import s3Utils from '@zvs001/s3-utils'
import { S3 } from 'aws-sdk'

const s3Client = new S3({}) // authorized s3 client

s3Utils.deleteDir(s3Client, { ... })
```

### API
- [s3DeleteDir](https://github.com/zvs001/s3-utils#s3deletedir)
- [s3SyncDir](https://github.com/zvs001/s3-utils#s3deletedir)

#### s3DeleteDir

Delete bucket directory with all containing files inside.

```typescript
import s3Utils from '@zvs001/s3-utils'
// import { s3DeleteDir } from '@zvs001/s3-utils' // named import

await s3Utils.deleteDir(s3Client, {
  Bucket: 'my-bucket',
  Prefix: `folder/`,
})
```

#### s3SyncDir

Upload local directory to s3 bucket. 
It will upload recursively all files and directories.

```typescript
import s3Utils from '@zvs001/s3-utils'
// import { s3SyncDir } from '@zvs001/s3-utils' // named import

const localDir = '/tmp/folder/'
await s3Utils.syncDir(s3Client, localDir, { bucket: 'bucket', bucketPath: 'sub-dir/' })
```
