import { NextResponse } from "next/server";
import { createGroup } from "@/lib/controllers/creategroup";
import { Group } from "lucide-react";


type Group = {
  name: string;
  description: string;
  members: string[];
};
type User = {
  name: string;
  id: string;
  email: string;
  clerkId: string;
};
type Member = {
  id: string;
  joinedAt: Date;
  role: "member" | "admin";
  userId: string;
  groupId: string;
  user: User;
};
type group = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  members: Member[];
};
export async function POST(req: Request) {
  try {
    const data: Group = await req.json();
    const group: group = await createGroup(data);
    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
