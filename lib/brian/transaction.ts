import { base } from "viem/chains";
import { TransactionCalldataResponse } from "./interface";


// generate transaction response from Brian api
export async function generateTransactionCalldata(
  prompt: string,
  address: string
): Promise< {
    description: string,
    to: string,
    data: string,
    value: string,
    gasLimit: string
}> {

    const apiKey = process.env.BRIAN_API_KEY;

    const url = "https://api.brianknows.org/api/v0/agent/transaction";
    
    const data = {
        prompt,
        address,
        chainId: base.id.toString(),
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
        "x-brian-api-key": apiKey!,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok || response.status !== 200) {
        console.error("Error in getting transaction calldata", responseData);
        throw new Error("Error in getting transaction calldata, please try again.");
    }

    if (responseData === null || responseData === undefined) {
        throw new Error("Error in getting transaction calldata, please try again.");

    }
    // check if the response is empty
    if (responseData.result.length === 0) {
        throw new Error("Error in getting transaction calldata, please try again.");
    }
   
    return {
        description: responseData.result[0].description,
        to: responseData.result[0].steps[0].to,
        data: responseData.result[0].steps[0].data,
        value: responseData.result[0].steps[0].value,
        gasLimit: responseData.result[0].steps[0].gasLimit,
    };
}