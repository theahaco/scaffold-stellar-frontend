/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Server } from "@stellar/stellar-sdk/rpc";
import { network } from "../../contracts/util";
import { Contract } from "@stellar/stellar-sdk";
import { decode_stream, encode, initialize } from "./StellarXdr";
import {
  CONTRACT_SECTIONS,
  ContractData,
  ContractSectionName,
} from "../types/types";
import { prettifyJsonString } from "./prettifyJsonString";

export interface ContractMetadata {
  contractmetav0?: { [key: string]: string };
  contractenvmetav0?: { [key: string]: string };
  wasmHash?: string;
  wasmBinary?: string;
}

export const loadContractMetadata = async (contractId: string) => {
  try {
    const wasmHash = await loadWasmHash(contractId);
    if (!wasmHash) {
      throw new Error(`Failed to load WASM hash for contract ${contractId}`);
    }
    const wasm = await loadWasmBinary(wasmHash);
    if (!wasm) {
      throw new Error(`Failed to load WASM binary for hash ${wasmHash}`);
    }

    const wasmData = await getWasmContractData(wasm);

    const metadata = {
      contractmetav0:
        wasmData && wasmData.contractmetav0
          ? (wasmData.contractmetav0 as unknown)
          : undefined,

      contractenvmetav0:
        wasmData && wasmData.contractenvmetav0
          ? (wasmData.contractenvmetav0 as unknown)
          : undefined,
      wasmHash,
      wasmBinary: wasm.toString("hex"),
    };

    return { ...metadata } as ContractMetadata;
  } catch (error) {
    console.error(`Failed to load contract metadata for ${contractId}:`, error);
    return {};
  }
};

const loadWasmHash = async (contractId: string) => {
  try {
    const server = new Server(network.rpcUrl, { allowHttp: true });

    const contractLedgerKey = new Contract(contractId).getFootprint();
    const response = await server.getLedgerEntries(contractLedgerKey);
    if (!response.entries.length || !response.entries[0]?.val) {
      throw new Error(`No entries found for contract ${contractId}`);
    }
    const wasmHash = response.entries[0].val
      .contractData()
      .val()
      .instance()
      .executable()
      .wasmHash()
      .toString("hex");

    return wasmHash;
  } catch (error) {
    console.error(`Failed to load contract metadata for ${contractId}:`, error);
    return null;
  }
};

const loadWasmBinary = async (wasmHash: string) => {
  try {
    const server = new Server(network.rpcUrl, { allowHttp: true });

    return await server.getContractWasmByHash(wasmHash, "hex");
  } catch (error) {
    console.error(`Failed to load contract metadata for ${wasmHash}:`, error);
    return null;
  }
};

export const getWasmContractData = async (wasmBytes: Buffer) => {
  try {
    const mod = await WebAssembly.compile(wasmBytes);
    const result: Record<ContractSectionName, ContractData> = {
      contractmetav0: {},
      contractenvmetav0: {},
      contractspecv0: {},
    };

    // Make sure the StellarXdr is available
    await initialize();

    for (const sectionName of CONTRACT_SECTIONS) {
      const sections = WebAssembly.Module.customSections(mod, sectionName);

      if (sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          const sectionData = sectionResult(sectionName, sections[i]);

          if (sectionData) {
            let sectionContent = {};
            sectionData.json.forEach((json) => {
              const sectionDataJson = JSON.parse(json);
              Object.keys(sectionDataJson).map((key) =>
                sectionDataJson[key].key
                  ? (sectionContent = {
                      ...sectionContent,

                      [sectionDataJson[key].key]: sectionDataJson[key].val,
                    })
                  : Object.keys(sectionDataJson[key]).map((innerKey) => {
                      sectionContent = {
                        ...sectionContent,
                        [innerKey]: sectionDataJson[key][innerKey],
                      };
                    }),
              );
            });

            result[sectionName] = {
              ...result[sectionName],
              ...sectionContent,
            };
          }
        }
      }
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const sectionResult = (
  sectionName: ContractSectionName,
  section: ArrayBuffer,
) => {
  const sectionData = new Uint8Array(section);
  const sectionXdr = Buffer.from(sectionData).toString("base64");
  const { json, xdr } = getJsonAndXdr(sectionName, sectionXdr);

  return {
    xdr,
    json,
    // TODO: add text format
  };
};

const TYPE_VARIANT: Record<ContractSectionName, string> = {
  contractenvmetav0: "ScEnvMetaEntry",
  contractmetav0: "ScMetaEntry",
  contractspecv0: "ScSpecEntry",
};

const getJsonAndXdr = (sectionName: ContractSectionName, xdr: string) => {
  try {
    const jsonStringArray = decode_stream(TYPE_VARIANT[sectionName], xdr);

    return {
      json: jsonStringArray.map((s) => prettifyJsonString(s)),
      xdr: jsonStringArray.map((s) => encode(TYPE_VARIANT[sectionName], s)),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return { json: [], xdr: [] };
  }
};
