import { Module, forwardRef } from '@nestjs/common';
import { GraphQLContextFactory } from './graphql-context.factory';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [GraphQLContextFactory],
  exports: [GraphQLContextFactory],
})
export class ContextModule {}
