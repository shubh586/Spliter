import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/controllers/storeduser"

export const getAllContacts = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User is not authenticated");
  const userId = user.id;
  const [contacts, contacts2] = await Promise.all([
    prisma.expenses.findMany({
      where: { paidBy: userId },
      include: {
        splits: true,
      },
    }),
    prisma.expenses.findMany({
      where: {
        groupId: null,
        paidBy: {
          not: userId,
        },
        splits: {
          some: {
            userId,
          },
        },
      },
      include: {
        splits: true,
      },
    }),
  ]);

  const totalContacts = [...contacts, ...contacts2];
  const uniqueContactsId = new Set<string>();
  for (const exm of totalContacts) {
    if (exm.paidBy !== userId) uniqueContactsId.add(exm.id);
    for (const s of exm.splits) {
      uniqueContactsId.add(s.userId);
    }
  }

  const allContacts = await prisma.user.findMany({
    where: {
      id: { in: Array.from(uniqueContactsId) },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
  const groupResults = groups.map((gr) => ({
    id: gr.id,
    name: gr.name,
    description: null,
    memberCount: gr.members.length,
    type: "group" as const,
  }));

  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  groupResults.sort((a, b) => a.name.localeCompare(b.name));

  return {
    users: allContacts.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      type: "user" as const,
    })),
    groups: groupResults,
  };
};
