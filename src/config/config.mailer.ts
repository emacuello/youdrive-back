import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const MailerConfig = {
  transport: {
    host: process.env.MAILER_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAILER_PORT) || 587,
    secure: Number(process.env.MAILER_PORT) === 465,
    auth: {
      user: process.env.MAILER_AUTH_USER,
      pass: process.env.MAILER_AUTH_PASS,
    },
  },
  defaults: {
    from: process.env.MAILER_FROM || '"No Reply" <no.reply@example.com>',
  },
  template: {
    dir: join(import.meta.dirname, '..', 'mail', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
