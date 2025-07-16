import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length < 3) {
    console.log("Need at least 3 users.");
    return;
  }

  const now = new Date();

  const [user1, user2, user3] = users;

  // Groups + Members

  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Weekend Trip",
        members: {
          create: [
            { userId: user1.id, role: "admin", joinedAt: now },
            { userId: user2.id, role: "member", joinedAt: now },
            { userId: user3.id, role: "member", joinedAt: now },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Office Expenses",
        members: {
          create: [
            { userId: user2.id, role: "admin", joinedAt: now },
            { userId: user3.id, role: "member", joinedAt: now },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Project Alpha",
        members: {
          create: [
            { userId: user3.id, role: "admin", joinedAt: now },
            { userId: user1.id, role: "member", joinedAt: now },
            { userId: user2.id, role: "member", joinedAt: now },
          ],
        },
      },
    }),
  ]);

  const [tripGroup, officeGroup, projectGroup] = groups;

  // ───────────────────────────────────────────────
  // 1-to-1 Expenses
  // ───────────────────────────────────────────────

  const expenses1v1 = await Promise.all([
    prisma.expenses.create({
      data: {
        description: "Dinner at Indian Restaurant",
        amount: 1250,
        paidBy: user1.id,

        splits: {
          create: [
            { userId: user1.id, amount: 625 },
            { userId: user2.id, amount: 625 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Cab ride to airport",
        amount: 450,
        paidBy: user2.id,

        splits: {
          create: [
            { userId: user1.id, amount: 225 },
            { userId: user2.id, amount: 225 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Movie tickets",
        amount: 500,
        paidBy: user3.id,

        splits: {
          create: [
            { userId: user2.id, amount: 250 },
            { userId: user3.id, amount: 250 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Groceries",
        amount: 1875.5,
        paidBy: user1.id,
        groupId: null,
        splits: {
          create: [
            { userId: user1.id, amount: 1312.85 },
            { userId: user3.id, amount: 562.65 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Internet bill",
        amount: 1200,
        paidBy: user2.id,
        groupId: null,
        splits: {
          create: [
            { userId: user2.id, amount: 600 },
            { userId: user3.id, amount: 600 },
          ],
        },
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // Group Expenses
  // ───────────────────────────────────────────────

  const groupExpenses = await Promise.all([
    prisma.expenses.create({
      data: {
        description: "Hotel reservation",
        amount: 9500,
        paidBy: user1.id,
        groupId: tripGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 3166.67 },
            { userId: user2.id, amount: 3166.67 },
            { userId: user3.id, amount: 3166.66 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Groceries for weekend",
        amount: 2450.75,
        paidBy: user2.id,
        groupId: tripGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 816.92 },
            { userId: user2.id, amount: 816.92 },
            { userId: user3.id, amount: 816.91 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Sight-seeing tour",
        amount: 4500,
        paidBy: user3.id,
        groupId: tripGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 1500 },
            { userId: user2.id, amount: 1500 },
            { userId: user3.id, amount: 1500 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Coffee and snacks",
        amount: 850,
        paidBy: user2.id,
        groupId: officeGroup.id,
        splits: {
          create: [
            { userId: user2.id, amount: 425 },
            { userId: user3.id, amount: 425 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Office supplies",
        amount: 1250.4,
        paidBy: user3.id,
        groupId: officeGroup.id,
        splits: {
          create: [
            { userId: user2.id, amount: 625.2 },
            { userId: user3.id, amount: 625.2 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Domain purchase",
        amount: 1200,
        paidBy: user3.id,
        groupId: projectGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 400 },
            { userId: user2.id, amount: 400 },
            { userId: user3.id, amount: 400 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Server hosting",
        amount: 3600,
        paidBy: user1.id,
        groupId: projectGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 1200 },
            { userId: user2.id, amount: 1200 },
            { userId: user3.id, amount: 1200 },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Project dinner",
        amount: 4800.6,
        paidBy: user2.id,
        groupId: projectGroup.id,
        splits: {
          create: [
            { userId: user1.id, amount: 1600.2 },
            { userId: user2.id, amount: 1600.2 },
            { userId: user3.id, amount: 1600.2 },
          ],
        },
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // Settlements
  // ───────────────────────────────────────────────

  await prisma.payments.createMany({
    data: [
      {
        amount: 225,
        sentId: user1.id,
        receivedId: user2.id,
        groupId: null,
      },
      {
        amount: 3166.67,
        sentId: user2.id,
        receivedId: user1.id,
        groupId: tripGroup.id,
      },
      {
        amount: 425,
        sentId: user3.id,
        receivedId: user2.id,
        groupId: officeGroup.id,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(" Seed failed:", e);
  })
  .finally(() => prisma.$disconnect());
