export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Muss zum Backend passen (@MaxLength in challenge.dto.ts).
export const TITLE_MAX_LENGTH = 50;
