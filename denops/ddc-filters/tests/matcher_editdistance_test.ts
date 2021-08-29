import {
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import {
  FilterArguments
} from "https://deno.land/x/ddc_vim@v0.4.1/base/filter.ts#^";
import {
  assertEquals
} from "https://deno.land/std@0.106.0/testing/asserts.ts#^";
import { Filter } from "../matcher_editdistance.ts";
import { editDistance } from "../edit_distance/edit_distance.ts";

export async function filterWrapper(
  completeStr: string,
  candidates: Candidate[],
  limit: number,
  diffLen: number = -1,
): Promise<Candidate[]> {
  let filter = new Filter();
  return filter.filter({
    filterParams: { limit, showScore: true, diffLen },
    completeStr,
    candidates,
  } as unknown as FilterArguments);
}

Deno.test("calculate edit distance", async () => {
  assertEquals(editDistance("b", "a"), 1);
  assertEquals(editDistance("a", "a"), 0);
  assertEquals(
    editDistance("lvqdyoqykfdbxnqdquhy", "djaeebzqmtblcabwgmscr"),
    20,
  );
  assertEquals(
    editDistance(
      "tqibygdzcxkujvwghwbmjjmbpksnzkgz",
      "giluiggpkzwhaetclrcyxcsixsutjmrmvqlybs",
    ),
    34,
  );
});

Deno.test("filter", async () => {
  let testCandidates = [
    { "word": "foobar" },
    { "word": "fooBar" },
    { "word": "Foobar" },
    { "word": "FooBar" },
  ];
  assertEquals(await filterWrapper("Fiobsr", testCandidates, 3), [{
    word: "Foobar",
    menu: "2",
  }, { word: "FooBar", menu: "3" }]);
});
