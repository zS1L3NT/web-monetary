describe("Appropriate authentication redirects", () => {
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

		cy.get("[data-cy=add-budget-button]").click()

		cy.get("[data-cy=add-button]").should("be.disabled")

		cy.get("[data-cy=name-input]").type("Test Budget")

		cy.get("[data-cy=add-button]").should("be.disabled")

		cy.get("[data-cy=amount-input]").clear().type("1000")

		cy.get("[data-cy=period-type-select]").click()
		cy.get("[data-cy=Day-option]").click()

		cy.get("[data-cy=add-button]").should("be.disabled")

		cy.get("[data-cy$=checkbox]").first().click()

		cy.get("[data-cy=add-button]").should("be.disabled")

		cy.get("[data-cy$=checkbox]").first().click()
		cy.get("[data-cy$=checkbox]").last().click()

		cy.get("[data-cy=add-button]").should("be.disabled")
	})

	it("Can create a budget", () => {
		cy.intercept("POST", "/api/budgets").as("createBudget")
		cy.login("/budgets")

		cy.get("[data-cy=add-budget-button]").click()

		cy.get("[data-cy=name-input]").type("Test Budget 1")
		cy.get("[data-cy=amount-input]").clear().type("1000")
		cy.get("[data-cy=period-type-select]").click()
		cy.get("[data-cy=Day-option]").click()
		cy.get("[data-cy$=checkbox]").first().click()
		cy.get("[data-cy$=checkbox]").last().click()

		cy.get("[data-cy=add-button]").click()

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
		cy.login("/budgets").push("/budgets/1")

		cy.wait("@getBudget").its("response.statusCode").should("eq", 404)
		cy.get("[role=alert]").should("have.text", "Budget not found")
		cy.toasts(["Budget not found"])
	})

	it("Can read a budget", () => {
		cy.intercept("GET", "/api/budgets/*").as("getBudget")
		cy.login("/budgets").push("/budgets")

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
		cy.get("[data-cy=edit-budget-button]").click()
		cy.get("[data-cy=name-input]").clear()

		cy.get("[data-cy=edit-button]").should("be.disabled")

		cy.get("[data-cy=name-input]").type("Test Budget 1")
		cy.get("[data-cy=amount-input]").clear()

		cy.get("[data-cy=edit-button]").focus().should("be.disabled")

		cy.get("[data-cy=amount-input]").type("1000")
		cy.get("[data-cy$=checkbox]").first().click()

		cy.get("[data-cy=edit-button]").should("be.disabled")

		cy.get("[data-cy$=checkbox]").first().click()
		cy.get("[data-cy$=checkbox]").last().click()

		cy.get("[data-cy=edit-button]").should("be.disabled")
	})

	it("Can update a budget", () => {
		cy.intercept("PUT", "/api/budgets/*").as("updateBudget")
		cy.login("/budgets")

		cy.contains("Test Budget 1").first().click()
		cy.get("[data-cy=edit-budget-button]").click()
		cy.get("[data-cy=name-input]").clear().type("Test Budget 2")
		cy.get("[data-cy=amount-input]").clear().type("2000")
		cy.get("[data-cy$=checkbox]").first().click()
		cy.get("[data-cy$=checkbox]").eq(1).click()
		cy.get("[data-cy$=checkbox]").eq(-2).click()
		cy.get("[data-cy$=checkbox]").last().click()

		cy.get("[data-cy=edit-button]").click()

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
		cy.get("[data-cy=delete-budget-button]").click()
		cy.get("[data-cy=delete-confirm-button]").click()

		cy.wait("@deleteBudget").its("response.statusCode").should("eq", 200)
        cy.location("pathname").should("eq", "/budgets")
	})
})
