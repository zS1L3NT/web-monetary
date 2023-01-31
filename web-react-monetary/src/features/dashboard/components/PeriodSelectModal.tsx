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
	const [period, setPeriod] = useState<Period>(parentPeriod)
	const finalFocusRef = useRef(null)

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
						variant={period === Period.Today ? "solid" : "outline"}
						onClick={() => setPeriod(Period.Today)}
						data-cy="period-button">
						Today
					</Button>
					<ButtonGroup
						sx={{ mt: 3 }}
						isAttached>
						{[Period.Past7Days, Period.Past30Days, Period.Past365Days].map(p => (
							<Button
								key={p}
								variant={period === p ? "solid" : "outline"}
								onClick={() => setPeriod(p)}
								data-cy="period-button">
								{p}
							</Button>
						))}
					</ButtonGroup>
					<ButtonGroup
						sx={{ mt: 3 }}
						isAttached>
						{[Period.ThisWeek, Period.ThisMonth, Period.ThisYear].map(p => (
							<Button
								key={p}
								variant={period === p ? "solid" : "outline"}
								onClick={() => setPeriod(p)}
								data-cy="period-button">
								{p}
							</Button>
						))}
					</ButtonGroup>
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						disabled={!period}
						onClick={() => {
							setParentPeriod(period)
							onClose()
						}}
						data-cy="save-button">
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default PeriodSelectModal
