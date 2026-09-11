import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

export async function assertOwnership<T extends { id: string; userId: string }>(
  repository: Repository<T>,
  entityName: string,
  id: string,
  userId: string,
): Promise<void> {
  const owned = await repository.existsBy({ id, userId } as never);
  if (!owned) {
    throw new NotFoundException(`${entityName} ${id} not found`);
  }
}
