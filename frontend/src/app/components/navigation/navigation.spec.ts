import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Navigation } from './navigation';
import { AuthService } from '../../core/auth/auth.service';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: AuthService,
          useValue: {
            authenticated: signal(true),
            login: () => Promise.resolve(),
            register: () => Promise.resolve(),
            logout: () => Promise.resolve(),
          },
        },
      ],
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
