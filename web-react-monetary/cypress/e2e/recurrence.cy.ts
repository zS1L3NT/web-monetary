describe("Appropriate recurrence authentication redirects", () => {
	it("Redirects /recurrences to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/recurrences")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /recurrences when authenticated", () => {
		cy.login("/recurrences")
	})

	it("Redirects /recurrences/:id to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/recurrences/1")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /recurrences/:id when authenticated", () => {
		cy.login("/recurrences/1")
	})
})

describe("Creating recurrences", () => {
	it("Cannot create a recurrence with invalid data", () => {
		cy.intercept("POST", "/api/recurrences").as("createRecurrence")
		cy.login("/recurrences")

		cy.el("add-recurrence-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("from-account-select").click()
		cy.el("from-account-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("transfer-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("to-account-select").click()
		cy.el("to-account-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("category-select").click()
		cy.el("category-select-option").first().click()
		cy.el("category-select").click()

		cy.el("add-button").should("be.disabled")

		cy.el("amount-input").clear().type("1000")

		cy.el("add-button").should("be.disabled")

		cy.el("period-interval-input").type("100")

		cy.el("add-button").should("be.disabled")
		cy.el("period-interval-input").should("have.value", 99)

		cy.el("period-interval-input").clear().type("1")
		cy.el("period-type-select").click()
		cy.el("period-type-select-option").eq(1).click()

		cy.el("add-button").should("be.disabled")

		cy.el("period-end-type-select").click()
		cy.el("period-end-type-select-option").eq(1).click()
		cy.el("period-end-date-input").type(
			new Date(Date.now() + 60 * 60 * 1000).toLocaleString("sv").replace(" ", "T")
		)

		cy.el("add-button").should("be.disabled")

		cy.el("period-end-type-select").click()
		cy.el("period-end-type-select-option").eq(2).click()
		cy.el("period-end-count-input").clear().type("1000")

		cy.el("add-button").should("be.disabled")
		cy.el("period-end-count-input").should("have.value", 999)

		cy.el("recurrence-name")
			.first()
			.invoke("text")
			.then(name => cy.el("name-input").type(name))

		cy.el("add-button").should("be.enabled")

		cy.el("add-button").click()

		cy.wait("@createRecurrence").its("response.statusCode").should("eq", 409)
		cy.toasts(["Recurrence with that name already exists"])
	})

	it("Can create a recurrence", () => {
		cy.intercept("POST", "/api/recurrences").as("createRecurrence")
		cy.login("/recurrences")

		cy.el("add-recurrence-button").click()
		cy.el("from-account-select").click()
		cy.el("from-account-select-option").first().click()
		cy.el("category-select").click()
		cy.el("category-select-option").first().click()
		cy.el("category-select").click()
		cy.el("amount-input").clear().type("1000")
		cy.el("name-input").type("Test Recurrence 1")
		cy.el("add-button").click()

		cy.wait("@createRecurrence").its("response.statusCode").should("eq", 200)
		cy.contains("Test Recurrence 1").should("exist")
		cy.contains("-$1000.00")
	})
})

describe("Creating recurrence transactions", () => {
	it("Can confirm recurrence transactions", () => {
		cy.intercept("GET", "/api/recurrences/*").as("getRecurrence")
		cy.login("/recurrences")

		cy.contains("Test Recurrence 1").click()

		cy.wait("@getRecurrence").its("response.statusCode").should("eq", 200)

		cy.el("confirm-button").click()
		cy.el("confirm-confirm-button").click()

		cy.contains("Due in 2 day(s)").should("exist")
		cy.contains("Paid on").should("exist")
	})
})

describe("Reading recurrences", () => {
	it("Can read recurrences", () => {
		cy.intercept("GET", "/api/recurrences").as("getRecurrences")
		cy.login("/recurrences")

		cy.wait("@getRecurrences").its("response.statusCode").should("eq", 200)
		cy.el("recurrence", "$").should("have.length", 11)
		cy.contains("Test Recurrence 1").should("exist")
	})

	it("Can read recurrences sorted by name", () => {
		cy.intercept("GET", "/api/recurrences").as("getRecurrence")
		cy.login("/recurrences")

		cy.wait("@getRecurrence").its("response.statusCode").should("eq", 200)
		cy.el("recurrence-name").should("have.length", 11)

		const getNames = (active: boolean) =>
			cy
				.document()
				.then(doc =>
					Array.from(
						doc.querySelectorAll(
							`[data-cy=${
								active ? "active" : "inactive"
							}-recurrence] [data-cy=recurrence-name]`
						)
					).map(el => el.textContent)
				)

		for (const bool of [true, false]) {
			getNames(bool).then(names => {
				cy.el("name-asc-radio").click().wait(500)
				getNames(bool).should(
					"deep.equal",
					[...names].sort((a, b) => a.localeCompare(b))
				)

				cy.el("name-desc-radio").click().wait(500)
				getNames(bool).should(
					"deep.equal",
					[...names].sort((a, b) => b.localeCompare(a))
				)
			})
		}
	})

	it("Cannot read a recurrence with invalid id", () => {
		cy.intercept("GET", "/api/recurrences/*").as("getRecurrence")
		cy.login("/recurrences/1")

		cy.wait("@getRecurrence").its("response.statusCode").should("eq", 404)
		cy.get("[role=alert]").should("have.text", "Recurrence not found")
		cy.toasts(["Recurrence not found"])
	})

	it("Can read a recurrence", () => {
		cy.intercept("GET", "/api/recurrences/*").as("getRecurrence")
		cy.login("/recurrences")

		cy.contains("Test Recurrence 1").click()

		cy.wait("@getRecurrence").its("response.statusCode").should("eq", 200)

		cy.contains("Test Recurrence 1").should("exist")
		cy.contains("MANUAL").should("exist")
		cy.contains("Every day").should("exist")
		cy.contains("-$1000.00").should("exist")
	})
})

describe("Reading recurrence transactions", () => {
	it("Can read recurrence transactions", () => {
		cy.login("/recurrences")

		cy.contains("Test Recurrence 1").click()

		cy.contains("Due in 2 day(s)").should("exist")
		cy.contains("Paid on").should("exist")
	})
})

describe("Updating recurrences", () => {
	it("Cannot update a recurrence with invalid data", () => {
		cy.intercept("PUT", "/api/recurrences/*").as("updateRecurrence")
		cy.login("/recurrences")

		cy.el("recurrence-name")
			.not(':contains("Test Recurrence 1")')
			.first()
			.then(name => cy.wrap(name).as("name"))
		cy.contains("Test Recurrence 1").first().click()
		cy.el("edit-recurrence-button").click()
		cy.el("transfer-button").click()

		cy.el("edit-button").should("be.disabled")

		cy.el("to-account-select").click()
		cy.el("to-account-select-option").first().click()
		cy.el("amount-input").clear()

		cy.el("edit-button").focus().should("be.disabled")

		cy.el("amount-input").type("1000")

		cy.el("edit-button").should("be.disabled")

		cy.el("name-input").clear()

		cy.el("edit-button").should("be.disabled")

		cy.get("@name").then(name => cy.el("name-input").type(name.text()))

		cy.el("edit-button").should("be.enabled")

		cy.el("edit-button").click()

		cy.wait("@updateRecurrence").its("response.statusCode").should("eq", 409)
		cy.toasts(["Recurrence with that name already exists"])
	})

	it("Can update a recurrence", () => {
		cy.intercept("PUT", "/api/recurrences/*").as("updateRecurrence")
		cy.login("/recurrences")

		cy.contains("Test Recurrence 1").first().click()
		cy.el("edit-recurrence-button").click()
		cy.el("outgoing-button").click()
		cy.el("from-account-select").click()
		cy.el("from-account-select-option").eq(1).click()
		cy.el("category-select").click()
		cy.el("category-select-option").eq(1).click()
		cy.el("category-select").click()
		cy.el("amount-input").clear().type("2000")
		cy.el("name-input").clear().type("Test Recurrence 2")
		cy.el("automatic-checkbox").click()

		cy.el("edit-button").click()

		cy.wait("@updateRecurrence").its("response.statusCode").should("eq", 200)
		cy.contains("Test Recurrence 2").should("exist")
		cy.contains("AUTO").should("exist")
		cy.contains("-$2000.00").should("exist")
	})
})

describe("Deleting recurrences", () => {
	it("Can delete a recurrence", () => {
		cy.intercept("DELETE", "/api/recurrences/*").as("deleteRecurrence")
		cy.intercept("DELETE", "/api/transactions/*").as("deleteTransaction")
		cy.login("/recurrences")

		cy.contains("Test Recurrence 2").first().click()
		cy.el("delete-recurrence-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteRecurrence").its("response.statusCode").should("eq", 200)
		cy.location("pathname").should("eq", "/recurrences")

		cy.push("/transactions")

		cy.contains("-$1000.00").first().click()
		cy.el("delete-transaction-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteTransaction").its("response.statusCode").should("eq", 200)
	})
})
