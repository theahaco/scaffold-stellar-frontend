import { Button, Icon, Layout } from "@stellar/design-system"
import { Routes, Route, Outlet, NavLink } from "react-router-dom"
import styles from "./App.module.css"
import ConnectAccount from "./components/ConnectAccount"
import { labPrefix } from "./contracts/util"
import Debug from "./pages/Debug"
import Home from "./pages/Home"

function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/debug" element={<Debug />} />
				<Route path="/debug/:contractName" element={<Debug />} />
			</Route>
		</Routes>
	)
}

const AppLayout: React.FC = () => (
	<div className={styles.AppLayout}>
		<Layout.Header
			projectId="Scaffold"
			projectTitle="Scaffold"
			hasThemeSwitch={true}
			contentCenter={
				<>
					<NavLink to="/debug">
						{({ isActive }) => (
							<Button variant="tertiary" size="md" disabled={isActive}>
								<Icon.Code02 size="md" />
								Contract Explorer
							</Button>
						)}
					</NavLink>
					<NavLink to={labPrefix()}>
						<Button variant="tertiary" size="md">
							<Icon.SearchMd size="md" />
							Transaction Explorer
						</Button>
					</NavLink>
				</>
			}
			contentRight={<ConnectAccount />}
		/>

		<main>
			<Layout.Content>
				<Layout.Inset>
					<Outlet />
				</Layout.Inset>
			</Layout.Content>
		</main>

		<Layout.Footer>
			<nav>
				<a
					href="https://github.com/theahaco/scaffold-stellar"
					className="Link Link--secondary"
					target="_blank"
				>
					<Icon.GitPullRequest size="sm" /> GitHub
				</a>
				<a
					href="https://www.youtube.com/watch?v=0syGaIn3ULk&list=PLmr3tp_7-7Gjj6gn5-bBn-QTMyaWzwOU5"
					className="Link Link--secondary"
					target="_blank"
				>
					<Icon.Youtube size="sm" /> Tutorial
				</a>
				<a
					href="https://scaffoldstellar.org"
					className="Link Link--secondary"
					target="_blank"
				>
					<Icon.BookOpen01 size="sm" /> View docs
				</a>
			</nav>
		</Layout.Footer>
	</div>
)

export default App
