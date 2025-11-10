import * as React from "react";
import { Server, Api } from "@stellar/stellar-sdk/rpc";
import { xdr } from "@stellar/stellar-sdk";
import { rpcUrl, stellarNetwork } from "../contracts/util";

/**
 * Concatenated `${contractId}:${topic}`
 */
type PagingKey = string;

/**
 * Paging tokens for each contract/topic pair. These can be mutated directly,
 * rather than being stored as state within the React hook.
 */
const paging: Record<
  PagingKey,
  { lastLedgerStart?: number; pagingToken?: string }
> = {};

// NOTE: Server is configured using envvars which shouldn't change during runtime
const server = new Server(rpcUrl, { allowHttp: stellarNetwork === "LOCAL" });

/**
 * Subscribe to events for a given topic from a given contract, using a library
 * generated with `soroban contract bindings typescript`.
 *
 * Someday such generated libraries will include functions for subscribing to
 * the events the contract emits, but for now you can copy this hook into your
 * React project if you need to subscribe to events, or adapt this logic for
 * non-React use.
 */
export function useSubscription(
  contractId: string,
  topic: string,
  onEvent: (event: Api.EventResponse) => void,
  pollInterval = 5000,
) {
  const id = `${contractId}:${topic}`;
  paging[id] = paging[id] || {};

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let stop = false;

    async function pollEvents(): Promise<void> {
      try {
        if (!paging[id].lastLedgerStart) {
          const latestLedgerState = await server.getLatestLedger();
          paging[id].lastLedgerStart = latestLedgerState.sequence;
        }

        // lastLedgerStart is now guaranteed to be a number
        const lastLedger = paging[id].lastLedgerStart;

        const response = await server.getEvents(
          paging[id].pagingToken
            ? {
                cursor: paging[id].pagingToken,
                filters: [
                  {
                    contractIds: [contractId],
                    topics: [[xdr.ScVal.scvSymbol(topic).toXDR("base64")]],
                    type: "contract",
                  },
                ],
                limit: 10,
              }
            : {
                startLedger: lastLedger,
                endLedger: lastLedger + 100,
                filters: [
                  {
                    contractIds: [contractId],
                    topics: [[xdr.ScVal.scvSymbol(topic).toXDR("base64")]],
                    type: "contract",
                  },
                ],
                limit: 10,
              },
        );

        paging[id].pagingToken = undefined;
        if (response.latestLedger) {
          paging[id].lastLedgerStart = response.latestLedger;
        }
        if (response.events && response.events.length > 0) {
          response.events.forEach((event) => {
            try {
              onEvent(event);
            } catch (error) {
              console.error(
                "Poll Events: subscription callback had error: ",
                error,
              );
            }
          });
          // Store the cursor from the response for pagination
          if (response.cursor) {
            paging[id].pagingToken = response.cursor;
          }
        }
      } catch (error) {
        console.error("Poll Events: error: ", error);
      } finally {
        if (!stop) {
          timeoutId = setTimeout(() => void pollEvents(), pollInterval);
        }
      }
    }

    void pollEvents();

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      stop = true;
    };
  }, [contractId, topic, onEvent, id, pollInterval]);
}
