/// <reference types="cypress" />
let token

Cypress.Commands.add("login", (pathname = "/dashboard") => {
	if (token) {
		cy.intercept("GET", "/api/user").as("getUser")
		cy.window().then(win => {
			win.localStorage.setItem("token", token)
		})
	}

	cy.visit("http://localhost:8000/login?continue=" + encodeURIComponent(pathname))

	if (token) {
		cy.wait("@getUser").its("response.statusCode").should("eq", 200)
	} else {
		cy.get("[data-cy=email-input]").type("zechariahtan144@gmail.com")
		cy.get("[data-cy=password-input]").type("P@ssw0rd")
		cy.get("[data-cy=login-button]").click()
	}

	cy.location("pathname").should("eq", pathname)

	cy.window().then(win => {
		token = win.localStorage.getItem("token") as string
	})
})

Cypress.Commands.add("push", (path: string) => {
	return cy.window().then(win => {
		win.$navigate(path)
		cy.wait(500)

		if (path === "/logout") {
			token = undefined
		}
	})
})

declare namespace Cypress {
	interface Chainable {
		login(path?: string): Chainable<AUTWindow>
		push(path: string): Chainable<AUTWindow>
	}
}
