import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface DomainEvent {
	ocurredAt: Date;
	getAggregateId(): UniqueEntityId;
}
