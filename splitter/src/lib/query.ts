import { DebtInfo, UserExpenseData, UserWithDebts } from "@/app/types";
import  prisma  from "@/lib/prisma";

// 1-to-1 debts netted against cases where the user was the payer and against settlements already made
export async function getUsersWithOutstandingDebts(): Promise<UserWithDebts[]> {
  const users = await prisma.user.findMany();
  const result: UserWithDebts[] = [];

  // Load every 1-to-1 expense once (groupId === null)
  const expenses = await prisma.expenses.findMany({
    where: { groupId: null },
    include: {
      splits: true,
      paid: true,
    },
  });

  // Load every 1-to-1 settlement once (groupId === null)
  const settlements = await prisma.payments.findMany({
    where: { groupId: null },
    include: {
      sent: true,
      received: true,
    },
  });

  // Small cache so we don't hit the DB for every name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userCache = new Map<string, any>();
  const getUser = async (id: string) => {
    if (!userCache.has(id)) {
      const user = await prisma.user.findUnique({ where: { id } });
      userCache.set(id, user);
    }
    return userCache.get(id);
  };

  for (const user of users) {
    // Map<counterpartyId, { amount: number, since: number }>
    // +amount => user owes counterparty
    // -amount => counterparty owes user
    const ledger = new Map<string, { amount: number; since: number }>();

    // 1) Process every 1-to-1 expense
    for (const exp of expenses) {
      // Case A: somebody else paid, and user appears in splits
      if (exp.paidBy !== user.id) {
        const split = exp.splits.find((s) => s.userId === user.id && !s.ispaid);
        if (!split) continue;

        const entry = ledger.get(exp.paidBy) ?? {
          amount: 0,
          since: exp.date.getTime(),
        };
        entry.amount += split.amount; // user owes
        entry.since = Math.min(entry.since, exp.date.getTime());
        ledger.set(exp.paidBy, entry);
      }
      // Case B: user paid, others appear in splits
      else {
        for (const s of exp.splits) {
          if (s.userId === user.id || s.ispaid) continue;

          const entry = ledger.get(s.userId) ?? {
            amount: 0,
            since: exp.date.getTime(), // will be ignored while amount <= 0
          };
          entry.amount -= s.amount; // others owe user
          ledger.set(s.userId, entry);
        }
      }
    }

    // 2) Apply settlements the user PAID or RECEIVED
    for (const st of settlements) {
      // User paid someone → reduce positive amount owed to that someone
      if (st.sentId === user.id) {
        const entry = ledger.get(st.receivedId);
        if (entry) {
          entry.amount -= st.amount;
          if (entry.amount === 0) ledger.delete(st.receivedId);
          else ledger.set(st.receivedId, entry);
        }
      }
      // Someone paid the user → reduce negative balance (they owed user)
      else if (st.receivedId === user.id) {
        const entry = ledger.get(st.sentId);
        if (entry) {
          entry.amount += st.amount; // entry.amount is negative
          if (entry.amount === 0) ledger.delete(st.sentId);
          else ledger.set(st.sentId, entry);
        }
      }
    }

    // 3) Build debts[] list with only POSITIVE balances
    const debts: DebtInfo[] = [];
    for (const [counterId, { amount, since }] of ledger) {
      if (amount > 0) {
        const counter = await getUser(counterId);
        debts.push({
          userId: counterId,
          name: counter?.name ?? "Unknown",
          amount,
          since,
        });
      }
    }

    console.log(user.name, debts);

    if (debts.length > 0) {
      result.push({
        id: user.id,
        name: user.name,
        email: user.email,
        debts,
      });
    }
  }

  return result;
}

// Get users with expenses for AI insights
export async function getUsersWithExpenses() {
  const users = await prisma.user.findMany();
  const result = [];

  // Get current month start
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  for (const user of users) {
    // First, check expenses where this user is the payer
    const paidExpenses = await prisma.expenses.findMany({
      where: {
        paidBy: user.id,
        date: {
          gte: oneMonthAgo,
        },
      },
    });

    // Then, check all expenses to find ones where user is in splits
    const splitExpenses = await prisma.expenses.findMany({
      where: {
        date: {
          gte: oneMonthAgo,
        },
        splits: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    // Combine both sets of expenses (remove duplicates by ID)
    const userExpenseIds = new Set([
      ...paidExpenses.map((e) => e.id),
      ...splitExpenses.map((e) => e.id),
    ]);

    if (userExpenseIds.size > 0) {
      result.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  }

  return result;
}

// Get a specific user's expenses for the past month
export async function getUserMonthlyExpenses(
  userId: string
): Promise<UserExpenseData[]> {
  // Get current month start
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Get all expenses involving this user from the past month
  const userExpenses = await prisma.expenses.findMany({
    where: {
      date: {
        gte: oneMonthAgo,
      },
      OR: [
        { paidBy: userId },
        {
          splits: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      splits: {
        where: {
          userId: userId,
        },
      },
    },
  });

  // Format expenses for AI analysis
  return userExpenses.map((expense) => {
    // Get the user's share of this expense
    const userSplit = expense.splits[0]; // Since we filtered for this user's splits

    return {
      description: expense.description,
      category: expense.category,
      date: expense.date,
      amount: userSplit ? userSplit.amount : 0,
      isPayer: expense.paidBy === userId,
      isGroup: expense.groupId !== null,
    };
  });
}
