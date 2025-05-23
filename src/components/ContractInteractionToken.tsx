import { Button, Card, Input, Link } from '@stellar/design-system'
import { useEffect, useState } from 'react'
import * as Client from 'soroban_token_contract';
import { useWallet } from '../hooks/useWallet';
import { networkPassphrase, rpcUrl } from '../contracts/util';
import { wallet } from "../util/wallet";


export const ContractInteractionToken = () => {
  const { address } = useWallet()
  const [adminAccount, setAdminAccount] = useState("");
  const [balance, setBalance] = useState<bigint>()
  const [amountToMint, setAmountToMint] = useState("");

  const inputLabel = !balance ? "Set an admin" : "How much tokens do you want to mint ?"

  const contract = new Client.Client({
    ...Client.networks.standalone,
    rpcUrl: rpcUrl,
    allowHttp : true,
    publicKey: address
  });

  const callContractToken = async () => {
    if (!balance) {
      try {
        const adminTx = await contract.set_admin({
          new_admin: adminAccount,
        })
  
        await adminTx.signAndSend({signTransaction: async (xdr: string) => {
          return await wallet.signTransaction(xdr, {
          address: address,
          networkPassphrase: networkPassphrase
        })}})
      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      try {
        if (address) {
          const mintTx = await contract.mint({
            to: address,
            amount: BigInt(amountToMint)
          })

          await mintTx.signAndSend({signTransaction: async (xdr: string) => {
            return await wallet.signTransaction(xdr, {
            address: address,
            networkPassphrase: networkPassphrase
          })}}) 

          const currBalance = await contract.balance({id: address})
          setBalance(currBalance.result)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!balance) {
      setAdminAccount(e.target.value)
    }
    else {
      setAmountToMint(e.target.value)
    }
  }

  useEffect(() => {
    if (address) {
      void contract.balance({id: address}).then((currBalance) => {
        setBalance(currBalance.result)
      })
    }
  })



  return <div style={{width: "30%"}}>
    <Card
      borderRadiusSize="md"
      variant="primary"
    >
      <h2 style={{height: "20%"}}>
        {!balance ? "Set an admin to use the contract !" : `Your balance is : ${balance}`}
      </h2>
      <Input   
        fieldSize="md"
        id="input" 
        label={inputLabel}
        value={!balance ? adminAccount : amountToMint}
        onChange={onChangeInput}
      />
      <Button
        size="md"
        variant="primary"
        isFullWidth
        style={{marginTop: "20px"}}
        onClick={() => void callContractToken()}
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