/// <reference types="cypress" />
Cypress.Commands.add("login", (pathname = "/dashboard") => {
	cy.visit("http://localhost:8000/login?continue=" + encodeURIComponent(pathname))

	cy.get("[data-cy=email-input]").type("zechariahtan144@gmail.com")
	cy.get("[data-cy=password-input]").type("P@ssw0rd")
	cy.get("[data-cy=login-button]").click()

	cy.wait(500)

	cy.closeToasts()
	cy.location("pathname").should("eq", pathname)
})

Cypress.Commands.add("push", (path: string) => {
	return cy.window().then(win => {
		win.$navigate(path)
		cy.wait(500)
	})
})

Cypress.Commands.add("closeToasts", () => {
	cy.get("button[aria-label=Close]").click({ multiple: true })
})

declare namespace Cypress {
	interface Chainable {
		login(path?: string): Chainable<AUTWindow>
		push(path: string): Chainable<AUTWindow>
		closeToasts(): Chainable<AUTWindow>
	}
}
