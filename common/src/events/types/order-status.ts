export enum OrderStatus {
  // when order created, but has not benn reserved
  Created = 'created',

  // The ticket the order is trying to reserve has already benn reserved,
  // or when the user has cancelled the order
  // or order expires before payment
  Cancelled = 'cancelled',

  // The order successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // reserved and payed successfully
  Complete = 'complete',
}
