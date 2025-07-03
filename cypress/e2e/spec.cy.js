describe('My First Test', () => {
  it('navigates to login and register pages', () => {
    cy.visit('http://212.83.131.82:4200/')

    // Clique sur le bouton Login
    cy.get('a.nav-link[href="/user"]').click()

    // Vérifie que l'URL est bien /user
    cy.url().should('eq', 'http://212.83.131.82:4200/user')

    // Clique sur le lien S'inscrire
    cy.get('a.register-btn[href="/register"]').click()

    // Vérifie que l'URL est bien /register
    cy.url().should('eq', 'http://212.83.131.82:4200/register')
  })
})