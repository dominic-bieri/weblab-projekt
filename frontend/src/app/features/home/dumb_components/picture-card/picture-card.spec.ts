import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PictureCard } from './picture-card';

describe('PictureCard', () => {
  let component: PictureCard;
  let fixture: ComponentFixture<PictureCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PictureCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
