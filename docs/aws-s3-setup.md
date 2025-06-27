# AWS S3 Setup Guide

This guide walks you through setting up AWS S3 for file storage in Luminous CRM.

## Prerequisites

1. AWS Account
2. AWS CLI (optional, for bucket creation)

## Setup Steps

### 1. Create an S3 Bucket

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure:
   - **Bucket name**: `luminous-files` (or your preferred name)
   - **Region**: Select your preferred region (e.g., `us-east-1`)
   - **Block Public Access**: Uncheck "Block all public access" if you want logos to be publicly accessible
   - Leave other settings as default

### 2. Configure Bucket Policy (for public logos)

If you want organization logos to be publicly accessible, add this bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::luminous-files/images/*"
    }
  ]
}
```

### 3. Configure CORS

Add CORS configuration to allow uploads from your frontend:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "https://your-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 4. Create IAM User

1. Go to IAM service in AWS Console
2. Create a new user with programmatic access
3. Attach the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::luminous-files",
        "arn:aws:s3:::luminous-files/*"
      ]
    }
  ]
}
```

### 5. Configure Environment Variables

Update your `.env` file with the AWS credentials:

```env
# AWS S3 Storage Configuration
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="luminous-files"
AWS_CLOUDFRONT_URL=""  # Optional: CloudFront distribution URL
```

### 6. (Optional) Set up CloudFront CDN

For better performance, set up CloudFront:

1. Go to CloudFront in AWS Console
2. Create a new distribution
3. Set your S3 bucket as the origin
4. Configure caching behaviors
5. Update `AWS_CLOUDFRONT_URL` in your `.env`

## Testing

After configuration, test the upload functionality:

1. Start your backend server
2. Try uploading an organization logo through the settings page
3. Verify the file appears in your S3 bucket
4. Check that the logo URL works

## Security Best Practices

1. **Never commit AWS credentials** to version control
2. **Use IAM roles** for EC2 instances instead of access keys in production
3. **Enable versioning** on your S3 bucket for backup
4. **Set up lifecycle policies** to manage old files
5. **Monitor costs** with AWS Cost Explorer

## Troubleshooting

### Common Issues

1. **Access Denied errors**
   - Check IAM permissions
   - Verify bucket policy
   - Ensure credentials are correct

2. **CORS errors**
   - Update CORS configuration with your frontend URL
   - Check browser console for specific CORS errors

3. **File not accessible**
   - Verify bucket policy for public access
   - Check file permissions after upload

## Migration from MinIO

If migrating from MinIO:

1. Export files from MinIO using their client tools
2. Upload to S3 maintaining the same folder structure
3. Update environment variables
4. No code changes needed - the application uses S3-compatible APIs