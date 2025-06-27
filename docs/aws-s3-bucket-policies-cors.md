# AWS S3 Bucket Policies and CORS Configuration

This guide provides detailed instructions for configuring bucket policies and CORS for AWS S3 in Luminous CRM.

## Bucket Policy Configuration

### Option 1: Public Read Access for Logos (Recommended)

This policy allows public read access only to files in the `images/` folder:

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

### Option 2: Completely Private Bucket

If you want all files private (requires signed URLs for access):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::luminous-files",
        "arn:aws:s3:::luminous-files/*"
      ],
      "Condition": {
        "StringNotEquals": {
          "aws:SourceAccount": "YOUR_AWS_ACCOUNT_ID"
        }
      }
    }
  ]
}
```

## How to Apply Bucket Policy

1. Go to AWS S3 Console
2. Select your bucket
3. Click on "Permissions" tab
4. Scroll to "Bucket policy"
5. Click "Edit"
6. Paste the policy and click "Save changes"

## CORS Configuration

### Standard CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"],
    "MaxAgeSeconds": 3000
  }
]
```

### Production CORS Configuration (More Restrictive)

```json
[
  {
    "AllowedHeaders": [
      "Authorization",
      "Content-Type",
      "Content-Length",
      "X-Requested-With"
    ],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": [
      "https://your-production-domain.com",
      "https://www.your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

## How to Apply CORS Configuration

1. Go to AWS S3 Console
2. Select your bucket
3. Click on "Permissions" tab
4. Scroll to "Cross-origin resource sharing (CORS)"
5. Click "Edit"
6. Paste the CORS configuration and click "Save changes"

## Additional Security Configurations

### 1. Block Public Access Settings

For production, configure these settings based on your needs:

- **Block public access to buckets and objects granted through new access control lists (ACLs)**: Off (if using public logos)
- **Block public access to buckets and objects granted through any access control lists (ACLs)**: Off (if using public logos)
- **Block public access to buckets and objects granted through new public bucket or access point policies**: Off
- **Block public and cross-account access to buckets and objects through any public bucket or access point policies**: Off

### 2. Bucket Versioning (Recommended)

Enable versioning for backup and recovery:

```bash
aws s3api put-bucket-versioning \
  --bucket luminous-files \
  --versioning-configuration Status=Enabled
```

### 3. Lifecycle Policy (Cost Optimization)

Add lifecycle rules to manage old files:

```json
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    },
    {
      "Id": "TransitionOldFiles",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        }
      ],
      "Filter": {
        "Prefix": "documents/"
      }
    }
  ]
}
```

## Testing Your Configuration

### Test CORS
```javascript
// Run this in browser console
fetch('https://luminous-files.s3.us-east-1.amazonaws.com/test.txt', {
  method: 'GET',
  mode: 'cors'
})
.then(response => console.log('CORS working!'))
.catch(error => console.error('CORS error:', error));
```

### Test Public Access (for logos)
```bash
# Should work without authentication if public
curl https://luminous-files.s3.us-east-1.amazonaws.com/images/test-logo.png
```

### Test Upload via Application
1. Try uploading a logo through your application
2. Check S3 bucket for the uploaded file
3. Verify the returned URL works

## Troubleshooting

### CORS Error Messages:
- `No 'Access-Control-Allow-Origin' header`: Check CORS configuration
- `Preflight response is not successful`: Ensure OPTIONS method is allowed
- `Credentials flag is true but Access-Control-Allow-Credentials is not`: Add credentials handling to CORS

### Access Denied:
- Check bucket policy syntax
- Verify IAM user permissions
- Ensure bucket public access settings match your policy

### Common Issues:

1. **403 Forbidden on Public URLs**
   - Check bucket policy is applied correctly
   - Verify the file path matches the policy resource pattern
   - Ensure public access block settings allow your policy

2. **CORS Preflight Failures**
   - Add OPTIONS to AllowedMethods
   - Include all headers your app sends in AllowedHeaders
   - Verify origin URL matches exactly (including protocol)

3. **Slow Upload Performance**
   - Consider multipart uploads for large files
   - Use Transfer Acceleration for global uploads
   - Implement progress tracking in your application

## Best Practices

1. **Use Least Privilege**: Only grant the minimum permissions needed
2. **Monitor Access**: Enable S3 access logging
3. **Encrypt Data**: Enable default encryption on the bucket
4. **Regular Audits**: Review bucket policies and access patterns quarterly
5. **Cost Management**: Set up billing alerts and use lifecycle policies

**Remember:** Always test in a development environment first before applying to production!