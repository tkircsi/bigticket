import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 20,
    userId: 'boldi',
  });

  await ticket.save();

  const t1 = await Ticket.findById(ticket.id);
  const t2 = await Ticket.findById(ticket.id);

  t1!.set({ price: 10 });
  t2!.set({ price: 99 });

  await t1!.save();

  // throws an error because of version
  await expect(t2!.save()).rejects.toThrow();
  done();
});

it('increments the version number on multiple saves', async (done) => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 20,
    userId: 'boldi',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
  done();
});
