describe("Appropriate authentication redirects", () => {
	it("Redirects /accounts to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/accounts")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /accounts when authenticated", () => {
		cy.login("/accounts")
	})
})

describe("Creating accounts", () => {
	it("Cannot create an account with invalid data", () => {
		cy.login("/accounts")

		cy.get("[data-cy=add-account-button]").click()

		cy.get("[data-cy=add-button]").should("be.disabled")

		cy.get("[data-cy=amount-input]").clear().type("-1")

		cy.get("[data-cy=add-button]").should("be.disabled")
	})

	it("Can create an account", () => {
		cy.intercept("POST", "/api/accounts").as("createAccount")
		cy.login("/accounts")

		cy.get("[data-cy=add-account-button]").click()
		cy.get("[data-cy=name-input]").type("Test Account 1")
		cy.get("[data-cy=amount-input]").clear().type("1000")

		cy.get("[data-cy=add-button]").should("be.enabled")

		cy.get("[data-cy=add-button]").focus().click()

		cy.wait("@createAccount").its("response.statusCode").should("eq", 200)
		cy.contains("Test Account 1").should("exist")
		cy.contains("$1000.00").should("exist")
	})
})

describe("Reading accounts", () => {
	it("Can read accounts", () => {
		cy.intercept("GET", "/api/accounts").as("getAccounts")
		cy.login("/accounts")

		cy.wait("@getAccounts").its("response.statusCode").should("eq", 200)

		cy.get(".chakra-stack .chakra-card").should("have.length", 6)
		cy.contains("Test Account 1").should("exist")
		cy.contains("$1000.00").should("exist")
	})

	it("Can read accounts sorted in all ways", () => {
		cy.intercept("GET", "/api/accounts").as("getAccounts")
		cy.login("/accounts")

		cy.wait("@getAccounts").its("response.statusCode").should("eq", 200)

		const getTexts = () =>
			cy.document().then(doc =>
				Array.from(doc.querySelectorAll(".chakra-stack .chakra-card"))
					.map(card => Array.from(card.querySelectorAll("p")).map(p => p.innerText))
					.map(([name, amount]) => [name, +amount.slice(1)] as const)
			)

		getTexts().then(texts => {
			cy.get("[data-cy=name-asc-radio]").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => a[0].localeCompare(b[0]))
			)

			cy.get("[data-cy=name-desc-radio]").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => b[0].localeCompare(a[0]))
			)

			cy.get("[data-cy=balance-asc-radio]").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => a[1] - b[1])
			)

			cy.get("[data-cy=balance-desc-radio]").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => b[1] - a[1])
			)
		})
	})
})

describe("Updating accounts", () => {
	it("Cannot update an account with invalid data", () => {
		cy.login("/accounts")

		cy.contains("Test Account 1").first().click()
		cy.get("[data-cy=name-input]").clear()

		cy.get("[data-cy=edit-button]").should("be.disabled")
	})

	it("Can update an account", () => {
		cy.intercept("PUT", "/api/accounts/*").as("updateAccount")
		cy.login("/accounts")

		cy.contains("Test Account").first().click()
		cy.get("[data-cy=name-input]").clear().type("Test Account 2")
		cy.get("[data-cy=edit-button]").click()

		cy.wait("@updateAccount").its("response.statusCode").should("eq", 200)
		cy.contains("Test Account 2").should("exist")
	})
})

describe("Deleting accounts", () => {
	it("Cannot delete an account with transactions", () => {
		cy.intercept("DELETE", "/api/accounts/*").as("deleteAccount")
		cy.login("/accounts")

		cy.get(".chakra-stack .chakra-card").not(':contains("Test Account 2")').first().click()
		cy.get("[data-cy=delete-button]").click()
		cy.get("[data-cy=delete-confirm-button]").click()

		cy.wait("@deleteAccount").its("response.statusCode").should("eq", 400)
		cy.toasts(["Transactions associated with this account exist"])
	})

	it("Can delete an account", () => {
		cy.intercept("DELETE", "/api/accounts/*").as("deleteAccount")
		cy.login("/accounts")

		cy.contains("Test Account 2").first().click()
		cy.get("[data-cy=delete-button]").click()
		cy.get("[data-cy=delete-confirm-button]").click()

		cy.wait("@deleteAccount").its("response.statusCode").should("eq", 200)
	})
})
