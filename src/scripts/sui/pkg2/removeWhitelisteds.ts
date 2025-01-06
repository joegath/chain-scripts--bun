import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { resolveOutputFilePath, recordResponse } from "../../../helpers";

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

  const randomAddresses: string[] = [
    "0xbef427b71b09d4b60e5c5ec72a68ab9d45714071b59890502ecd8702c4240b68",
    "0xeae71bb2e801096079fe601689c14af1e14ee50b29b374457a08e50a1d4c5b87",
  ];

  tx.moveCall({
    target: `${pkgId}::whitelist::remove_whitelisteds`,
    arguments: [
      tx.object(whitelistId),
      tx.makeMoveVec({
        type: "address",
        elements: randomAddresses.map((address) => tx.pure.address(address)),
      }),
    ],
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
 
bun run src/scripts/sui/pkg2/removeWhitelisteds.ts

 */
