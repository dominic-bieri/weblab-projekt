const KEYCLOAK_ORIGIN = 'http://localhost:8080';

const CAPTURE_DATE_INPUT = '9/5/2026';
const CAPTURE_DATE_SHOWN = '09/05/2026';
const EDITED_CAPTURE_DATE_INPUT = '9/6/2026';
const EDITED_CAPTURE_DATE_SHOWN = '09/06/2026';
const TEST_PHOTO = 'cypress/fixtures/Test.png';

const CHALLENGE_TITLE = 'Cypress Architecture Week';
const CHALLENGE_START_INPUT = '9/1/2026';
const CHALLENGE_END_INPUT = '9/14/2026';
const CHALLENGE_DESCRIPTION = 'Only architecture shots';
const EDITED_CHALLENGE_TITLE = 'Cypress Portrait Week';
const EDITED_CHALLENGE_DESCRIPTION = 'Only portrait shots';
const CHALLENGE_PHOTO_DESCRIPTION = 'Cypress Challenge Photo';
const CALENDAR_EDITED_DESCRIPTION = 'Cypress Challenge Photo edited in calendar';

const testIdSelector = (testId: string) => cy.get(`[data-testid="${testId}"]`);

describe('daily-lens', () => {
  it('User Journey', () => {
    const run = Date.now();
    const description = `Cypress Journey ${run}`;

    cy.visit('/');
    languageSwitch();

    registerNewUser(run);

    expectEmptyGallery();
    rejectInvalidFile();
    uploadPhoto(description);
    expectPhotoInGallery(description);
    verifyCalendarView(description);
    cancelPhotoDelete();
    const editedDescription = editPhoto(`${description} edited`);
    expectPhotoInGallery(editedDescription, EDITED_CAPTURE_DATE_SHOWN);
    deletePhoto();
    expectEmptyGallery();
    expectStreakBadge();

    createChallenge();
    editChallenge();
    expectChallengeDetailEmpty();
    assignPhotoToChallenge();
    expectChallengeDetailHasPhoto();
    deleteChallenge();
    editAndDeletePhotoInCalendar();

    logout();
    loginExistingUser(run);
    logoutFromMobileMenu();
  });
});

function languageSwitch() {
  switchLanguage('de', 'Deutsch');
  testIdSelector('register-button').should('contain.text', 'Registrieren');
  switchLanguage('en', 'English');
  testIdSelector('register-button').should('contain.text', 'Register');
}

function switchLanguage(langCode: string, expectedLabel: string) {
  testIdSelector('language-select').click({ force: true });
  testIdSelector(`language-option-${langCode}`).click();
  testIdSelector('language-select').should('contain.text', expectedLabel);
}

function registerNewUser(run: number) {
  cy.visit('/login');
  testIdSelector('register-button').should('be.visible').contains('Register').click();

  cy.origin(
    KEYCLOAK_ORIGIN,
    {
      args: {
        username: `e2e-user-${run}`,
        email: `e2e-user-${run}@daily-lens.test`,
        password: `e2e-Pw-${run}`,
      },
    },
    (user) => {
      cy.get('#kc-register-form').within(() => {
        cy.get('#username').type(user.username);
        cy.get('#password').type(user.password);
        cy.get('#password-confirm').type(user.password);
        cy.get('#email').type(user.email);
        cy.get('input[type="submit"]').click();
      });
    },
  );

  cy.location('pathname').should('eq', '/home');
  testIdSelector('logout-button').should('be.visible');
}

function loginExistingUser(run: number) {
  testIdSelector('login-button').click();

  cy.origin(
    KEYCLOAK_ORIGIN,
    { args: { username: `e2e-user-${run}`, password: `e2e-Pw-${run}` } },
    (user) => {
      cy.get('#kc-form-login').within(() => {
        cy.get('#username').type(user.username);
        cy.get('#password').type(user.password);
        cy.get('input[type="submit"], button[type="submit"]').click();
      });
    },
  );

  cy.location('pathname').should('eq', '/home');
  testIdSelector('logout-button').should('be.visible');
}

function expectEmptyGallery() {
  testIdSelector('photo-card').should('not.exist');
}

function rejectInvalidFile() {
  testIdSelector('file-input').selectFile(
    { contents: TEST_PHOTO, fileName: 'Test.png', mimeType: 'text/plain' },
    { force: true },
  );
  testIdSelector('file-error').should('be.visible');
  testIdSelector('upload-button').should('be.disabled');
}

function uploadPhoto(description: string, challengeTitle?: string) {
  testIdSelector('file-input').selectFile(TEST_PHOTO, { force: true });
  testIdSelector('file-name').should('contain.text', 'Test.png');
  testIdSelector('capture-date-input').type(CAPTURE_DATE_INPUT, { force: true });
  testIdSelector('description-input').type(description, { force: true });
  if (challengeTitle) {
    testIdSelector('challenge-select').click({ force: true });
    testIdSelector(`challenge-option-${challengeTitle}`).click();
  }
  testIdSelector('upload-button').click();
}

function expectPhotoInGallery(description: string, captureDateShown = CAPTURE_DATE_SHOWN) {
  testIdSelector('photo-card').should('have.length', 1);
  testIdSelector('photo-card-description').should('have.text', description);
  testIdSelector('photo-card-date').should('contain.text', captureDateShown);
}

function verifyCalendarView(description: string) {
  testIdSelector('nav-link-calendar').click();
  testIdSelector('calendar-day-filled').should('have.length', 1).click();
  testIdSelector('photo-card-description').should('have.text', description);

  testIdSelector('calendar-next-month').click();
  testIdSelector('calendar-day-filled').should('not.exist');
  testIdSelector('calendar-today').click();
  testIdSelector('calendar-day-filled').should('have.length', 1);

  testIdSelector('nav-link-home').click();
}

