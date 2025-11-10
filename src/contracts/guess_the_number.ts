// This is a stub file for the GuessTheNumber contract client.
// The actual contract client is generated at runtime by stellar scaffold.
// This stub allows the build to succeed when the contract hasn't been generated yet.

type Result<T, E> = {
  isOk: () => boolean;
  isErr: () => boolean;
  unwrap: () => T;
  unwrapErr: () => E;
};

const game = {
  guess: async (_args: {
    a_number: bigint;
    guesser: string;
  }): Promise<{ result: Result<boolean, unknown> }> => {
    throw new Error(
      "Contract client not initialized. Run 'stellar scaffold watch --build-clients' to generate contract clients.",
    );
  },
};

export default game;
