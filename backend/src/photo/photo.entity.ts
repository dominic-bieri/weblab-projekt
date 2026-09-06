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

  @Column({ type: 'timestamptz' })
  captureDate: Date;

  @Column({ type: 'text' })
  description: string;
}
