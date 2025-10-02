import React from "react";
import { Code, Layout, Text } from "@stellar/design-system";
import { GuessTheNumber } from "../components/GuessTheNumber";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <Text as="h1" size="xl">
        Welcome to your app!
      </Text>
      <Text as="p" size="md">
        This is a basic template to get your dapp started with the Stellar
        Design System and Stellar contracts. You can customize it further by
        adding your own contracts, components, and styles.
      </Text>

      <Text as="h2" size="lg">
        Develop your contracts
      </Text>
      <Text as="p" size="md">
        Take a look in the <Code size="md">contracts/</Code> directory. Compare
        that to what you see in the <Code size="md">npm run dev</Code> output
        (which itself is running <Code size="md">stellar scaffold watch</Code>).
        Also compare it to what you see when you click{" "}
        <Code size="md">&lt;/&gt; Debugger</Code> up in the top right. See?
      </Text>
      <Text as="p" size="md">
        As you update your contracts,{" "}
        <Code size="md">stellar scaffold watch</Code> command will automatically
        recompile them and update the dapp with the latest changes.
      </Text>

      <Text as="h2" size="lg">
        Interact with contracts from the frontend
      </Text>
      <Text as="p" size="md">
        Scaffold stellar automatically builds, deploys, and generates frontend
        packages (sometimes called "TypeScript bindings") for each of your
        contracts. You can adjust how it does this in the{" "}
        <Code size="md">environments.toml</Code> file. Import these frontend
        packages like this:
      </Text>
      <pre>
        <Code size="md">import game from "./contracts/guess_the_number";</Code>
      </pre>
      <Text as="p" size="md">
        If your contract emits events, check out the{" "}
        <Code size="md">useSubscription</Code> hook in the{" "}
        <Code size="md">hooks/</Code> folder to listen to them.
      </Text>
      <Text as="p" size="md">
        As an example, here's the <Code size="md">GuessTheNumber</Code>{" "}
        component. Make changes to the contract and the component and see how
        things change!
      </Text>
      <Text as="h2" size="lg">
        &lt;GuessTheNumber /&gt;
      </Text>
      <GuessTheNumber />
      <Text as="h2" size="lg">
        Interact with wallets
      </Text>
      <Text as="p" size="md">
        This project is already integrated with Stellar Wallet Kit, and the{" "}
        <Code size="md">useWallet</Code> hook is available for you to use in
        your components. You can use it to connect to get connected account
        information.
      </Text>
      <Text as="h2" size="lg">
        Deploy your app
      </Text>
      <Text as="p" size="md">
        To deploy your contracts, use the{" "}
        <Code size="md">stellar registry publish</Code> and
        <Code size="md">stellar registry deploy</Code> commands ( use{" "}
        <Code size="md">stellar registry --help</Code> for more info ) to deploy
        to the appropriate Stellar network.
      </Text>
      <Text as="p" size="md">
        Build your frontend application code with{" "}
        <Code size="md">npm run build</Code> and deploy the output in the
        <Code size="md">dist/</Code> directory.
      </Text>
    </Layout.Inset>
  </Layout.Content>
);

export default Home;
