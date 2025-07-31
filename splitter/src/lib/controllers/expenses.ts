// controllers/expenseController.ts

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/controllers/storeduser";
import type { CreateExpenseInput } from "@/app/types";

export const createExpense = async (input: CreateExpenseInput) => {
  const {
    description,
    amount,
    category = "Other",
    date,
    paidByUserId,
    splitType,
    splits,
    groupId,
  } = input;

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  if (groupId) {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    if (!group) throw new Error("Group not found");

    const isMember = group.members.some((m) => m.userId === user.id);
    if (!isMember) throw new Error("You are not a member of this group");
  }

  const totalSplitAmount = splits.reduce((sum, s) => sum + s.amount, 0);
  if (Math.abs(totalSplitAmount - amount) > 0.01) {
    throw new Error("Split amounts do not add up to total");
  }

  const expense = await prisma.expenses.create({
    data: {
      description,
      amount,
      category,
      date: new Date(date),
      paidBy: paidByUserId,
      createdBy: user.id,
      groupId: groupId ?? null,
      splits: {
        create: splits.map((s) => ({
          userId: s.userId,
          amount: s.amount,
          splitType,
        })),
      },
    },
    include: { splits: true },
  });

  return {
    expenseId:expense.id
  }
};
// {
//   id: string;
//   createdAt: Date;
//   date: Date;
//   amount: number;
//   description: string;
//   paidBy: string;
//   createdBy: string;
//   groupId: string | null;
//   category: string;
//   splits: {
//     id: string;
//     createdAt: Date;
//     amount: number;
//     expenseId: string;
//     userId: string;
//     splitType: "equal" | "percentage" | "exact";
//     paid: boolean;
//   }
//   [];
// }
