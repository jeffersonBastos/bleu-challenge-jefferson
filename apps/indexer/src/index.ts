import { ponder } from "ponder:registry";
import { events } from "ponder:schema";

// eventType can be an enum
function logs(eventType: string, tokenId: string) {
  //function made for debugging
  console.log("\n =============================================\n ");
  console.log(`${eventType} completed successfully tokenId: `, tokenId);
  console.log("=============================================");
}

ponder.on("BleuNFT:Staked", async ({ event, context }) => {
  const { db } = context;
  const tokenId = event.args.tokenId.toString();
  const eventType = "Staked";

  await db.insert(events).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType,
    owner: event.args.owner,
    tokenId,
    timestamp: event.block.timestamp,
  });

  logs(eventType, tokenId);
});

ponder.on("BleuNFT:Unstaked", async ({ event, context }) => {
  const { db } = context;
  const eventType = "Unstaked";
  const tokenId = event.args.tokenId.toString();

  await db.insert(events).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType,
    owner: event.args.owner,
    tokenId,
    timestamp: event.block.timestamp,
  });

  logs(eventType, tokenId);
});

ponder.on("BleuNFT:Mint", async ({ event, context }) => {
  const { db } = context;
  const eventType = "Mint";
  const tokenId = event.args.tokenId.toString();

  await db.insert(events).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType,
    owner: event.args.to,
    tokenId,
    timestamp: event.block.timestamp,
  });

  logs(eventType, tokenId);
});
