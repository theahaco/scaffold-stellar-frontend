import { useState } from 'react'
import * as Client from 'soroban_hello_world_contract';
import { rpcUrl } from '../contracts/util';
import { ContractInteraction } from './ContractInteraction';

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

  return <ContractInteraction onInputChange={(e) => {setHelloTo(e.target.value)}} onSubmit={() => void callContractHello()} inputLabel='Say Hello to' inputValue={helloTo} titleLabel={greetings}/>

}