import type { Repository } from 'typeorm';
import { StreakService } from './streak.service.js';
import type { Photo } from '../photo/photo.entity.js';

function fakeRepository(captureDates: string[]): Repository<Photo> {
  return {
    find: vi.fn(async () =>
      captureDates.map((captureDate) => ({ captureDate })),
    ),
  } as unknown as Repository<Photo>;
}

describe('StreakService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 10));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 and no dates for a user without photos', async () => {
    const service = new StreakService(fakeRepository([]));

    await expect(service.getStreak('user-1')).resolves.toEqual({
      streak: 0,
      dates: [],
    });
  });

  it('derives the streak and its dates from the captured photo dates', async () => {
    const service = new StreakService(
      fakeRepository(['2026-09-08', '2026-09-09', '2026-09-10']),
    );

    await expect(service.getStreak('user-1')).resolves.toEqual({
      streak: 3,
      dates: ['2026-09-10', '2026-09-09', '2026-09-08'],
    });
  });

  it('only queries the requesting user, selecting just captureDate', async () => {
    const repository = fakeRepository([]);
    const service = new StreakService(repository);

    await service.getStreak('user-42');

    expect(repository.find).toHaveBeenCalledWith({
      where: { userId: 'user-42' },
      select: { captureDate: true },
    });
  });
});
