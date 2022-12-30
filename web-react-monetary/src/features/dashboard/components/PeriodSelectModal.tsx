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
						isAttached
						variant="outline">
						{[Period.Past7Days, Period.Past30Days, Period.Past365Days].map(p => (
							<Button
								key={p}
								sx={{
									bg: p === period ? "primary" : "",
									"&:hover": { bg: p === period ? "primary" : "" }
								}}
								onClick={() => setPeriod(p)}>
								{p}
							</Button>
						))}
					</ButtonGroup>
					<ButtonGroup
						sx={{ mt: 3 }}
						isAttached
						variant="outline">
						{[Period.ThisWeek, Period.ThisMonth, Period.ThisYear].map(p => (
							<Button
								key={p}
								sx={{
									bg: p === period ? "primary" : "",
									"&:hover": { bg: p === period ? "primary" : "" }
								}}
								onClick={() => setPeriod(p)}>
								{p}
							</Button>
						))}
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
