import { PaymentRepository } from "@/repositories/PaymentRepository";
import { OrderRepository } from "@/repositories/OrderRepository";
import { ForbiddenError, NotFoundError } from "@/utils/errors";
import type { Payment } from "@/types/commerce";
import type { User } from "@/types/user";

// Stripe isn't wired up yet — this records a 'pending' payment against an
// order so the schema/API shape is ready once the Stripe integration lands.
export const PaymentService = {
  async getById(id: number, actor: User): Promise<Payment> {
    const payment = await PaymentRepository.findById(id);
    if (!payment) throw new NotFoundError("Payment");

    if (actor.role !== "admin") {
      const order = await OrderRepository.findById(payment.orderId);
      if (!order || order.userId !== actor.id) throw new ForbiddenError();
    }

    return payment;
  },

  listByOrder: (orderId: number) => PaymentRepository.findByOrderId(orderId),
};
