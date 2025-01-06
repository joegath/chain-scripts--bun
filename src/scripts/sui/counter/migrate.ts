import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { resolveOutputFilePath, recordResponse } from "../../../helpers";

/**
 * Script to migrate a shared object after upgrading its package
 *
 */
async function main() {
  const network = NetworkEnum.Devnet;
  const signer = Ed25519Keypair.deriveKeypair(
    process.env.flamboyant_chrysolite!
  );
  const client = getClient(network);

  const targetPkg =
    "0xb782733376a0dab696ca737a0fdaa5f1fd7365688e4b515942e6a803d329d6e9";

  const adminCap =
    "0xe7636e84936d3bf32796d6b4f9b34507c71f4e72618c665979b5977419fb186e";

  const targetObj =
    "0x5fd530dbdaf5f4074cd7d2821ea6d9681d141d3c5e3a147a69c9ad2ae8a526f8";

  const tx = new Transaction();
  tx.moveCall({
    target: `${targetPkg}::counter::migrate`,
    arguments: [tx.object(targetObj), tx.object(adminCap)],
  });
  tx.setSender(signer.getPublicKey().toSuiAddress());
  tx.setGasBudget(1000000000);
  const txBytes = await tx.build({ client });
  const simulationResponse = await client.dryRunTransactionBlock({
    transactionBlock: txBytes,
  });
  if (simulationResponse.effects.status.status !== "success") {
    console.log("Simulation fail", simulationResponse?.effects?.status?.error);
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
    await recordResponse({
      filePath: resolveOutputFilePath({ currFilePath: __filename, network }),
      response: res,
    });
  } catch (error) {
    console.log("Error recording response", error);
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/counter/migrate.ts

 */
