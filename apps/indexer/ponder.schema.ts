import { onchainTable } from "ponder";

export const events = onchainTable("Event", (t) => ({
  id: t.text().primaryKey(),
  eventType: t.text().$type<string>(),
  owner: t.text(),
  tokenId: t.text(),
  timestamp: t.bigint(),
}));
