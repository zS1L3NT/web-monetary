import { DependencyList, useEffect } from "react"

const useAsyncEffect = (fn: () => Promise<any>, deps?: DependencyList) => {
	useEffect(() => {
		fn()
	}, deps)
}

export default useAsyncEffect
