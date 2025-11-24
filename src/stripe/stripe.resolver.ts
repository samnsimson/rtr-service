import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { CreateStripePaymentLinkInput, CreateStripePriceInput, CreateStripeProductInput, StripeProductResponse } from './dto/stripe-product.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => StripeProductResponse)
  async createStripeProduct(@Args('createStripeProductInput') createStripeProductInput: CreateStripeProductInput): Promise<StripeProductResponse> {
    const product = await this.stripeService.createProduct(createStripeProductInput);
    return new StripeProductResponse(product);
  }

  @Mutation(() => StripeProductResponse)
  async createStripeProductPrice(@Args('createStripePriceInput') createStripePriceInput: CreateStripePriceInput): Promise<StripeProductResponse> {
    const price = await this.stripeService.createPrice(createStripePriceInput);
    return new StripeProductResponse(price);
  }

  @Mutation(() => StripeProductResponse)
  async createStripePaymentLink(@Args('createStripePaymentLinkInput') { priceId }: CreateStripePaymentLinkInput): Promise<StripeProductResponse> {
    const paymentLink = await this.stripeService.createPaymentLink(priceId);
    return new StripeProductResponse(paymentLink);
  }
}
