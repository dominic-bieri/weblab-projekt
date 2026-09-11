import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { assertOwnership } from './assert-ownership.js';

interface Owned {
  id: string;
  userId: string;
}

function fakeRepository(exists: boolean): Repository<Owned> {
  return { existsBy: async () => exists } as unknown as Repository<Owned>;
}

describe('assertOwnership', () => {
  it('resolves without throwing when the entity belongs to the user', async () => {
    await expect(
      assertOwnership(fakeRepository(true), 'Challenge', 'id-1', 'user-1'),
    ).resolves.toBeUndefined();
  });

  it('throws NotFoundException when the entity does not exist or belongs to someone else', async () => {
    await expect(
      assertOwnership(fakeRepository(false), 'Challenge', 'id-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('includes the entity name and id in the error message', async () => {
    await expect(
      assertOwnership(fakeRepository(false), 'Photo', 'abc-123', 'user-1'),
    ).rejects.toThrow('Photo abc-123 not found');
  });
});
