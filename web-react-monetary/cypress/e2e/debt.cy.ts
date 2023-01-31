describe("Appropriate authentication redirects", () => {
	it("Redirects /debts to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/debts")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /debts when authenticated", () => {
		cy.login("/debts")
	})

	it("Redirects /debts/:id to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/debts/1")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /debts/:id when authenticated", () => {
		cy.login("/debts/1")
	})
})

describe("Creating debts", () => {
	it("Cannot create a debt with invalid data", () => {
		cy.login("/debts")

		cy.el("add-debt-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("amount-input").clear().type("1000")

		cy.el("add-button").should("be.disabled")
	})

	it("Can create a debt", () => {
		cy.intercept("POST", "/api/debts").as("createDebt")
		cy.login("/debts")

		cy.el("add-debt-button").click()

		cy.el("amount-input").clear().type("1000")
		cy.window()
			.then(win =>
				cy
					.get("[data-cy=date-time-input]")
					.type(
						new win.Date(win.Date.now() + 60 * 60 * 1000)
							.toLocaleString("sv")
							.replace(" ", "T")
							.slice(0, -3)
					)
			)
			.trigger("change")
		cy.el("name-input").type("Test Debt 1")

		cy.el("add-button").click()

		cy.wait("@createDebt").its("response.statusCode").should("eq", 200)
		cy.contains("Test Debt 1").should("exist")
	})
})

describe("Create debt transactions", () => {
	beforeEach(() => {
		cy.intercept("GET", "/api/debts/*").as("getDebt")
		cy.login("/debts")

		cy.contains("Test Debt 1").click()

		cy.wait("@getDebt").its("response.statusCode").should("eq", 200)
	})

	it("Cannot create a debt transaction with invalid data", () => {
		cy.el("add-debt-transaction-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("account-select").click()
		cy.el("account-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("category-select").click()
		cy.el("category-select-option").first().click()

		cy.el("add-button").should("be.disabled")
	})

	it("Can create a debt transaction", () => {
		cy.intercept("POST", "/api/transactions").as("createTransaction")
		cy.el("add-debt-transaction-button").click()

		cy.el("account-select").click()
		cy.el("account-select-option").first().click()
		cy.el("category-select").click()
		cy.el("category-select-option").first().click()
		cy.el("category-select").click()
		cy.el("amount-input").clear().type("500")
		cy.el("date-time-input").focus()
		cy.el("add-button").click()

		cy.wait("@createTransaction").its("response.statusCode").should("eq", 200)
		cy.contains("$500.00 left").should("exist")
		cy.contains("+$500.00").should("exist")
	})
})

describe("Reading debts", () => {
	it("Can read debts", () => {
		cy.intercept("GET", "/api/debts").as("getDebts")
		cy.login("/debts")

		cy.wait("@getDebts").its("response.statusCode").should("eq", 200)
		cy.get(".chakra-card").should("have.length", 7)
		cy.contains("Test Debt 1").should("exist")
		cy.contains("$500.00 left").should("exist")
	})

	it("Can read debts sorted by name", () => {
		cy.intercept("GET", "/api/debts").as("getDebts")
		cy.login("/debts")

		cy.wait("@getDebts").its("response.statusCode").should("eq", 200)

		const getNames = () =>
			cy
				.document()
				.then(doc =>
					Array.from(doc.querySelectorAll(".chakra-stack .chakra-card")).map(
						card => card.querySelector("h2").innerText
					)
				)

		getNames().then(names => {
			cy.el("name-asc-radio").click().wait(500)
			getNames().should(
				"deep.equal",
				[...names].sort((a, b) => a.localeCompare(b))
			)

			cy.el("name-desc-radio").click().wait(500)
			getNames().should(
				"deep.equal",
				[...names].sort((a, b) => b.localeCompare(a))
			)
		})
	})

	it("Cannot read a debt with invalid id", () => {
		cy.intercept("GET", "/api/debts/*").as("getDebt")
		cy.login("/debts/1")

		cy.wait("@getDebt").its("response.statusCode").should("eq", 404)
		cy.get("[role=alert]").should("have.text", "Debt not found")
		cy.toasts(["Debt not found"])
	})

	it("Can read a debt", () => {
		cy.intercept("GET", "/api/debts/*").as("getDebt")
		cy.login("/debts")

		cy.contains("Test Debt 1").click()

		cy.wait("@getDebt").its("response.statusCode").should("eq", 200)

		cy.contains("Test Debt 1").should("exist")
		cy.contains("Lend").should("exist")
		cy.contains("Active Debt").should("exist")
		cy.contains("$500.00 left").should("exist")
		cy.contains("Total: $1000.00").should("exist")
	})
})

describe("Read debt transactions", () => {
	it("Can read debt transactions", () => {
		cy.login("/debts")

		cy.contains("Test Debt 1").click()

		cy.contains("+$500.00").should("exist")
	})
})

describe("Update debt transactions", () => {
	it("Can update a debt transaction", () => {
		cy.intercept("PUT", "/api/transactions/*").as("updateTransaction")
		cy.login("/debts")

		cy.contains("Test Debt 1").click()
		cy.contains("+$500.00").click()
		cy.el("amount-input").clear().type("1000")
		cy.el("edit-button").focus().click()

		cy.wait("@updateTransaction").its("response.statusCode").should("eq", 200)
		cy.contains("+$1000.00").should("exist")
		cy.contains("Paid in exact").should("exist")

		cy.contains("+$1000.00").click()
		cy.el("amount-input").clear().type("2000")
		cy.el("edit-button").focus().click()

		cy.wait("@updateTransaction").its("response.statusCode").should("eq", 200)
		cy.contains("+$2000.00").should("exist")
		cy.contains("$1000.00 excess").should("exist")
	})
})

describe("Updating debts", () => {
	it("Cannot update a debt with invalid data", () => {
		cy.login("/debts")

		cy.contains("Test Debt 1").first().click()
		cy.el("edit-debt-button").click()
		cy.el("amount-input").clear()

		cy.el("edit-button").focus().should("be.disabled")

		cy.el("amount-input").type("2000")
		cy.el("name-input").clear()

		cy.el("edit-button").should("be.disabled")

		cy.el("date-time-input").type(
			new Date(Date.now() - 60 * 60 * 1000)
				.toLocaleString("sv")
				.replace(" ", "T")
				.slice(0, -3)
		)

		cy.el("edit-button").should("be.disabled")
	})

	it("Can update a debt", () => {
		cy.intercept("PUT", "/api/debts/*").as("updateDebt")
		cy.login("/debts")

		cy.contains("Test Debt 1").first().click()
		cy.el("edit-debt-button").click()
		cy.el("borrow-button").click()
		cy.el("amount-input").clear().type("2000")
		cy.el("date-time-input").type(
			new Date(Date.now() + 60 * 60 * 1000)
				.toLocaleString("sv")
				.replace(" ", "T")
				.slice(0, -3)
		)
		cy.el("name-input").clear().type("Test Debt 2")
		cy.el("active-checkbox").click()

		cy.el("edit-button").click()

		cy.wait("@updateDebt").its("response.statusCode").should("eq", 200)
		cy.contains("Test Debt 2").should("exist")
		cy.contains("Borrow").should("exist")
		cy.contains("Inactive Debt").should("exist")
		cy.contains("$4000.00 left").should("exist")
		cy.contains("Total: $2000.00").should("exist")
	})
})

describe("Deleting debts", () => {
	it("Can delete a debt", () => {
		cy.intercept("DELETE", "/api/debts/*").as("deleteDebt")
		cy.login("/debts")

		cy.contains("Test Debt 2").first().click()
		cy.el("delete-debt-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteDebt").its("response.statusCode").should("eq", 200)
		cy.location("pathname").should("eq", "/debts")
	})
})
