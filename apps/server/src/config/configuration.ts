export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },
  frontendUrl: process.env.FRONTEND_URL,
  liveKit: {
    apiKey: process.env.LIVEKIT_API_KEY,
    secret: process.env.LIVEKIT_SECRET,
  },
});
