import { extractPackageBytecode } from "../../../helpers";
import { getClient } from "../../../lib/sui";

async function main() {
  const objId =
    "0xf2dac35d66d41bdfc832ed0a8ac05adb8d9d0a4b30c47c0dd249406444a9c766";
  const client = getClient("devnet");
  const res = await client.getObject({
    id: objId,
    options: {
      showContent: true,
      showBcs: true,
    },
  });

  console.log(res);
  const pkgContent = extractPackageBytecode(res);
  console.log(pkgContent);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/misc/getObject.ts

 */
