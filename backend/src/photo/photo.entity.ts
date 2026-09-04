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

  @Column({ type: 'timestamptz', nullable: true })
  captureDate: Date | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
