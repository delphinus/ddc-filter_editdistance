import {
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.105.0/testing/bench.ts";
import { filterWrapper } from "./matcher_editdistance_test.ts";

function gatherCandidates(
  dicts: string[],
): Candidate[] {
  return dicts.map((dict) => Deno.readTextFileSync(dict).split("\n"))
    .flatMap((texts) => texts)
    .map((word) => ({ word }));
}

const candidates = gatherCandidates(["/usr/share/dict/words"]);
console.log(`number of candidates: ${candidates.length}`);
bench({
  name: "filterLargeCandidates",
  runs: 10,
  func(b): void {
    b.start();
    Promise.resolve(filterWrapper("e", candidates, 2));
    b.stop();
  },
});

runBenchmarks();
