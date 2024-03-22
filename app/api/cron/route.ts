import db from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db
      .delete(attachments)
      .where(isNull(attachments.parentId))
     
    if (res)
      return NextResponse.json(
        { susscess: "Attachments cleaned" },
        { status: 200 }
      );
    return NextResponse.json(
      { error: "something went wrong!!!" },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
