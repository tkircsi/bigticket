import { Subjects, Publisher, PaymentCreatedEvent } from '@bigticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
