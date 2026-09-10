import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export class ChallengeDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  description: string;

  @Matches(DATE_ONLY, { message: 'startDate must be in format YYYY-MM-DD' })
  @IsISO8601(
    { strict: true },
    { message: 'startDate is not a valid calendar date' },
  )
  startDate: string;

  @Matches(DATE_ONLY, { message: 'endDate must be in format YYYY-MM-DD' })
  @IsISO8601(
    { strict: true },
    { message: 'endDate is not a valid calendar date' },
  )
  endDate: string;
}
