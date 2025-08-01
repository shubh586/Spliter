import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 5 users
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
    prisma.user.create({
      data: {
        name: "Emma Thompson",
        email: "emma.thompson.design@gmail.com",
        clerkId: "clerk_emma_004",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        email: "david.kim.tech@gmail.com",
        clerkId: "clerk_david_005",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
    }),
  ]);

  const [alex, sarah, mike, emma, david] = users;
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create Groups with Members
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Weekend Trip to Goa",
        description: "Beach vacation with friends",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: alex.id, role: "admin", joinedAt: lastMonth },
            { userId: sarah.id, role: "member", joinedAt: lastMonth },
            { userId: mike.id, role: "member", joinedAt: lastMonth },
            { userId: emma.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Office Team Expenses",
        description: "Shared office costs and team activities",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: sarah.id, role: "admin", joinedAt: lastMonth },
            { userId: mike.id, role: "member", joinedAt: lastMonth },
            { userId: david.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Project Alpha Development",
        description: "Tech project shared expenses",
        createdAt: lastWeek,
        members: {
          create: [
            { userId: david.id, role: "admin", joinedAt: lastWeek },
            { userId: alex.id, role: "member", joinedAt: lastWeek },
            { userId: emma.id, role: "member", joinedAt: lastWeek },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Flatmates",
        description: "Apartment shared expenses",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: emma.id, role: "admin", joinedAt: lastMonth },
            { userId: sarah.id, role: "member", joinedAt: lastMonth },
            { userId: david.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
  ]);

  const [goaTrip, officeTeam, projectAlpha, flatmates] = groups;

  // ───────────────────────────────────────────────
  // 1-to-1 Expenses (Personal expenses between friends)
  // ───────────────────────────────────────────────

  const personalExpenses = await Promise.all([
    prisma.expenses.create({
      data: {
        description: "Dinner at Tandoor Palace",
        amount: 1850.5,
        paidBy: alex.id,
        createdBy: alex.id,
        category: "Food",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 925.25, splitType: "equal" },
            { userId: sarah.id, amount: 925.25, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Uber ride to party",
        amount: 650,
        paidBy: sarah.id,
        createdBy: sarah.id,
        category: "Transport",
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 325, splitType: "equal" },
            { userId: sarah.id, amount: 325, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Movie tickets - Avengers",
        amount: 800,
        paidBy: mike.id,
        createdBy: mike.id,
        category: "Entertainment",
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: mike.id, amount: 400, splitType: "equal" },
            { userId: emma.id, amount: 400, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Grocery shopping - Big Bazaar",
        amount: 2340.75,
        paidBy: emma.id,
        createdBy: emma.id,
        category: "Food",
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: emma.id, amount: 1404.45, splitType: "exact" }, // 60%
            { userId: david.id, amount: 936.3, splitType: "exact" }, // 40%
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "WiFi bill - Airtel",
        amount: 1599,
        paidBy: david.id,
        createdBy: david.id,
        category: "Utilities",
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: david.id, amount: 533, splitType: "equal" },
            { userId: sarah.id, amount: 533, splitType: "equal" },
            { userId: emma.id, amount: 533, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Coffee at Starbucks",
        amount: 480,
        paidBy: sarah.id,
        createdBy: sarah.id,
        category: "Food",
        date: now,
        splits: {
          create: [
            { userId: sarah.id, amount: 240, splitType: "equal" },
            { userId: mike.id, amount: 240, splitType: "equal" },
          ],
        },
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // Group Expenses
  // ───────────────────────────────────────────────

  const groupExpenses = await Promise.all([
    // Goa Trip Expenses
    prisma.expenses.create({
      data: {
        description: "Beach resort booking - 3 nights",
        amount: 16800,
        paidBy: alex.id,
        createdBy: alex.id,
        groupId: goaTrip.id,
        category: "Accommodation",
        date: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 4200, splitType: "equal" },
            { userId: sarah.id, amount: 4200, splitType: "equal" },
            { userId: mike.id, amount: 4200, splitType: "equal" },
            { userId: emma.id, amount: 4200, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Flight tickets - Mumbai to Goa",
        amount: 24000,
        paidBy: sarah.id,
        createdBy: sarah.id,
        groupId: goaTrip.id,
        category: "Transport",
        date: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 6000, splitType: "equal" },
            { userId: sarah.id, amount: 6000, splitType: "equal" },
            { userId: mike.id, amount: 6000, splitType: "equal" },
            { userId: emma.id, amount: 6000, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Water sports and activities",
        amount: 8500,
        paidBy: emma.id,
        createdBy: emma.id,
        groupId: goaTrip.id,
        category: "Entertainment",
        date: new Date(lastMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 2125, splitType: "equal" },
            { userId: sarah.id, amount: 2125, splitType: "equal" },
            { userId: mike.id, amount: 2125, splitType: "equal" },
            { userId: emma.id, amount: 2125, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Group dinner at beach shack",
        amount: 3200,
        paidBy: mike.id,
        createdBy: mike.id,
        groupId: goaTrip.id,
        category: "Food",
        date: new Date(lastMonth.getTime() + 8 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: alex.id, amount: 800, splitType: "equal" },
            { userId: sarah.id, amount: 800, splitType: "equal" },
            { userId: mike.id, amount: 800, splitType: "equal" },
            { userId: emma.id, amount: 800, splitType: "equal" },
          ],
        },
      },
    }),

    // Office Team Expenses
    prisma.expenses.create({
      data: {
        description: "Team lunch at Pizza Hut",
        amount: 1850,
        paidBy: sarah.id,
        createdBy: sarah.id,
        groupId: officeTeam.id,
        category: "Food",
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sarah.id, amount: 616.67, splitType: "equal" },
            { userId: mike.id, amount: 616.67, splitType: "equal" },
            { userId: david.id, amount: 616.66, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Office supplies - stationery",
        amount: 2450.8,
        paidBy: david.id,
        createdBy: david.id,
        groupId: officeTeam.id,
        category: "Office",
        date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sarah.id, amount: 816.93, splitType: "equal" },
            { userId: mike.id, amount: 816.93, splitType: "equal" },
            { userId: david.id, amount: 816.94, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Coffee machine for office",
        amount: 12500,
        paidBy: mike.id,
        createdBy: mike.id,
        groupId: officeTeam.id,
        category: "Office",
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sarah.id, amount: 4166.67, splitType: "equal" },
            { userId: mike.id, amount: 4166.67, splitType: "equal" },
            { userId: david.id, amount: 4166.66, splitType: "equal" },
          ],
        },
      },
    }),

    // Project Alpha Expenses
    prisma.expenses.create({
      data: {
        description: "AWS hosting - monthly",
        amount: 8500,
        paidBy: david.id,
        createdBy: david.id,
        groupId: projectAlpha.id,
        category: "Technology",
        date: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: david.id, amount: 2833.33, splitType: "equal" },
            { userId: alex.id, amount: 2833.33, splitType: "equal" },
            { userId: emma.id, amount: 2833.34, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Domain purchase - 2 years",
        amount: 2400,
        paidBy: alex.id,
        createdBy: alex.id,
        groupId: projectAlpha.id,
        category: "Technology",
        date: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: david.id, amount: 800, splitType: "equal" },
            { userId: alex.id, amount: 800, splitType: "equal" },
            { userId: emma.id, amount: 800, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Project celebration dinner",
        amount: 4500,
        paidBy: emma.id,
        createdBy: emma.id,
        groupId: projectAlpha.id,
        category: "Food",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: david.id, amount: 1500, splitType: "equal" },
            { userId: alex.id, amount: 1500, splitType: "equal" },
            { userId: emma.id, amount: 1500, splitType: "equal" },
          ],
        },
      },
    }),

    // Flatmates Expenses
    prisma.expenses.create({
      data: {
        description: "Electricity bill - January",
        amount: 3240,
        paidBy: emma.id,
        createdBy: emma.id,
        groupId: flatmates.id,
        category: "Utilities",
        date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: emma.id, amount: 1080, splitType: "equal" },
            { userId: sarah.id, amount: 1080, splitType: "equal" },
            { userId: david.id, amount: 1080, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "House cleaning service",
        amount: 2000,
        paidBy: sarah.id,
        createdBy: sarah.id,
        groupId: flatmates.id,
        category: "Utilities",
        date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: emma.id, amount: 666.67, splitType: "equal" },
            { userId: sarah.id, amount: 666.67, splitType: "equal" },
            { userId: david.id, amount: 666.66, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Monthly groceries - household",
        amount: 4850.5,
        paidBy: david.id,
        createdBy: david.id,
        groupId: flatmates.id,
        category: "Food",
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: emma.id, amount: 1616.83, splitType: "equal" },
            { userId: sarah.id, amount: 1616.83, splitType: "equal" },
            { userId: david.id, amount: 1616.84, splitType: "equal" },
          ],
        },
      },
    }),
  ]);

  // ───────────────────────────────────────────────
  // Settlements/Payments with Notes
  // ───────────────────────────────────────────────

  await prisma.payments.createMany({
    data: [
      // Personal settlements
      {
        amount: 325,
        sentId: alex.id,
        receivedId: sarah.id,
        groupId: null,
        note: "Uber ride payment - thanks for booking!",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 400,
        sentId: emma.id,
        receivedId: mike.id,
        groupId: null,
        note: "Movie tickets reimbursement",
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 533,
        sentId: sarah.id,
        receivedId: david.id,
        groupId: null,
        note: "WiFi bill share",
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },

      // Group settlements - Goa Trip
      {
        amount: 4200,
        sentId: sarah.id,
        receivedId: alex.id,
        groupId: goaTrip.id,
        note: "Resort booking share - Goa trip",
        createdAt: new Date(lastMonth.getTime() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 6000,
        sentId: alex.id,
        receivedId: sarah.id,
        groupId: goaTrip.id,
        note: "Flight tickets payment",
        createdAt: new Date(lastMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2125,
        sentId: mike.id,
        receivedId: emma.id,
        groupId: goaTrip.id,
        note: "Water sports activity share",
        createdAt: new Date(lastMonth.getTime() + 8 * 24 * 60 * 60 * 1000),
      },

      // Office Team settlements
      {
        amount: 616.67,
        sentId: mike.id,
        receivedId: sarah.id,
        groupId: officeTeam.id,
        note: "Team lunch at Pizza Hut",
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 4166.67,
        sentId: sarah.id,
        receivedId: mike.id,
        groupId: officeTeam.id,
        note: "Coffee machine contribution",
        createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      },

      // Project Alpha settlements
      {
        amount: 2833.33,
        sentId: alex.id,
        receivedId: david.id,
        groupId: projectAlpha.id,
        note: "AWS hosting monthly payment",
        createdAt: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 800,
        sentId: emma.id,
        receivedId: alex.id,
        groupId: projectAlpha.id,
        note: "Domain purchase share",
        createdAt: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
      },

      // Flatmates settlements
      {
        amount: 1080,
        sentId: sarah.id,
        receivedId: emma.id,
        groupId: flatmates.id,
        note: "Electricity bill - January",
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 666.67,
        sentId: david.id,
        receivedId: sarah.id,
        groupId: flatmates.id,
        note: "House cleaning service share",
        createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 1616.83,
        sentId: emma.id,
        receivedId: david.id,
        groupId: flatmates.id,
        note: "Monthly groceries contribution",
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("🎉 Seed completed successfully!");
  console.log(`👥 Created ${users.length} users`);
  console.log(`🏢 Created ${groups.length} groups`);
  console.log(`💰 Created ${personalExpenses.length} personal expenses`);
  console.log(`👨‍👩‍👧‍👦 Created ${groupExpenses.length} group expenses`);
  console.log(`💸 Created settlement payments with notes`);

  console.log("\n📊 Summary:");
  console.log("Users:", users.map((u) => u.name).join(", "));
  console.log("Groups:", groups.map((g) => g.name).join(", "));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
