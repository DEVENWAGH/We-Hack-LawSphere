## Environment Variables

Create a .env file in the Backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Optional - Set to "true" to use local storage instead of ImageKit
USE_LOCAL_STORAGE=false
```

## Image Uploads

The application uses ImageKit for image storage and transformation.

- Sign up at https://imagekit.io/
- Create a new media library
- Get your public key, private key, and URL endpoint
- Add these to your .env file
