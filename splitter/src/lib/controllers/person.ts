import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/controllers/storeduser";
import type { Expense } from "@/app/types";

export const getExpensesBetweenUsers = async (userId: string) => {
  const me = await getCurrentUser();
  if (!me) throw new Error("Not authenticated");
  
  // Check if the other user exists
  const otherUserExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  
  if (!otherUserExists) throw new Error("Other user not found");
  
  // Ensure we're not trying to get expenses with ourselves
  if (me.id === userId) throw new Error("Cannot get expenses with yourself");
  
  const myPaidRaw = await prisma.expenses.findMany({
    where: {
      paidBy: me.id,
      groupId: null,
    },
    select: {
      id: true,
      amount: true,
      description: true,
      createdAt: true,
      paidBy: true,
      groupId: true,
      splits:true
    },
  });


  const theirPaidRaw = await prisma.expenses.findMany({
    where: {
      paidBy: userId,
      groupId: null,
    },
    select: {
      id: true,
      amount: true,
      description: true,
      createdAt: true,
      paidBy: true,
      groupId: true,
      splits: true,
      },
  });


  const candidateExpenses = [...myPaidRaw, ...theirPaidRaw];

  const expenses: Expense[] = candidateExpenses
    .filter((e) => {
      const meInSplits = e.splits.some((s) => s.userId === me.id);
      const themInSplits = e.splits.some((s) => s.userId === userId);

      const meInvolved = e.paidBy === me.id || meInSplits;
      const themInvolved = e.paidBy === userId || themInSplits;

      return meInvolved && themInvolved;
    })
    .map((e) => ({
      ...e,
      groupId: e.groupId ?? undefined,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // settlements between users
  const settlements = await prisma.payments.findMany({
    where: {
      groupId: null,
      OR: [
        { sentId: me.id, receivedId: userId },
        { sentId: userId, receivedId: me.id },
      ],
    },
  });

  settlements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  //calculate balance
  let balance = 0;
  for (const e of expenses) {
    if (e.paidBy === me.id) {
      const split = e.splits.find((s) => s.userId === userId);
      if (split) balance += split.amount;
    } else {
      const split = e.splits.find((s) => s.userId === me.id);
      if (split) balance -= split.amount;
    }
  }

  for (const s of settlements) {
    if (s.sentId === me.id) balance += s.amount;
    else balance -= s.amount;
  }

  //get other user info
  const otherUserCopy = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
    },
  });
   if (!otherUserCopy) throw new Error("User not found");
const otherUser = {
  ...otherUserCopy,
  role: "member" as const,
};

 
  return {
    expenses,
    settlements,
    otherUser,
    balance,
  };
};
