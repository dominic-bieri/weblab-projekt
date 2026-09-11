export interface Photo {
  id: string;
  filename: string;
  mimeType: string;
  captureDate: string;
  description: string;
  photoUrl: string;
  challengeId: string | null;
}
