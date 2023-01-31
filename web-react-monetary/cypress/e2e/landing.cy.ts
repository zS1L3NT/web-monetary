describe("Appropriate button redirects", () => {
	it("Redirects / to /login on getting started when unauthenticated", () => {
		cy.visit("http://localhost:8000/")

		cy.get("[data-cy=get-started-button]").click()
		cy.location("pathname").should("eq", "/login")
	})

	it("Redirects / to /dashboard on getting started when authenticated", () => {
		cy.login("/")

		cy.get("[data-cy=get-started-button]").click()
		cy.location("pathname").should("eq", "/dashboard")
	})
})
