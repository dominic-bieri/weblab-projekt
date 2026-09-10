import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { Navigation } from './navigation';
import { AuthService } from '../../core/auth/auth.service';

const links = [
  { path: 'home', label: 'Home' },
  { path: 'challenge', label: 'Challenge' },
];

class FakeBreakpointObserver {
  private readonly state$ = new BehaviorSubject<BreakpointState>({
    matches: false,
    breakpoints: {},
  });

  setHandset(matches: boolean): void {
    this.state$.next({ matches, breakpoints: {} });
  }

  observe(): Observable<BreakpointState> {
    return this.state$.asObservable();
  }
}

async function createFixture(
  breakpoints: FakeBreakpointObserver,
): Promise<ComponentFixture<Navigation>> {
  await TestBed.configureTestingModule({
    imports: [Navigation],
    providers: [
      provideRouter([]),
      provideTranslateService(),
      { provide: BreakpointObserver, useValue: breakpoints },
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

  const fixture = TestBed.createComponent(Navigation);
  fixture.componentRef.setInput('links', links);
  await fixture.whenStable();
  return fixture;
}

describe('Navigation', () => {
  let breakpoints: FakeBreakpointObserver;

  beforeEach(() => {
    breakpoints = new FakeBreakpointObserver();
  });

  function el(fixture: ComponentFixture<Navigation>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  it('should create', async () => {
    const fixture = await createFixture(breakpoints);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows inline links in the toolbar on wide viewports', async () => {
    const fixture = await createFixture(breakpoints);

    expect(el(fixture).querySelectorAll('nav.nav-links a').length).toBe(links.length);
    expect(el(fixture).querySelector('[data-testid="nav-menu-toggle"]')).toBeFalsy();
  });

  it('collapses into a sidenav drawer on handset viewports', async () => {
    breakpoints.setHandset(true);
    const fixture = await createFixture(breakpoints);

    const toggle = el(fixture).querySelector<HTMLButtonElement>('[data-testid="nav-menu-toggle"]');
    expect(toggle).toBeTruthy();
    expect(el(fixture).querySelector('nav.nav-links')).toBeFalsy();

    toggle!.click();
    await fixture.whenStable();

    const drawerLinks = el(fixture).querySelectorAll('mat-sidenav [data-testid^="nav-link-"]');
    expect(drawerLinks.length).toBe(links.length);
  });
});
