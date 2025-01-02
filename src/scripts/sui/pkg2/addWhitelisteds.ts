import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { resolveOutputFilePath, writeResData } from "../../../helpers";

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
    "0xf5f5d7d84da5acd724261c6f4250cec489d6d8dadf7c2019a42c83c057877da5";

  const whitelistId =
    "0xa476f5eba1c14b3cf91f7620fd4cd15f647461d50ea2ec5ff37576de4fe2d008";

  const tx = new Transaction();

  const randomAddresses: string[] = [
    "0xbef427b71b09d4b60e5c5ec72a68ab9d45714071b59890502ecd8702c4240b68",
    "0xeae71bb2e801096079fe601689c14af1e14ee50b29b374457a08e50a1d4c5b87",
    "0xcd451d1b5154ea29dfe5c891755b30527097d185f59d1d2c38d17dc1c91b969d",
    "0x8b6e5110a6f357946b8d3c605d6c8731d885a5318dfb6526f2dbb01807b0c41f",
    "0xf5d39bda2ff34dc8229793b4f258357ee65a9423e65f770933cec326ae8fcd8b",
    "0x2eeb99359cf245cc37206b3a3c57e4c36fa05fd6221be8c6d0018ddd12f9afa2",
    "0x2440cd145fda214e6114ceff3e0c00a70f8b575a777ed6e949e8457846882f57",
    "0x054a0fd9424d81b2d527d061445101529189c6dbfa13fec4caa1f196d50d695d",
    "0x645f4dad067a397b510685a71d6fa6fa986d5d4ce9e4650847c6c38054e35121",
    "0xce0f0f3d6ab3c92cf79a0a878c2057aca3463c8c139799f8a87bda85fb220660",
    "0x9aa54acf8629e60f69be59827ed1cb8d227300b6251fb135a1fd3e4af3ad456f",
  ];

  tx.moveCall({
    target: `${pkgId}::whitelist::add_whitelisteds`,
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
 
bun run src/scripts/sui/pkg2/addWhitelisteds.ts

 */
