import { useRef, useState } from "react"

import {
	Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay
} from "@chakra-ui/react"

import { Period } from "../../../utils/periodUtils"

const PeriodSelectModal = ({
	isOpen,
	onClose,
	period: parentPeriod,
	setPeriod: setParentPeriod
}: {
	isOpen: boolean
	onClose: () => void
	period: Period
	setPeriod: (period: Period) => void
}) => {
	const finalFocusRef = useRef(null)

	const [period, setPeriod] = useState<Period>(parentPeriod)

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Period</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Button
						sx={{
							bg: period === Period.Today ? "primary" : "",
							"&:hover": { bg: period === Period.Today ? "primary" : "" }
						}}
						variant="outline"
						onClick={() => setPeriod(Period.Today)}>
						Today
					</Button>
					<ButtonGroup
						sx={{ mt: 3 }}
						isAttached>
						<Button
							sx={{
								bg: period === Period.Past7Days ? "primary" : "",
								"&:hover": { bg: period === Period.Past7Days ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.Past7Days)}>
							Past 7 Days
						</Button>
						<Button
							sx={{
								bg: period === Period.Past30Days ? "primary" : "",
								"&:hover": { bg: period === Period.Past30Days ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.Past30Days)}>
							Past 30 Days
						</Button>
						<Button
							sx={{
								bg: period === Period.Past365Days ? "primary" : "",
								"&:hover": { bg: period === Period.Past365Days ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.Past365Days)}>
							Past 365 Days
						</Button>
					</ButtonGroup>
					<ButtonGroup
						sx={{ mt: 3 }}
						isAttached>
						<Button
							sx={{
								bg: period === Period.ThisWeek ? "primary" : "",
								"&:hover": { bg: period === Period.ThisWeek ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.ThisWeek)}>
							This Week
						</Button>
						<Button
							sx={{
								bg: period === Period.ThisMonth ? "primary" : "",
								"&:hover": { bg: period === Period.ThisMonth ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.ThisMonth)}>
							This Month
						</Button>
						<Button
							sx={{
								bg: period === Period.ThisYear ? "primary" : "",
								"&:hover": { bg: period === Period.ThisYear ? "primary" : "" }
							}}
							variant="outline"
							onClick={() => setPeriod(Period.ThisYear)}>
							This Year
						</Button>
					</ButtonGroup>
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						onClick={onClose}>
						Close
					</Button>
					<Button
						variant="primary"
						disabled={!period}
						onClick={() => {
							setParentPeriod(period)
							onClose()
						}}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default PeriodSelectModal
