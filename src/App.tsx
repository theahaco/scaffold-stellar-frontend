import { Code, Layout } from "@stellar/design-system";
import "./App.module.css"
import ConnectAccount from "./components/ConnectAccount.tsx";

function App() {
  // const statusMessage =  soroban_hello_world_contract.hello({"to": "world"});
  // console.log("Status message from contract:", statusMessage);
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

          <p>
            This is a basic template to get your dapp started with the Stellar Design System and Soroban contracts.
            You can customize it further by adding your own contracts, components, and styles.
          </p>

          <h2>Developing your contracts</h2>

          <p>Your contracts are located in the contracts/ directory, and you can modify them to suit your needs.</p>

          <p>As you update them, the <Code size="md">stellar scaffold watch</Code> command will automatically recompile them and update the dapp with the latest changes.</p>

          <h2>Interacting with contracts from the frontend</h2>

          Scaffold stellar automatically builds your contract packages, and you can import them in your frontend code like this:

          <pre>
            <Code size="md">{`import soroban_hello_world_contract from "./contracts/soroban_hello_world_contract.ts";`}</Code>
          </pre>

          <p>And then you can call the contract methods like this:</p>

          <pre>
            <Code size="md">{`const statusMessage = await soroban_hello_world_contract.hello({"to": "world"});`}</Code>
          </pre>

          <p>
            By doing this, you can use the contract methods in your components. If your contract emits events, check out the <Code size="md">useSubscription</Code> hook in the hooks/ folder to listen to them.
          </p>

          <h2>Interacting with wallets</h2>

          <p>
            This project is already integrated with Stellar Wallet Kit, and the {`useWallet`} hook is available for you to use in your components.
            You can use it to connect to get connected account information.
          </p>

          <h2>Deploying your app</h2>

          <p>
            To deploy your app, use the <Code size="md">stellar contract deploy</Code> command (<a href="https://developers.stellar.org/docs/build/guides/cli/install-deploy">docs</a>).
          </p>
        </Layout.Inset>
      </Layout.Content>
      <Layout.Footer>
        <span>
          © {new Date().getFullYear()} My App. Licensed under the{" "}
          <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">
            Apache License, Version 2.0
          </a>
          .
        </span>
      </Layout.Footer>
    </main>
  );
}

export default App;
