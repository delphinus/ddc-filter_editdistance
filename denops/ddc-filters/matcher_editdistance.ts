import {
  BaseFilter,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import {
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v0.4.1/base/filter.ts#^";
import { editDistance } from "./edit_distance/edit_distance.ts";

type Params = {
  limit: number;
  showScore: boolean;
  diffLen: number;
};

export class Filter extends BaseFilter {
  async filter({
    filterParams,
    completeStr,
    candidates,
  }: FilterArguments): Promise<Candidate[]> {
    if (completeStr === '') {
      return candidates;
    }
    const params = filterParams as Params;
    return candidates.filter((c) =>
      c.word.length >= completeStr.length + params.diffLen &&
        c.word.startsWith(completeStr[0])
    )
      .map((c) => ({
        candidate: c,
        ed: editDistance(c.word, completeStr),
      }))
      .filter((i) => i.ed <= params.limit)
      .sort((a, b) => a.ed - b.ed)
      .map((i) => {
        if (params.showScore) {
          i.candidate.menu = i.ed.toString();
        }
        return i.candidate;
      });
  }

  params(): Record<string, unknown> {
    const params: Params = {
      limit: 3,
      showScore: false,
      diffLen: -1,
    };
    return params as unknown as Record<string, unknown>;
  }
}
