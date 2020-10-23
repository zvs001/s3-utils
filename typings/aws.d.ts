import { S3 } from 'aws-sdk'

// just S3 will create ts errors
export type S3ClientMinimal = Pick<S3,
  'listObjects' | 'deleteObject' | 'deleteObjects' | 'putObject' | 'getObject'
>
