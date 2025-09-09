import { useState } from "react";
import { Code, Input, Text } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import game from "../contracts/guess_the_number";
import { wallet } from "../util/wallet";

export const GuessTheNumber = () => {
  const [guessedIt, setGuessedIt] = useState<boolean>();
  const [theGuess, setTheGuess] = useState<number>();
  const { address } = useWallet();

  if (!address) {
    return (
      <Text as="p" size="md">
        Connect wallet to play the guessing game
      </Text>
    );
  }

  const submitGuess = async () => {
    if (!theGuess) return;
    const tx = await game.guess({
      guesser: address,
      a_number: BigInt(theGuess),
    });
    const { result } = await tx.signAndSend({
      signTransaction: wallet.signTransaction.bind(game),
    });
    setGuessedIt(result);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submitGuess();
      }}
    >
      {guessedIt ? (
        <>
          <Text as="p" size="lg">
            You got it!
          </Text>
          <Text as="p" size="lg">
            Set a new number by calling <Code size="md">reset</Code> from the
            CLI as the admin.
          </Text>
        </>
      ) : (
        <Input
          label="Guess a number from 1 to 10!"
          id="guess"
          fieldSize="lg"
          error={guessedIt === false && "Wrong! Guess again."}
          onChange={(e) => {
            setGuessedIt(undefined);
            setTheGuess(Number(e.target.value));
          }}
        />
      )}
      <Text as="p" size="lg">
        &nbsp; {/* Not sure the SDS way to add consistent spacing at the end */}
      </Text>
    </form>
  );
};
