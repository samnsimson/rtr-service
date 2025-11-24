import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionPlansResolver } from './subscription-plans.resolver';
import { SubscriptionPlansInitService } from './subscription-plans-init.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, SubscriptionPlan, User, Organization]), forwardRef(() => StripeModule)],
  providers: [SubscriptionsService, SubscriptionsResolver, SubscriptionPlansService, SubscriptionPlansResolver, SubscriptionPlansInitService],
  exports: [SubscriptionsService, SubscriptionPlansService],
})
export class SubscriptionsModule {}
