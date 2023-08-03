import { CreateCompletionResponseUsage } from "openai";
import { TypeOf, z } from "zod";

const Usage = z.object(
    {
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number()
    }
)

export type Usage = z.infer<typeof Usage>;

const gpt35inputpriceperk = 0.0015
const gpt35outputpriceperk = 0.002


export const calcPrice = (usage: Usage, inputpriceperk: number = gpt35inputpriceperk, outputpriceperk: number = gpt35outputpriceperk) => {
    let price = 0

    price += usage.prompt_tokens / 1000 * inputpriceperk
    price += usage.completion_tokens / 1000 * outputpriceperk

    return price
}
