import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Photo {
  /** UUID – also the base name of the stored file on disk (`<id><ext>`). */
  @PrimaryColumn('uuid')
  id: string;

  /** Original file name as uploaded by the user, e.g. `vacation.jpg`. */
  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'timestamptz', nullable: true })
  captureDate: Date | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
