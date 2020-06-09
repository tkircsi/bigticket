import { Publisher, Subjects, TicketUpdatedEvent } from '@bigticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
