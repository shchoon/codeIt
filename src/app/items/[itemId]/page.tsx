import Detail from "./detail";
import { instance } from "@/api/axios";

import { detail } from "@/utils/type";

export default async function ItemDetail({
  params,
}: {
  params: { itemId: string };
}) {
  const getDetail = await instance<detail>(`/items/${params.itemId}`);

  return <Detail item={getDetail.data} />;
}
