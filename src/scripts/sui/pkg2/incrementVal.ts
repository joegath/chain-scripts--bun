import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { resolveOutputFilePath, writeResData } from "../../../helpers";

async function main() {
  const network = NetworkEnum.Devnet;
  const signer = Ed25519Keypair.deriveKeypair(
    process.env.flamboyant_chrysolite!
  );
  const client = getClient(network);

  const pkgId =
    "0xf5f5d7d84da5acd724261c6f4250cec489d6d8dadf7c2019a42c83c057877da5";

  const whitelistId =
    "0xa476f5eba1c14b3cf91f7620fd4cd15f647461d50ea2ec5ff37576de4fe2d008";

  const tx = new Transaction();

  tx.moveCall({
    target: `${pkgId}::whitelist::increment_val`,
    arguments: [tx.object(whitelistId)],
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
 
bun run src/scripts/sui/pkg2/incrementVal.ts

 */
