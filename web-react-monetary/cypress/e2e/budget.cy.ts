describe("Appropriate budget authentication redirects", () => {
	it("Redirects /budgets to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/budgets")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /budgets when authenticated", () => {
		cy.login("/budget")
	})

	it("Redirects /budgets/:id to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/budgets/1")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /budgets/:id when authenticated", () => {
		cy.login("/budget/1")
	})
})

describe("Creating budgets", () => {
	it("Cannot create a budget with invalid data", () => {
		cy.login("/budgets")

		cy.el("add-budget-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("name-input").type("Test Budget")

		cy.el("add-button").should("be.disabled")

		cy.el("amount-input").clear().type("1000")

		cy.el("period-type-select").click()
		cy.el("period-type-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("account-checkbox").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("account-checkbox").first().click()
		cy.el("category-checkbox").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("account-checkbox").first().click()

		cy.el("add-button").should("be.enabled")
	})

	it("Can create a budget", () => {
		cy.intercept("POST", "/api/budgets").as("createBudget")
		cy.login("/budgets")

		cy.el("add-budget-button").click()

		cy.el("name-input").type("Test Budget 1")
		cy.el("amount-input").clear().type("1000")
		cy.el("period-type-select").click()
		cy.el("period-type-select-option").first().click()
		cy.el("account-checkbox").first().click()
		cy.el("category-checkbox").first().click()

		cy.el("add-button").click()

		cy.wait("@createBudget").its("response.statusCode").should("eq", 200)
		cy.contains("Test Budget 1").should("exist")
		cy.contains("$1000.00").should("exist")
		cy.contains("Daily").should("exist")
	})
})

describe("Reading budgets", () => {
	it("Can read budgets", () => {
		cy.intercept("GET", "/api/budgets").as("getBudgets")
		cy.login("/budgets")

		cy.wait("@getBudgets").its("response.statusCode").should("eq", 200)

		cy.get(".chakra-stack .chakra-card").should("have.length", 2)
		cy.contains("Test Budget 1").should("exist")
		cy.contains("$1000.00").should("exist")
	})

	it("Cannot read a budget with invalid id", () => {
		cy.intercept("GET", "/api/budgets/*").as("getBudget")
		cy.login("/budgets/1")

		cy.wait("@getBudget").its("response.statusCode").should("eq", 404)
		cy.get("[role=alert]").should("have.text", "Budget not found")
		cy.toasts(["Budget not found"])
	})

	it("Can read a budget", () => {
		cy.intercept("GET", "/api/budgets/*").as("getBudget")
		cy.login("/budgets")

		cy.contains("Test Budget 1").click()

		cy.wait("@getBudget").its("response.statusCode").should("eq", 200)
		cy.contains("Test Budget 1").should("exist")
		cy.contains("$1000.00").should("exist")
	})
})

describe("Updating budgets", () => {
	it("Cannot update a budget with invalid data", () => {
		cy.login("/budgets")

		cy.contains("Test Budget 1").first().click()
		cy.el("edit-budget-button").click()
		cy.el("name-input").clear()

		cy.el("edit-button").should("be.disabled")

		cy.el("name-input").type("Test Budget 1")
		cy.el("amount-input").clear()

		cy.el("edit-button").focus().should("be.disabled")

		cy.el("amount-input").type("1000")
		cy.el("account-checkbox").first().click()

		cy.el("edit-button").should("be.disabled")

		cy.el("account-checkbox").first().click()
		cy.el("category-checkbox").first().click()

		cy.el("edit-button").should("be.disabled")

		cy.el("category-checkbox").first().click()

		cy.el("edit-button").should("be.enabled")
	})

	it("Can update a budget", () => {
		cy.intercept("PUT", "/api/budgets/*").as("updateBudget")
		cy.login("/budgets")

		cy.contains("Test Budget 1").first().click()
		cy.el("edit-budget-button").click()
		cy.el("name-input").clear().type("Test Budget 2")
		cy.el("amount-input").clear().type("2000")
		cy.el("account-checkbox").first().click()
		cy.el("account-checkbox").eq(1).click()
		cy.el("category-checkbox").first().click()
		cy.el("category-checkbox").eq(1).click()

		cy.el("edit-button").click()

		cy.wait("@updateBudget").its("response.statusCode").should("eq", 200)
		cy.contains("Test Budget 2").should("exist")
		cy.contains("$2000.00").should("exist")
	})
})

describe("Deleting budgets", () => {
	it("Can delete a budget", () => {
		cy.intercept("DELETE", "/api/budgets/*").as("deleteBudget")
		cy.login("/budgets")

		cy.contains("Test Budget 2").first().click()
		cy.el("delete-budget-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteBudget").its("response.statusCode").should("eq", 200)
        cy.location("pathname").should("eq", "/budgets")
	})
})
