describe("Appropriate dashboard authentication redirects", () => {
	it("Redirects /dashboard to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/dashboard")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /dashboard when authenticated", () => {
		cy.login()
	})
})

describe("Accounts toggling", () => {
	const getChecked = () =>
		cy
			.get("[data-cy=account-checkbox] > input")
			.then(c => [...c].map(c => (<HTMLInputElement>c).checked))

	it("Can only select account if name is clicked", () => {
		cy.login()

		cy.el("account-name").first().click()

		getChecked().should("deep.equal", [true, false, false, false, false])
	})

	it("Can select multiple accounts", () => {
		cy.login()

		cy.el("account-name").first().click()
		cy.el("account-checkbox").eq(1).click()

		getChecked().should("deep.equal", [true, true, false, false, false])
	})

	it("Can only be toggled when clicking the checkbox", () => {
		cy.login()

		cy.el("account-name").first().click()
		cy.el("account-name").first().click()

		getChecked().should("deep.equal", [true, false, false, false, false])

		cy.el("account-checkbox").first().click()

		getChecked().should("deep.equal", [false, false, false, false, false])
	})
})

describe("Balance trend settings", () => {
	it("Can change settings", () => {
		cy.login()

		cy.el("balance-trend-option").click()

		cy.el("period-button").eq(1).click()
		cy.el("save-button").click()

		cy.wait(500).contains("Past 7 days").should("exist")
	})
})

describe("Spendings by Categories settings", () => {
	it("Can change settings", () => {
		cy.login()

		cy.el("spendings-categories-option").click()

		cy.el("period-button").eq(4).click()
		cy.el("save-button").click()

		cy.wait(500).contains("This Week").should("exist")
	})
})
