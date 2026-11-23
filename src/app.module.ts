import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { RentalsModule } from './rentals/rentals.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { CarsModule } from './cars/cars.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ConfigModuleRoot } from './config/config.module.js';
import { ConfigTypOrmModule } from './config/configTypOrm.module.js';
import { PostsModule } from './posts/posts.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { FileUploadModule } from './file-upload/file-upload.module.js';
import { MailModule } from './mail/mail.module.js';
import morgan from 'morgan';
import { AuthModule } from './auth/auth.module.js';
import { JwtConfigModule } from './config/jwt.module.js';
import { PassportModule } from '@nestjs/passport';
import { ChatModule } from './chat/chat.module.js';
import { searchModule } from './search/search.module.js';
import { ProfanityFilterService } from './profinafy.service.js';
import { ProfanityValidator } from './posts/decorators/wordValidator.decorator.js';
import { DemoSeedService } from './seed/demo-seed.service.js';

@Module({
  imports: [
    ConfigModuleRoot,
    ConfigTypOrmModule,
    PostsModule,
    NotificationsModule,
    UsersModule,
    RentalsModule,
    AddressesModule,
    CarsModule,
    ReviewsModule,
    FileUploadModule,
    MailModule,
    AuthModule,
    JwtConfigModule,
    PassportModule.register({ session: true }),
    ChatModule,
    searchModule,
  ],
  controllers: [],
  providers: [ProfanityFilterService, ProfanityValidator, DemoSeedService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('dev')).forRoutes('*');
  }
}
