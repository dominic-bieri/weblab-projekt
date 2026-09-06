import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Challenge {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;
}
