import {
  BaseFilter,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import {
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v0.4.1/base/filter.ts#^";
import { editDistance } from "./edit_distance/edit_distance.ts";

export class Filter extends BaseFilter {
  async filter({
    completeStr,
    candidates,
  }: FilterArguments): Promise<Candidate[]> {
    if (completeStr === '') {
      return candidates;
    }
    return candidates.map((c) => ({
      candidate: c,
      ed: editDistance(c.word, completeStr),
    }))
      .sort((a, b) => a.ed - b.ed)
      .map((i) => i.candidate);
  }
}
