import { Layout } from "@stellar/design-system";
import "./App.module.css"
import FundAccountButton from "./components/FundAccountButton.tsx";

function App() {
  return (
    <main>
      <Layout.Header
        projectId="My App"
        projectTitle="My App"
        contentRight={<>Connect wallet component <FundAccountButton /></>}
      />
      <Layout.Content>
        <Layout.Inset>
          <h1>Welcome to your app!</h1>
        </Layout.Inset>
      </Layout.Content>
      <Layout.Footer />
    </main>
  );
}

export default App;
