import { AggregateRoot } from '../entities/aggregate-root';
import type { UniqueEntityId } from '../entities/unique-entity-id';
import type { DomainEvent } from './domain-event';
import { DomainEvents } from './domains-events';

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe('domain events', () => {
	it('should be able to dispatch and listen to events', () => {
		const callbackSpy = vi.fn();

		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents.length).toBe(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalled();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
