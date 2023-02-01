import { useContext } from "react"
import { AiOutlineGithub } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Button, chakra, Container, Heading, HStack, Text } from "@chakra-ui/react"

import AuthContext from "../../../contexts/AuthContext"

const Landing = ({}: {}) => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()

	return (
		<Container sx={{ maxW: "3xl", m: "auto" }}>
			<Heading
				sx={{
					fontWeight: "extrabold",
					fontSize: { base: "4xl", sm: "5xl", md: "7xl" },
					lineHeight: "1.25",
					textAlign: "center"
				}}>
				Manage your
				<chakra.span sx={{ color: "primary.300" }}> Finances </chakra.span>
				with ease
			</Heading>
			<Box
				sx={{
					w: "75%",
					mx: "auto"
				}}>
				<Text
					sx={{
						mt: 4,
						textAlign: "center"
					}}>
					Monetary is a finance tracking website that allows you to track your finances
					and view statistics of how you spend your finances
				</Text>
			</Box>
			<HStack
				sx={{
					mt: 8,
					justifyContent: "center"
				}}>
				<Button
					size="lg"
					rightIcon={<ArrowForwardIcon />}
					onClick={() => navigate(token ? "/dashboard" : "/login")}
					data-cy="get-started-button">
					Get Started
				</Button>
				<Button
					size="lg"
					variant="outline"
					leftIcon={<AiOutlineGithub size={20} />}
					onClick={() => window.open("https://github.com/zS1L3NT/web-monetary")}
					data-cy="github-button">
					GitHub
				</Button>
			</HStack>
		</Container>
	)
}

export default Landing
