import  prisma  from "@/lib/prisma";
import { getCurrentUser } from "@/lib/controllers/storeduser";

export const createGroup = async ({
  name,
  description,
  members,
}: {
  name: string;
  description?: string;
  members: string[];//array of ids
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  if (!name.trim()) throw new Error("Group name cannot be empty");

  const userId = user.id;
  const allMembers = new Set(members);
  allMembers.add(userId);


  const existingUsers = await prisma.user.findMany({
    where: {
      id: { in: Array.from(allMembers) },
    },
    select: { id: true },
  });
  if (existingUsers.length !== allMembers.size) {
    throw new Error("One or more users not found");
  }

  // create group with members
  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date(),
      members: {
        create: Array.from(allMembers).map((unid) => ({
          user: { connect: { id: unid } },
          role: unid === userId ? "admin" : "member",
          joinedAt: new Date(),
        })),
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return group;
};
