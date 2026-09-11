import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Challenge } from '../challenge/challenge.entity.js';

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

  @ManyToOne(() => Challenge, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'challengeId' })
  challenge: Challenge | null;

  @RelationId((photo: Photo) => photo.challenge)
  challengeId: string | null;
}
