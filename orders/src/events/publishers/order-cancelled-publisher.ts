import { Publisher, OrderCancelledEvent, Subjects } from '@bigticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
