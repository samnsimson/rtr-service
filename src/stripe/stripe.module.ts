import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';

@Module({
  providers: [StripeResolver, StripeService],
  exports: [StripeService],
})
export class StripeModule {}
