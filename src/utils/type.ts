export type todo = {
  name: string;
  isCompleted: boolean;
  id: number;
};

export type detail = todo & {
  imageUrl: string | null;
  memo: string | null;
  tenantId: string;
};
