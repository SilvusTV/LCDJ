import { s3, S3_BUCKET } from '#services/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

async function ensurePrefix(key: string) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: new Uint8Array(0),
        ContentType: 'application/octet-stream',
      })
    )
  } catch (e) {
    // swallow errors to avoid blocking app start
    // console.error('Failed to create S3 placeholder', key, e)
  }
}

export default async function s3Boot() {
  // Ensure default folders exist by placing placeholder files
  await ensurePrefix('News/.keep')
  await ensurePrefix('Partners/.keep')
}
