import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@bigticket/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
