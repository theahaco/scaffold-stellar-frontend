import { Button, Card, Input, Link } from '@stellar/design-system'
import { useState } from 'react'
import * as Client from 'soroban_hello_world_contract';
import { rpcUrl } from '../contracts/util';


export const ContractInteractionHello = () => {
  const [helloTo, setHelloTo] = useState("");
  const [greetings, setGreetings] = useState("Hello !");

  const contract = new Client.Client({
    ...Client.networks.standalone,
    rpcUrl: rpcUrl,
    allowHttp : true
  });

  const callContractHello = async () => {
    try {
      const helloRes = await contract.hello({to: helloTo})
      setGreetings(helloRes.result.join(" "))
    }
    catch (err) {
      console.log(err)
    }
  }

  return <div style={{width: "30%"}}>
    <Card
      borderRadiusSize="md"
      variant="primary"
    >
      <h2 style={{height: "20%"}}>
        {greetings}
      </h2>
      <Input   
        fieldSize="md"
        id="input" 
        label="Say Hello to"
        value={helloTo}
        onChange={(e) => setHelloTo(e.target.value)}
      />
      <Button
        size="md"
        variant="primary"
        isFullWidth
        style={{marginTop: "20px"}}
        onClick={() => void callContractHello()}
      >
        Submit
      </Button>
      <div style={{fontSize: "0.7em", marginTop: "10px"}}>
          To test other contracts, go to {" "}
          <Link href="https://lab.stellar.org/smart-contracts/contract-explorer">
            Stellar lab
          </Link>
      </div>
    </Card>
  </div>
}