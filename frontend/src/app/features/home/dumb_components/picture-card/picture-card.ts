import {Component, input} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from '@angular/material/card';
import {DatePipe, NgOptimizedImage} from '@angular/common';

@Component({
  imports: [
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardTitle,
    NgOptimizedImage,
    DatePipe
  ],
  selector: 'app-picture-card',
  styleUrl: './picture-card.css',
  templateUrl: './picture-card.html',
})
export class PictureCard {

  imageSource = input.required<string>();
  captureDate = input.required<Date>();
  description = input.required<string>();

}
