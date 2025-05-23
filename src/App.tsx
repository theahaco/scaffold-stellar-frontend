import { Layout } from "@stellar/design-system";
import "./App.module.css"
import ConnectAccount from "./components/ConnectAccount.tsx";
import { ContractInteractionHello } from "./components/ContractInteractionHello.tsx";
import { ContractInteractionToken } from "./components/ContractInteractionToken.tsx";

function App() {
  return (
    <main>
      <Layout.Header
        projectId="My App"
        projectTitle="My App"
        contentRight={<ConnectAccount />}
      />
      <Layout.Content>
        <Layout.Inset>
          <h1>Welcome to your app!</h1>
          <div style={{display: "flex", gap: "30px"}}>
            <ContractInteractionHello />
            <ContractInteractionToken />
          </div>
        </Layout.Inset>
      </Layout.Content>
      <Layout.Footer />
    </main>
  );
}

export default App;
