import { Layout } from "@stellar/design-system";
import "./App.module.css"
import ConnectAccount from "./components/ConnectAccount.tsx";

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
        </Layout.Inset>
      </Layout.Content>
      <Layout.Footer />
    </main>
  );
}

export default App;
