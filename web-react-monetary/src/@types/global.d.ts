import { NavigateFunction } from "react-router-dom"

import store from "../store"

declare global {
	interface Window {
		$navigate: NavigateFunction
	}
}
