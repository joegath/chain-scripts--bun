import { SuiClient } from "@mysten/sui/client";
export const getBuyerObjId = async ({
  client,
  owner,
  pkgId,
}: {
  client: SuiClient;
  owner: string;
  pkgId: string;
}) => {
  const res = await client.getOwnedObjects({
    owner,
    filter: {
      MoveModule: {
        /** the module name */
        module: "buyer",
        /** the Move package ID */
        package: pkgId,
      },
    },
    options: {
      showType: true,
      showOwner: true,
    },
  });

  return res?.data[0]?.data?.objectId;
};
