import { Button, Card, Input, Link } from '@stellar/design-system'
import { useState } from 'react'
import * as Client from 'soroban_hello_world_contract';


export const ContractInteractionHello = () => {
  const [helloTo, setHelloTo] = useState("");
  const [greetings, setGreetings] = useState("");

  const contract = new Client.Client({
    ...Client.networks.standalone,
    rpcUrl: 'http://localhost:8000/rpc',
    allowHttp : true
  });

  const callContractHello = () => {
    contract.hello({to: helloTo}).then((res) => {
      setGreetings(res.result.join(" "))
    }).catch((err) => {
      console.log(err)
    })
  }

  return <div style={{width: "30%"}}>
    <Card
      borderRadiusSize="md"
      variant="primary"
    >
      <h1>
        {greetings}
      </h1>
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
        onClick={callContractHello}
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