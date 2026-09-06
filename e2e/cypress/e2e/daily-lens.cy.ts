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

const testIdSelector = (testId: string) => cy.get(`[data-testid="${testId}"]`);

describe('daily-lens', () => {
  it('registriert sich, lädt ein Foto hoch und meldet sich wieder ab', () => {
    const run = Date.now();
    const description = `Cypress Journey ${run}`;

    cy.visit('/');
    languageSwitch();
    registerNewUser(run);
    expectEmptyGallery();
    uploadPhoto(description);
    expectPhotoInGallery(description);
    verifyCalendarView(description);
    const editedDescription = editPhoto(`${description} edited`);
    expectPhotoInGallery(editedDescription, EDITED_CAPTURE_DATE_SHOWN);
    deletePhoto();
    expectEmptyGallery();
    createAndDeleteChallenge();
    logout();
  });
});

function languageSwitch() {
  switchLanguage('de', 'Deutsch');
  testIdSelector('register-button').should('contain.text', 'Registrieren');
  switchLanguage('en', 'English');
  testIdSelector('register-button').should('contain.text', 'Register');
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

function expectEmptyGallery() {
  testIdSelector('picture-card').should('not.exist');
}

function uploadPhoto(description: string) {
  testIdSelector('file-input').selectFile(TEST_PHOTO, { force: true });
  testIdSelector('file-name').should('contain.text', 'Test.png');
  testIdSelector('capture-date-input').type(CAPTURE_DATE_INPUT, { force: true });
  testIdSelector('description-input').type(description, { force: true });
  testIdSelector('upload-button').click();
}

function expectPhotoInGallery(description: string, captureDateShown = CAPTURE_DATE_SHOWN) {
  testIdSelector('picture-card').should('have.length', 1);
  testIdSelector('picture-card-description').should('have.text', description);
  testIdSelector('picture-card-date').should('contain.text', captureDateShown);
}

function verifyCalendarView(description: string) {
  testIdSelector('nav-link-calendar').click();
  testIdSelector('calendar-day-filled').should('have.length', 1).click();
  testIdSelector('picture-card-description').should('have.text', description);
  testIdSelector('nav-link-home').click();
}

function editPhoto(description: string): string {
  testIdSelector('picture-card-edit-button').click();
  testIdSelector('picture-card-date-input').clear().type(EDITED_CAPTURE_DATE_INPUT, { force: true });
  testIdSelector('picture-card-description-input')
    .clear({ force: true })
    .type(description, { force: true });
  testIdSelector('picture-card-save-button').click();
  return description;
}

function deletePhoto() {
  testIdSelector('picture-card-delete-button').click();
}

function createAndDeleteChallenge() {
  testIdSelector('nav-link-challenge').click();

  testIdSelector('challenge-title-input').type(CHALLENGE_TITLE, { force: true });
  testIdSelector('challenge-start-date-input').type(CHALLENGE_START_INPUT, { force: true });
  testIdSelector('challenge-end-date-input').type(CHALLENGE_END_INPUT, { force: true });
  testIdSelector('challenge-description-input').type(CHALLENGE_DESCRIPTION, { force: true });
  testIdSelector('create-challenge-button').click();

  testIdSelector('challenge-card').should('have.length', 1);
  testIdSelector('challenge-card-title').should('have.text', CHALLENGE_TITLE);
  testIdSelector('challenge-card-description').should('have.text', CHALLENGE_DESCRIPTION);

  testIdSelector('challenge-card-delete-button').click();
  testIdSelector('challenge-card').should('not.exist');

  testIdSelector('nav-link-home').click();
}

function logout() {
  testIdSelector('logout-button').contains('Logout').click();
  cy.location('pathname').should('eq', '/login');
  testIdSelector('login-button').should('be.visible').contains('Login');
}

function switchLanguage(langCode: string, expectedLabel: string) {
  testIdSelector('language-select').click({ force: true });
  cy.get(`[data-testid="language-option-${langCode}"]`).click();
  testIdSelector('language-select').should('contain.text', expectedLabel);
}
