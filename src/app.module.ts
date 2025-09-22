import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RecruiterProfileModule } from './recruiter-profile/recruiter-profile.module';
import { CandidateProfileModule } from './candidate-profile/candidate-profile.module';
import { JobsModule } from './jobs/jobs.module';
import { RTRModule } from './rtr/rtr.module';
import { RTRHistoryModule } from './rtr-history/rtr-history.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { graphqlValidationConfig } from './common/config/graphql-validation.config';
import { SearchModule } from './search/search.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { RtrTemplateModule } from './rtr-template/rtr-template.module';
import { LoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.intercetor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OverviewModule } from './overview/overview.module';
import { EventsModule } from './common/events/events.module';
import './common/enums';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
      ...graphqlValidationConfig,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    EventsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RecruiterProfileModule),
    forwardRef(() => CandidateProfileModule),
    forwardRef(() => JobsModule),
    forwardRef(() => RTRModule),
    forwardRef(() => RTRHistoryModule),
    forwardRef(() => JobApplicationsModule),
    forwardRef(() => DocumentsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => SearchModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => SubscriptionsModule),
    forwardRef(() => EmailModule),
    forwardRef(() => RtrTemplateModule),
    forwardRef(() => OverviewModule),
  ],
  providers: [LoggerService, { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
