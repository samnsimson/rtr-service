import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCustomerInput } from './dto/create-customer.dto';
import { CreateStripePriceInput, CreateStripeProductInput } from './dto/stripe-product.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY', ''));
  }

  private toCents(amount: number): number {
    return Number.isInteger(amount) ? amount : Math.round(amount * 100);
  }

  async createCustomer({ name, email, phone, userId, organizationId }: CreateCustomerInput): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({ name, email, phone, metadata: { userId, organizationId } });
  }

  async createSubscription(customerId: string, planId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async createPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.create({ customer: customerId, type: 'card', card: { token: paymentMethodId } });
  }

  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({ amount, currency });
  }

  async createCharge(amount: number, currency: string, customerId: string): Promise<Stripe.Charge> {
    return await this.stripe.charges.create({ amount, currency, customer: customerId });
  }

  async createInvoice(customerId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.create({ customer: customerId });
  }

  async createInvoiceItem(invoiceId: string, amount: number, currency: string): Promise<Stripe.InvoiceItem> {
    return await this.stripe.invoiceItems.create({ invoice: invoiceId, amount, currency, customer: '' });
  }

  async createRefund(chargeId: string): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({ charge: chargeId });
  }

  async createProduct({ name, description }: CreateStripeProductInput): Promise<Stripe.Product> {
    return await this.stripe.products.create({
      name,
      description,
      type: 'service',
      shippable: false,
      active: true,
    });
  }

  async createPrice({ productId, amount, currency, interval }: CreateStripePriceInput): Promise<Stripe.Price> {
    return await this.stripe.prices.create({
      product: productId,
      unit_amount: this.toCents(amount),
      currency,
      recurring: { interval },
      billing_scheme: 'per_unit',
      active: true,
    });
  }

  async createPaymentLink(priceId: string): Promise<Stripe.PaymentLink> {
    return await this.stripe.paymentLinks.create({
      submit_type: 'subscribe',
      line_items: [{ price: priceId, quantity: 1, adjustable_quantity: { enabled: false } }],
      tax_id_collection: { enabled: true },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      currency: 'usd',
    });
  }
}
