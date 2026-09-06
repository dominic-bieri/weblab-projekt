import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  // reines Kalenderdatum ohne Zeit/Zeitzone -> Postgres 'date', TypeORM gibt einen String zurück
  @Column({ type: 'date' })
  captureDate: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  challengeId: string | null;
}
