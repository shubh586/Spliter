import { BalanceSummary, getUserGroupList, monthlySpendingList, UserBalanceEntry } from "@/app/types";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



//get user balances
export async function getUserBalances(userId: string): Promise<BalanceSummary> {
  const expenses = await prisma.expenses.findMany({
    where: {
      groupId: null,
      OR: [{ paidBy: userId }, { splits: { some: { userId } } }],
    },
    include: { splits: true },
  });
  const settlements = await prisma.payments.findMany({
    where: {
      groupId: null,
      OR: [{ sentId: userId }, { receivedId: userId }],
    },
  });
  let youOwe = 0;
  let youAreOwed = 0;
  const balanceByUser: Record<string, { owed: number; owing: number }> = {};

  for (const e of expenses) {
    const isPayer = e.paidBy === userId;
    const mySplit = e.splits.find((s) => s.userId === userId);
    if (isPayer) {
      for (const s of e.splits) {
        if (s.userId === userId || s.ispaid) continue;
        youAreOwed += s.amount;
        (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
      }
    } else if (mySplit && !mySplit.ispaid) {
      youOwe += mySplit.amount;
      (balanceByUser[e.paidBy] ??= { owed: 0, owing: 0 }).owing +=
        mySplit.amount;
    }
  }

  for (const s of settlements) {
    if (s.sentId === userId) {
      youOwe -= s.amount;
      (balanceByUser[s.receivedId] ??= { owed: 0, owing: 0 }).owing -= s.amount;
    } else {
      youAreOwed -= s.amount;
      (balanceByUser[s.sentId] ??= { owed: 0, owing: 0 }).owed -= s.amount;
    }
  }

  const youOweList: UserBalanceEntry[] = [];
  const youAreOwedByList: UserBalanceEntry[] = [];

  for (const [uid, { owed, owing }] of Object.entries(balanceByUser)) {
    const net = owed - owing;
    if (net === 0) continue;
    const counterpart = await prisma.user.findUnique({ where: { id: uid } });
    const base: UserBalanceEntry = {
      userId: uid,
      name: counterpart?.name ?? "Unknown",
      imageUrl: counterpart?.imageUrl ?? null,
      amount: Math.abs(net),
    };
    if (net > 0) {
      youAreOwedByList.push(base);
    } else {
      youOweList.push(base);
    }
  }

  return {
    youOwe,
    youAreOwed,
    totalBalance: youAreOwed - youOwe,
    oweDetails: {
      youOwe: youOweList.sort((a, b) => b.amount - a.amount),
      youAreOwedBy: youAreOwedByList.sort((a, b) => b.amount - a.amount),
    },
  };
}

// total spent in current year
export async function getTotalSpent(userId: string): Promise<number> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const expenses = await prisma.expenses.findMany({
    where: {
      date: { gte: startOfYear },
      splits: {
        some: { userId },
      },
    },
    include: {
      splits: true,
    },
  });

  let total = 0;
  for (const e of expenses) {
    const mySplit = e.splits.find((s) => s.userId === userId);
    if (mySplit) total += mySplit.amount;
  }

  return total;
}

// get monthly spending
export async function getMonthlySpending(
  userId: string
): Promise<monthlySpendingList> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const expenses = await prisma.expenses.findMany({
    where: {
      date: { gte: startOfYear },
      splits: {
        some: { userId },
      },
    },
    include: { splits: true },
  });
  const monthlyTotals: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const key = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
    monthlyTotals[key] = 0;
  }

  for (const expense of expenses) {
    const date = new Date(expense.date);
    const monthStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getTime();
    const mySplit = expense.splits.find((s) => s.userId === userId);
    if (mySplit) monthlyTotals[monthStart] += mySplit.amount;
  }

  return Object.entries(monthlyTotals)
    .map(([month, total]) => ({
      month: parseInt(month),
      total,
    }))
    .sort((a, b) => a.month - b.month);
}

// get user groups with balances
export async function getUserGroups(userId: string): Promise<getUserGroupList> {
  const userGroups = await prisma.group.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        select: { id: true },
      },
      expenses: {
        select: {
          paidBy: true,
          splits: {
            select: {
              userId: true,
              ispaid: true,
              amount: true,
            },
          },
        },
      },
      payments: {
        select: {
          sentId: true,
          receivedId: true,
          amount: true,
        },
      },
    },
  });

  return userGroups.map((group) => {
    let balance = 0;

    for (const expense of group.expenses) {
      if (expense.paidBy === userId) {
        for (const split of expense.splits) {
          if (split.userId !== userId && !split.ispaid) {
            balance += split.amount;
          }
        }
      } else {
        const mySplit = expense.splits.find((s) => s.userId === userId);
        if (mySplit && !mySplit.ispaid) {
          balance -= mySplit.amount;
        }
      }
    }

    for (const settlement of group.payments) {
      if (settlement.sentId === userId) {
        balance += settlement.amount;
      } else if (settlement.receivedId === userId) {
        balance -= settlement.amount;
      }
    }

    return {
      id: group.id,
      name: group.name,
      members: group.members,
      balance,
    };
  });
}
