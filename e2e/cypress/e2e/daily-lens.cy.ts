const KEYCLOAK_ORIGIN = 'http://localhost:8080';

const CAPTURE_DATE_INPUT = '9/5/2026';
const CAPTURE_DATE_SHOWN = '05.09.2026';
const TEST_PHOTO = 'cypress/fixtures/Test.png';

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
  testIdSelector('description-input').type(description);
  testIdSelector('upload-button').click();
}

function expectPhotoInGallery(description: string) {
  testIdSelector('picture-card').should('have.length', 1);
  testIdSelector('picture-card-description').should('have.text', description);
  testIdSelector('picture-card-date').should('contain.text', CAPTURE_DATE_SHOWN);
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
