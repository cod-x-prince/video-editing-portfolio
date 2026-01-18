import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

// Initialize S3 Client (Server-side only)
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: any, res: any) {
  // 1. Method Validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contentType, fileSize } = req.body;

    // 2. Security: Validate MIME Type strictly
    if (!contentType || !contentType.startsWith('video/')) {
      return res.status(400).json({ error: 'Invalid content type. Only video files allowed.' });
    }

    // 3. Security: Validate reported file size against limit
    const MAX_SIZE = 150 * 1024 * 1024; // 150MB
    if (fileSize > MAX_SIZE) {
      return res.status(400).json({ error: 'File exceeds 150MB limit.' });
    }

    // Generate unique key
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;

    // 4. Generate Presigned POST Policy
    // This signature cryptographically enforces constraints on the S3 side.
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ['content-length-range', 0, MAX_SIZE], // Enforces size limit even if client lies
        ['starts-with', '$Content-Type', 'video/'], // Enforces video mime type
        { 'acl': 'private' } // Uploads are private by default
      ],
      Fields: {
        'acl': 'private',
        'Content-Type': contentType,
      },
      Expires: 600, // URL expires in 10 minutes
    });

    // Return the URL and fields the client needs for the Form POST
    res.status(200).json({ url, fields, key });

  } catch (error) {
    console.error('Presign generation failed:', error);
    res.status(500).json({ error: 'Failed to generate secure upload URL.' });
  }
}
