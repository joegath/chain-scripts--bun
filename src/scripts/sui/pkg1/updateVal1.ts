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

  const pkgId =
    "0xf2dac35d66d41bdfc832ed0a8ac05adb8d9d0a4b30c47c0dd249406444a9c766";

  const struct1Id =
    "0x689550647d951224a055724e2c9cd2f6ec2da88b9063e2a89a8646243f4e4b46";

  const tx = new Transaction();
  tx.moveCall({
    target: `${pkgId}::pkg1::update_val1`,
    arguments: [tx.object(struct1Id), tx.pure.u64(100)],
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
 
bun run src/scripts/sui/pkg1/updateVal1.ts

 */
