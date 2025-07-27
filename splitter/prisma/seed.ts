import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users first
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: "alex.johnson.2024@gmail.com",
        clerkId: "clerk_alex_001",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Chen",
        email: "sarah.chen.dev@gmail.com",
        clerkId: "clerk_sarah_002",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Rodriguez",
        email: "mike.rodriguez.pro@gmail.com",
        clerkId: "clerk_mike_003",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
    }),
  ]);

  const [user1, user2, user3] = users;
  const now = new Date();

  // Groups + Members
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Weekend Trip",
        description: "Planning our weekend getaway",
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
        description: "Shared office costs and supplies",
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
        description: "Development project expenses",
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
        createdBy: user1.id,
        catagoery: "Food",
        splits: {
          create: [
            { userId: user1.id, amount: 625, splitType: "equal" },
            { userId: user2.id, amount: 625, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Cab ride to airport",
        amount: 450,
        paidBy: user2.id,
        createdBy: user2.id,
        catagoery: "Transport",
        splits: {
          create: [
            { userId: user1.id, amount: 225, splitType: "equal" },
            { userId: user2.id, amount: 225, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Movie tickets",
        amount: 500,
        paidBy: user3.id,
        createdBy: user3.id,
        catagoery: "Entertainment",
        splits: {
          create: [
            { userId: user2.id, amount: 250, splitType: "equal" },
            { userId: user3.id, amount: 250, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Groceries",
        amount: 1875.5,
        paidBy: user1.id,
        createdBy: user1.id,
        groupId: null,
        catagoery: "Food",
        splits: {
          create: [
            { userId: user1.id, amount: 1312.85, splitType: "exact" },
            { userId: user3.id, amount: 562.65, splitType: "exact" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Internet bill",
        amount: 1200,
        paidBy: user2.id,
        createdBy: user2.id,
        groupId: null,
        catagoery: "Utilities",
        splits: {
          create: [
            { userId: user2.id, amount: 600, splitType: "equal" },
            { userId: user3.id, amount: 600, splitType: "equal" },
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
        createdBy: user1.id,
        groupId: tripGroup.id,
        catagoery: "Accommodation",
        splits: {
          create: [
            { userId: user1.id, amount: 3166.67, splitType: "equal" },
            { userId: user2.id, amount: 3166.67, splitType: "equal" },
            { userId: user3.id, amount: 3166.66, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Groceries for weekend",
        amount: 2450.75,
        paidBy: user2.id,
        createdBy: user2.id,
        groupId: tripGroup.id,
        catagoery: "Food",
        splits: {
          create: [
            { userId: user1.id, amount: 816.92, splitType: "equal" },
            { userId: user2.id, amount: 816.92, splitType: "equal" },
            { userId: user3.id, amount: 816.91, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Sight-seeing tour",
        amount: 4500,
        paidBy: user3.id,
        createdBy: user3.id,
        groupId: tripGroup.id,
        catagoery: "Entertainment",
        splits: {
          create: [
            { userId: user1.id, amount: 1500, splitType: "equal" },
            { userId: user2.id, amount: 1500, splitType: "equal" },
            { userId: user3.id, amount: 1500, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Coffee and snacks",
        amount: 850,
        paidBy: user2.id,
        createdBy: user2.id,
        groupId: officeGroup.id,
        catagoery: "Food",
        splits: {
          create: [
            { userId: user2.id, amount: 425, splitType: "equal" },
            { userId: user3.id, amount: 425, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Office supplies",
        amount: 1250.4,
        paidBy: user3.id,
        createdBy: user3.id,
        groupId: officeGroup.id,
        catagoery: "Office",
        splits: {
          create: [
            { userId: user2.id, amount: 625.2, splitType: "equal" },
            { userId: user3.id, amount: 625.2, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Domain purchase",
        amount: 1200,
        paidBy: user3.id,
        createdBy: user3.id,
        groupId: projectGroup.id,
        catagoery: "Technology",
        splits: {
          create: [
            { userId: user1.id, amount: 400, splitType: "equal" },
            { userId: user2.id, amount: 400, splitType: "equal" },
            { userId: user3.id, amount: 400, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Server hosting",
        amount: 3600,
        paidBy: user1.id,
        createdBy: user1.id,
        groupId: projectGroup.id,
        catagoery: "Technology",
        splits: {
          create: [
            { userId: user1.id, amount: 1200, splitType: "equal" },
            { userId: user2.id, amount: 1200, splitType: "equal" },
            { userId: user3.id, amount: 1200, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Project dinner",
        amount: 4800.6,
        paidBy: user2.id,
        createdBy: user2.id,
        groupId: projectGroup.id,
        catagoery: "Food",
        splits: {
          create: [
            { userId: user1.id, amount: 1600.2, splitType: "equal" },
            { userId: user2.id, amount: 1600.2, splitType: "equal" },
            { userId: user3.id, amount: 1600.2, splitType: "equal" },
          ],
        },
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // Settlements/Payments
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
      {
        amount: 816.92,
        sentId: user1.id,
        receivedId: user2.id,
        groupId: tripGroup.id,
      },
      {
        amount: 625.2,
        sentId: user2.id,
        receivedId: user3.id,
        groupId: officeGroup.id,
      },
    ],
  });

  console.log("Seed completed successfully!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${groups.length} groups`);
  console.log("Created expenses and payments");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
