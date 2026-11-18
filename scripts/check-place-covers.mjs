// Runs the Home carousel's placement check (src/components/home/placeCovers.ts) and
// fails the command when a cover lands in the wrong slot. Node 24 strips the types.
import { checkPlaceCovers } from "../src/components/home/placeCovers.ts";

const failures = checkPlaceCovers();

if (failures.length > 0) {
  console.error(`placeCovers: ${failures.length} failure(s)\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("placeCovers: every whole position puts its cover in slot 0 and the next in slot +1.");
