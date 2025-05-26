import { Button, Card, Input, Link } from '@stellar/design-system'

interface ContractInteractionProps {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  inputLabel: string
  inputValue: string
  titleLabel: string
}

export const ContractInteraction = ({onInputChange, onSubmit, inputLabel, inputValue, titleLabel}: ContractInteractionProps) => {

  return <div style={{width: "30%"}}>
    <Card
      borderRadiusSize="md"
      variant="primary"
    >
      <h2 style={{height: "20%"}}>
        {titleLabel}
      </h2>
      <Input   
        fieldSize="md"
        id="input" 
        label={inputLabel}
        value={inputValue}
        onChange={onInputChange}
      />
      <Button
        size="md"
        variant="primary"
        isFullWidth
        style={{marginTop: "20px"}}
        onClick={onSubmit}
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