import { getClient, NetworkEnum } from "../../../lib/sui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { execSync } from "child_process";
import { Transaction } from "@mysten/sui/transactions";
import {
  extractPublishedPackage,
  resolveOutputFilePath,
  recordResponse,
} from "../../../helpers";

async function main() {
  const network = NetworkEnum.Devnet;
  const signer = Ed25519Keypair.deriveKeypair(
    process.env.flamboyant_chrysolite!
  );

  const client = getClient(network);
  const contractURI = `${process.env.ROOT_DIR}/pkgs/counter`;

  const { modules, dependencies } = JSON.parse(
    execSync(
      `${process.env.SUI_BUILD_CMD} --dump-bytecode-as-base64 --path ${contractURI}`,
      {
        encoding: "utf-8",
      }
    )
  );

  const tx = new Transaction();
  const upgradeCap = tx.publish({ modules, dependencies });
  tx.transferObjects([upgradeCap], signer.getPublicKey().toSuiAddress());
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

  try {
    await recordResponse({
      filePath: resolveOutputFilePath({ currFilePath: __filename, network }),
      response: res,
    });
  } catch (error) {
    console.log("Error writing data", error);
  }

  const pkg = extractPublishedPackage(res);
  console.log({ pkgId: pkg?.packageId });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/counter/publish.ts

 */
