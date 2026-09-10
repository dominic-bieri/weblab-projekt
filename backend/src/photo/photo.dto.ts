import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export class PhotoDto {
  @Matches(DATE_ONLY, { message: 'captureDate must be in format YYYY-MM-DD' })
  @IsISO8601(
    { strict: true },
    { message: 'captureDate is not a valid calendar date' },
  )
  captureDate: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUUID()
  challengeId?: string | null;
}
