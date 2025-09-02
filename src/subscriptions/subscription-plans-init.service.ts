import { Injectable, OnModuleInit } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';

@Injectable()
export class SubscriptionPlansInitService implements OnModuleInit {
  constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

  async onModuleInit() {
    await this.subscriptionPlansService.createDefaultPlans();
  }
}
