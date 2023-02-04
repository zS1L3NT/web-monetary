describe("Appropriate account authentication redirects", () => {
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
		cy.intercept("POST", "/api/accounts").as("createAccount")
		cy.login("/accounts")

		cy.el("add-account-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("account-name")
			.first()
			.invoke("text")
			.then(name => cy.el("name-input").type(name))

		cy.el("add-button").should("be.enabled")

		cy.el("add-button").click()

		cy.wait("@createAccount").its("response.statusCode").should("eq", 409)
		cy.toasts(["Account with that name already exists"])
	})

	it("Can create an account", () => {
		cy.intercept("POST", "/api/accounts").as("createAccount")
		cy.login("/accounts")

		cy.el("add-account-button").click()
		cy.el("name-input").type("Test Account 1")
		cy.el("amount-input").clear().type("1000")
		cy.el("add-button").focus().click()

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
		cy.el("account").should("have.length", 6)
		cy.contains("Test Account 1").should("exist")
		cy.contains("$1000.00").should("exist")
	})

	it("Can read accounts sorted in all ways", () => {
		cy.intercept("GET", "/api/accounts").as("getAccounts")
		cy.login("/accounts")

		cy.wait("@getAccounts").its("response.statusCode").should("eq", 200)
		cy.el("account-name").should("have.length", 6)

		const getTexts = () =>
			cy.document().then(doc =>
				Array.from(doc.querySelectorAll(".chakra-stack .chakra-card"))
					.map(card => Array.from(card.querySelectorAll("p")).map(p => p.innerText))
					.map(([name, amount]) => [name, +amount.slice(1)] as const)
			)

		getTexts().then(texts => {
			cy.el("name-asc-radio").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => a[0].localeCompare(b[0]))
			)

			cy.el("name-desc-radio").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => b[0].localeCompare(a[0]))
			)

			cy.el("balance-asc-radio").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => a[1] - b[1])
			)

			cy.el("balance-desc-radio").click().wait(500)
			getTexts().should(
				"deep.equal",
				[...texts].sort((a, b) => b[1] - a[1])
			)
		})
	})
})

describe("Updating accounts", () => {
	it("Cannot update an account with invalid data", () => {
		cy.intercept("PUT", "/api/accounts/*").as("updateAccount")
		cy.login("/accounts")

		cy.contains("Test Account 1").first().click()
		cy.el("name-input").clear()

		cy.el("edit-button").should("be.disabled")

		cy.el("account-name")
			.not(':contains("Test Account 1")')
			.first()
			.invoke("text")
			.then(name => cy.el("name-input").type(name))

		cy.el("edit-button").should("be.enabled")

		cy.el("edit-button").click()

		cy.wait("@updateAccount").its("response.statusCode").should("eq", 409)
		cy.toasts(["Account with that name already exists"])
	})

	it("Can update an account", () => {
		cy.intercept("PUT", "/api/accounts/*").as("updateAccount")
		cy.login("/accounts")

		cy.contains("Test Account").first().click()
		cy.el("name-input").clear().type("Test Account 2")
		cy.el("edit-button").click()

		cy.wait("@updateAccount").its("response.statusCode").should("eq", 200)
		cy.contains("Test Account 2").should("exist")
	})
})

describe("Deleting accounts", () => {
	it("Cannot delete an account with transactions", () => {
		cy.intercept("DELETE", "/api/accounts/*").as("deleteAccount")
		cy.login("/accounts")

		cy.el("account").not(':contains("Test Account 2")').first().click()
		cy.el("delete-account-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteAccount").its("response.statusCode").should("eq", 400)
		cy.toasts(["Transactions associated with this account exist"])
	})

	it("Can delete an account", () => {
		cy.intercept("DELETE", "/api/accounts/*").as("deleteAccount")
		cy.login("/accounts")

		cy.contains("Test Account 2").first().click()
		cy.el("delete-account-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteAccount").its("response.statusCode").should("eq", 200)
	})
})
