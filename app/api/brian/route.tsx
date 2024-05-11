import { generateTransactionCalldata } from "@/lib/brian/transaction";
import { m } from "framer-motion";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  if (req.headers.get("secret") !== process.env.SECRET) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const body = await req.json();
  const { prompt, address } = body;

  const brianResponse = await generateTransactionCalldata(prompt, address);

  return NextResponse.json(brianResponse);
};
