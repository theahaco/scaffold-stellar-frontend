import { Button, Card, Icon } from "@stellar/design-system"
import React from "react"
import { Link } from "react-router-dom"
import { GuessTheNumber } from "../components/GuessTheNumber"
import { labPrefix } from "../contracts/util"
import styles from "./Home.module.css"

const Home: React.FC = () => (
	<div className={styles.Home}>
		<div>
			<h1>Yay! You&apos;re on Stellar!</h1>

			<p>
				A local development template designed to help you build dApps on the
				Stellar network. This environment lets you easily test wallet
				connections, smart contract interactions, transaction verifications,
				etc.{" "}
				<Link
					to="https://scaffoldstellar.org/docs/intro"
					className="Link Link--primary"
					target="_blank"
				>
					View docs
				</Link>
			</p>
		</div>

		<Card>
			<h2>
				<Icon.File06 size="lg" />
				Sample Contracts
			</h2>

			<p>
				<strong>Guess The Number:</strong> Interact with the sample contract
				from the{" "}
				<Link
					to="https://scaffoldstellar.org/docs/tutorial/overview"
					className="Link Link--primary"
					target="_blank"
				>
					Scaffold Tutorial
				</Link>{" "}
				using an automatically generated contract client.
			</p>

			<GuessTheNumber />

			<p>Or take a look at other sample contracts to get you started:</p>

			<nav>
				<Link to="https://github.com/OpenZeppelin/stellar-contracts/tree/main/examples">
					<Button variant="tertiary" size="md">
						OpenZeppelin sample contracts
						<Icon.ArrowUpRight size="md" />
					</Button>
				</Link>
				<Link to="https://github.com/stellar/soroban-examples">
					<Button variant="tertiary" size="md">
						Soroban sample contracts
						<Icon.ArrowUpRight size="md" />
					</Button>
				</Link>
			</nav>
		</Card>

		<Card>
			<h2>
				<Icon.Code02 size="lg" />
				Start Building
			</h2>

			<ol>
				<li>
					Add your contract under <code>/src/contracts</code>
				</li>
				<li>
					Contracts are built by Scaffold when you run <code>npm start</code>
				</li>
				<li>
					Changes are rebuilt automatically by <code>Vite</code>
				</li>
				<li>
					Interact with your contract immediately in the Contract Explorer
				</li>
			</ol>

			<p>
				Watch the full process in our{" "}
				<Link
					to="https://www.youtube.com/watch?v=86hWe8Ragtg&list=PLmr3tp_7-7Gjj6gn5-bBn-QTMyaWzwOU5&index=1"
					className="Link Link--primary"
				>
					Youtube tutorial
				</Link>
				<br />
				Get inspired by our showcase of{" "}
				<Link
					to="https://scaffoldstellar.org/showcase"
					className="Link Link--primary"
				>
					Example frontends
				</Link>
				<br />
				Ready to deploy?{" "}
				<Link
					to="https://developers.stellar.org/docs/tools/cli/install-cli"
					className="Link Link--primary"
				>
					Read the mainnet deployment guide
				</Link>
			</p>
			<p></p>
		</Card>

		<section>
			<Card>
				<Icon.Code02 size="lg" />
				<p>
					Invoke your smart contract using the
					<Link to="/debug" className="Link Link--primary">
						Contract Explorer
					</Link>
				</p>
			</Card>

			<Card>
				<Icon.SearchLg size="lg" />
				<p>
					Browse your local transactions with the
					<Link to={labPrefix()} className="Link Link--primary">
						Transaction Explorer
					</Link>
				</p>
			</Card>
		</section>
	</div>
)

export default Home
