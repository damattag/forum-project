import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository';
import { SendNotificationUseCase } from './send-notification.usecase';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: '1',
			title: 'This is the send title',
			content: 'This is the send content',
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification);
	});
});
