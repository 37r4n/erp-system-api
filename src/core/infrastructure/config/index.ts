import 'dotenv/config';

export const config = {
  app: {
    port: Number(process.env.PORT) || 8080,
  },

  security: {
    salt: Number(process.env.SECURITY_SALT) || 12,
    expires: Number(process.env.SECURITY_EXPIRES) || 900,
    bytes: Number(process.env.SECURITY_BYTES) || 32,
  },
};
