import db from "@/lib/db";
import { attachments, mailToken } from "@/lib/db/schema";
import { cloudinaryEditDelete } from "@/lib/upload";
import { isNull, lte } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expires = new Date(new Date().getTime());
    await db.delete(mailToken).where(lte(mailToken.expires, expires));

    const res = await db
      .delete(attachments)
      .where(isNull(attachments.parentId))
      .returning();

    if (res) {
      await cloudinaryEditDelete(res);
      return NextResponse.json(
        { susscess: "Attachments cleaned" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "something went wrong!!!" },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
