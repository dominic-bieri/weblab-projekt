import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    fixture.componentRef.setInput('links', [
      { path: 'home', label: 'Home' },
      { path: 'challenge', label: 'Challenge' },
    ]);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a link per item', () => {
    const anchors = (fixture.nativeElement as HTMLElement).querySelectorAll('nav a');
    expect(anchors.length).toBe(2);
  });
});
