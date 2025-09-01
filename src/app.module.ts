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
import { graphqlValidationConfig } from './common/config/graphql-validation.config';
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
      context: ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        let user: any = null;
        if (token) user = { token };
        return { req, user };
      },
      ...graphqlValidationConfig,
    }),
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
  ],
})
export class AppModule {}
