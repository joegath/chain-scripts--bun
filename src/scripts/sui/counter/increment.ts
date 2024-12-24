import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { execSync } from "child_process";
import { Transaction } from "@mysten/sui/transactions";
import {
  extractPublishedPkg,
  readDataFromFile,
  resolveOutputFilePath,
  writeResData,
} from "../../../helpers";
import { readFile } from "../../../lib/fs";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { throwIfNullOrUndefinedOrEmpty } from "../../../utils";

async function main() {
  const network = NetworkEnum.Devnet;
  const signer = Ed25519Keypair.deriveKeypair(
    process.env.flamboyant_chrysolite!
  );
  const client = getClient(network);

  // const outputPath = resolveOutputFilePath({
  //   currFilePath: __filename,
  //   network,
  // });
  // const counterObj = await readDataFromFile<SuiTransactionBlockResponse>(
  //   outputPath
  // );
  // const counterPkgId = extractPublishedPkg(counterObj)?.packageId;
  // throwIfNullOrUndefinedOrEmpty(counterPkgId);

  const counterPkgId =
    "0xc977743379f96bd80347b52976a68d4db02a5a0d3aaf52f066bdeee4f1e4aa07";
  const counterObj =
    "0x5fd530dbdaf5f4074cd7d2821ea6d9681d141d3c5e3a147a69c9ad2ae8a526f8";

  const tx = new Transaction();
  tx.moveCall({
    target: `${counterPkgId}::counter::increment`,
    arguments: [tx.object(counterObj)],
  });
  tx.setSender(signer.getPublicKey().toSuiAddress());
  tx.setGasBudget(1000000000);
  const txBytes = await tx.build({ client });
  const simulationRes = await client.dryRunTransactionBlock({
    transactionBlock: txBytes,
  });
  if (simulationRes.effects.status.status !== "success") {
    console.log("Simulation fail", simulationRes?.effects?.status?.error);
    return;
  } else {
    console.log("Simulation success");
    // return;
  }

  const signature = (await signer.signTransaction(txBytes)).signature;
  const res = await client.executeTransactionBlock({
    transactionBlock: txBytes,
    signature,
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true,
    },
  });
  await client.waitForTransaction({ digest: res.digest });
  console.log("Transaction executed successfully");

  try {
    await writeResData({
      filePath: resolveOutputFilePath({ currFilePath: __filename, network }),
      res,
    });
  } catch (error) {
    console.log("Error writing data", error);
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/counter/increment.ts

 */
