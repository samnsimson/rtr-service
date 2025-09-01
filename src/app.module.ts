import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RecruiterProfileModule } from './recruiter-profile/recruiter-profile.module';
import { CandidateProfileModule } from './candidate-profile/candidate-profile.module';
import { JobsModule } from './jobs/jobs.module';
import { RtrModule } from './rtr/rtr.module';
import { RtrHistoryModule } from './rtr-history/rtr-history.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
    }),
    UsersModule,
    RecruiterProfileModule,
    CandidateProfileModule,
    JobsModule,
    RtrModule,
    RtrHistoryModule,
    JobApplicationsModule,
    DocumentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
