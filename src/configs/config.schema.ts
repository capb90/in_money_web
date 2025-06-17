import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required().description('URL connection data base'),
  DATABASE_USER: Joi.string().required().description('Database username'),
  DATABASE_DB: Joi.string().required().description('Database name'),
  DATABASE_PORT: Joi.number().port().required().description('Database port'),
  DATABASE_HOST: Joi.string()
    .required()
    .default('localhost')
    .description('Database port'),
  DATABASE_PASSWORD: Joi.string().required().description('Database password'),
  JWT_SECRET: Joi.string().min(32).required().description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string().default('15m').description('JWT expires'),
  MAILER_SERVICE: Joi.string().default('gmail').description('Service mailer'),
  MAILER_EMAIL: Joi.string().required().description('Email service send'),
  MAILER_SECRET_KEY: Joi.string().required().description('Email secret key'),
  REDIS_URL: Joi.string().required().description('URL connection redis'),
  AUTH_GOOGLE_ID: Joi.string().required().description('Auth google ID'),
  AUTH_GOOGLE_SECRET: Joi.string().required().description('Auth google Secret'),
  API_PREFIX: Joi.string().default('api/v1').description('API route prefix'),
});