function cancelPhotoDelete() {
  testIdSelector('photo-card-delete-button').click();
  testIdSelector('delete-dialog-cancel-button').click();
  testIdSelector('photo-card').should('have.length', 1);
}

function editPhoto(description: string): string {
  testIdSelector('photo-card-edit-button').click();
  testIdSelector('photo-card-date-input')
    .clear()
    .type(EDITED_CAPTURE_DATE_INPUT, { force: true });
  testIdSelector('photo-card-description-input')
    .clear({ force: true })
    .type(description, { force: true });
  testIdSelector('photo-card-save-button').click();
  return description;
}

function deletePhoto() {
  testIdSelector('photo-card-delete-button').click();
  testIdSelector('delete-dialog-confirm-button').click();
}

function expectStreakBadge() {
  const today = new Date();
  const todayInput = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  testIdSelector('file-input').selectFile(TEST_PHOTO, { force: true });
  testIdSelector('capture-date-input').type(todayInput, { force: true });
  testIdSelector('description-input').type('Cypress Streak Check', { force: true });
  testIdSelector('upload-button').click();

  testIdSelector('streak-badge-count').should('have.text', '1');

  deletePhoto();
  expectEmptyGallery();
}

function createChallenge() {
  testIdSelector('nav-link-challenge').click();

  testIdSelector('challenge-title-input').type(CHALLENGE_TITLE, { force: true });
  testIdSelector('challenge-start-date-input').type(CHALLENGE_START_INPUT, { force: true });
  testIdSelector('challenge-end-date-input').type(CHALLENGE_END_INPUT, { force: true });
  testIdSelector('challenge-description-input').type(CHALLENGE_DESCRIPTION, { force: true });
  testIdSelector('create-challenge-button').click();

  testIdSelector('challenge-card').should('have.length', 1);
  testIdSelector('challenge-card-title').should('have.text', CHALLENGE_TITLE);
  testIdSelector('challenge-card-description').should('have.text', CHALLENGE_DESCRIPTION);
}

function editChallenge() {
  testIdSelector('challenge-card-edit-button').click();
  testIdSelector('challenge-card-title-input')
    .clear({ force: true })
    .type(EDITED_CHALLENGE_TITLE, { force: true });
  testIdSelector('challenge-card-description-input')
    .clear({ force: true })
    .type(EDITED_CHALLENGE_DESCRIPTION, { force: true });
  testIdSelector('challenge-card-save-button').click();

  testIdSelector('challenge-card-title').should('have.text', EDITED_CHALLENGE_TITLE);
  testIdSelector('challenge-card-description').should('have.text', EDITED_CHALLENGE_DESCRIPTION);
}

function expectChallengeDetailEmpty() {
  testIdSelector('challenge-card-view-photos-link').click();
  testIdSelector('challenge-detail-title').should('have.text', EDITED_CHALLENGE_TITLE);
  testIdSelector('challenge-detail-empty').should('be.visible');
  testIdSelector('challenge-progress-label').should('contain.text', '0 / 14');
  testIdSelector('challenge-progress-bar').should('have.attr', 'aria-valuenow', '0');
  testIdSelector('challenge-detail-back-link').click();
}

function assignPhotoToChallenge() {
  testIdSelector('nav-link-home').click();
  uploadPhoto(CHALLENGE_PHOTO_DESCRIPTION, EDITED_CHALLENGE_TITLE);
  expectPhotoInGallery(CHALLENGE_PHOTO_DESCRIPTION);
  testIdSelector('photo-card-challenge').should('have.text', EDITED_CHALLENGE_TITLE);
}

function expectChallengeDetailHasPhoto() {
  testIdSelector('nav-link-challenge').click();
  testIdSelector('challenge-card-view-photos-link').click();
  testIdSelector('challenge-detail-title').should('have.text', EDITED_CHALLENGE_TITLE);
  testIdSelector('photo-tile').should('have.length', 1);
  testIdSelector('challenge-progress-label').should('contain.text', '1 / 14');
  testIdSelector('challenge-progress-bar').should('have.attr', 'aria-valuenow', '7');
  testIdSelector('challenge-detail-back-link').click();
}

function deleteChallenge() {
  testIdSelector('challenge-card-delete-button').click();
  testIdSelector('delete-dialog-confirm-button').click();
  testIdSelector('challenge-card').should('not.exist');
}

function editAndDeletePhotoInCalendar() {
  testIdSelector('nav-link-calendar').click();
  testIdSelector('calendar-day-filled').should('have.length', 1).click();

  testIdSelector('photo-card-edit-button').click();
  testIdSelector('photo-card-description-input')
    .clear({ force: true })
    .type(CALENDAR_EDITED_DESCRIPTION, { force: true });
  testIdSelector('photo-card-save-button').click();
  testIdSelector('photo-card-description').should('have.text', CALENDAR_EDITED_DESCRIPTION);

  testIdSelector('photo-card-delete-button').click();
  testIdSelector('delete-dialog-confirm-button').click();
  testIdSelector('calendar-day-filled').should('not.exist');

  testIdSelector('nav-link-home').click();
  expectEmptyGallery();
}

function logout() {
  testIdSelector('logout-button').contains('Logout').click();
  cy.location('pathname').should('eq', '/login');
  testIdSelector('login-button').should('be.visible').contains('Login');
}

function logoutFromMobileMenu() {
  cy.viewport('iphone-6');
  testIdSelector('nav-menu-toggle').click();
  testIdSelector('logout-button').contains('Logout').click();
  cy.location('pathname').should('eq', '/login');
  testIdSelector('login-button').should('be.visible').contains('Login');
}
