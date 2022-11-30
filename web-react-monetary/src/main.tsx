import { createRoot } from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import { ChakraProvider } from "@chakra-ui/react"

import App from "./App"
import store from "./store"
import theme from "./theme"
import { AuthProvider } from "./contexts/AuthContext"
import ErrorHandler from "./components/ErrorHandler"

createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<ReduxProvider store={store}>
			<AuthProvider>
				<ChakraProvider theme={theme}>
					<ErrorHandler />
					<App />
				</ChakraProvider>
			</AuthProvider>
		</ReduxProvider>
	</BrowserRouter>
)
