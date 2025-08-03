import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find existing Shubham user by ID
  const shubham = await prisma.user.findUnique({
    where: { id: "266f2cc6-4f42-496e-a48b-398a40344873" },
  });

  if (!shubham) {
    throw new Error(
      "Shubham user with ID 266f2cc6-4f42-496e-a48b-398a40344873 not found in database"
    );
  }

  console.log(`✅ Found existing user: ${shubham.name} (${shubham.email})`);
  console.log(`🆔 User ID: ${shubham.id}`);
  console.log(`🔑 Clerk ID: ${shubham.clerkId}`);

  // Create 9 new Indian users
  const newUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya.sharma.dev@gmail.com",
        clerkId: "clerk_priya_002",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Arjun Patel",
        email: "arjun.patel.tech@gmail.com",
        clerkId: "clerk_arjun_003",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sneha Gupta",
        email: "sneha.gupta.design@gmail.com",
        clerkId: "clerk_sneha_004",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Rajesh Kumar",
        email: "rajesh.kumar.finance@gmail.com",
        clerkId: "clerk_rajesh_005",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Kavya Reddy",
        email: "kavya.reddy.marketing@gmail.com",
        clerkId: "clerk_kavya_006",
        imageUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Vikram Singh",
        email: "vikram.singh.business@gmail.com",
        clerkId: "clerk_vikram_007",
        imageUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ananya Iyer",
        email: "ananya.iyer.consultant@gmail.com",
        clerkId: "clerk_ananya_008",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Rohit Joshi",
        email: "rohit.joshi.startup@gmail.com",
        clerkId: "clerk_rohit_009",
        imageUrl:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        name: "Meera Nair",
        email: "meera.nair.creative@gmail.com",
        clerkId: "clerk_meera_010",
        imageUrl:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      },
    }),
  ]);

  // Combine existing Shubham with new users
  const users = [shubham, ...newUsers];
  const [, priya, arjun, sneha, rajesh, kavya, vikram, ananya, rohit, meera] =
    users;
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create Groups with Members
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Goa Beach Trip 2025",
        description: "Annual friends trip to North Goa beaches",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: shubham.id, role: "admin", joinedAt: lastMonth },
            { userId: priya.id, role: "member", joinedAt: lastMonth },
            { userId: arjun.id, role: "member", joinedAt: lastMonth },
            { userId: sneha.id, role: "member", joinedAt: lastMonth },
            { userId: rajesh.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Office Colleagues - Pune",
        description: "Team expenses and office activities",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: priya.id, role: "admin", joinedAt: lastMonth },
            { userId: arjun.id, role: "member", joinedAt: lastMonth },
            { userId: kavya.id, role: "member", joinedAt: lastMonth },
            { userId: vikram.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Mumbai Flatmates",
        description: "Shared apartment expenses in Bandra",
        createdAt: lastMonth,
        members: {
          create: [
            { userId: sneha.id, role: "admin", joinedAt: lastMonth },
            { userId: ananya.id, role: "member", joinedAt: lastMonth },
            { userId: rohit.id, role: "member", joinedAt: lastMonth },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "College Friends Reunion",
        description: "IIT Delhi batch reunion expenses",
        createdAt: lastWeek,
        members: {
          create: [
            { userId: rajesh.id, role: "admin", joinedAt: lastWeek },
            { userId: vikram.id, role: "member", joinedAt: lastWeek },
            { userId: meera.id, role: "member", joinedAt: lastWeek },
            { userId: shubham.id, role: "member", joinedAt: lastWeek },
          ],
        },
      },
    }),
    prisma.group.create({
      data: {
        name: "Wedding Planning - Rajesh & Kavya",
        description: "Wedding expenses and planning costs",
        createdAt: lastWeek,
        members: {
          create: [
            { userId: rajesh.id, role: "admin", joinedAt: lastWeek },
            { userId: kavya.id, role: "admin", joinedAt: lastWeek },
            { userId: priya.id, role: "member", joinedAt: lastWeek },
            { userId: ananya.id, role: "member", joinedAt: lastWeek },
          ],
        },
      },
    }),
  ]);

  const [goaTrip, officeTeam, mumbaiFlat, collegeReunion, weddingPlanning] =
    groups;

  // ───────────────────────────────────────────────
  // 1-to-1 Expenses (Personal expenses between friends)
  // ───────────────────────────────────────────────

  const personalExpenses = await Promise.all([
    prisma.expenses.create({
      data: {
        description: "Dinner at Barbeque Nation",
        amount: 2150.75,
        paidBy: shubham.id,
        createdBy: shubham.id,
        category: "Food",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 1075.38, splitType: "equal" },
            { userId: priya.id, amount: 1075.37, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Ola cab to Phoenix Mall",
        amount: 280,
        paidBy: priya.id,
        createdBy: priya.id,
        category: "Transport",
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 140, splitType: "equal" },
            { userId: priya.id, amount: 140, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Movie tickets - RRR at PVR",
        amount: 950,
        paidBy: arjun.id,
        createdBy: arjun.id,
        category: "Entertainment",
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: arjun.id, amount: 475, splitType: "equal" },
            { userId: sneha.id, amount: 475, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Grocery shopping - BigBasket",
        amount: 3250.5,
        paidBy: sneha.id,
        createdBy: sneha.id,
        category: "Food",
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sneha.id, amount: 1950.3, splitType: "exact" }, // 60%
            { userId: rajesh.id, amount: 1300.2, splitType: "exact" }, // 40%
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Jio Fiber broadband bill",
        amount: 1299,
        paidBy: rajesh.id,
        createdBy: rajesh.id,
        category: "Utilities",
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: rajesh.id, amount: 433, splitType: "equal" },
            { userId: kavya.id, amount: 433, splitType: "equal" },
            { userId: vikram.id, amount: 433, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "CCD coffee session",
        amount: 380,
        paidBy: kavya.id,
        createdBy: kavya.id,
        category: "Food",
        date: now,
        splits: {
          create: [
            { userId: kavya.id, amount: 190, splitType: "equal" },
            { userId: ananya.id, amount: 190, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Auto rickshaw to station",
        amount: 120,
        paidBy: vikram.id,
        createdBy: vikram.id,
        category: "Transport",
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: vikram.id, amount: 60, splitType: "equal" },
            { userId: rohit.id, amount: 60, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Street food at Mohammed Ali Road",
        amount: 450,
        paidBy: ananya.id,
        createdBy: ananya.id,
        category: "Food",
        date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: ananya.id, amount: 225, splitType: "equal" },
            { userId: meera.id, amount: 225, splitType: "equal" },
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
        description: "Beach Resort - Calangute (3 nights)",
        amount: 22500,
        paidBy: shubham.id,
        createdBy: shubham.id,
        groupId: goaTrip.id,
        category: "Accommodation",
        date: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 4500, splitType: "equal" },
            { userId: priya.id, amount: 4500, splitType: "equal" },
            { userId: arjun.id, amount: 4500, splitType: "equal" },
            { userId: sneha.id, amount: 4500, splitType: "equal" },
            { userId: rajesh.id, amount: 4500, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Flight tickets - Pune to Goa (GoAir)",
        amount: 18750,
        paidBy: priya.id,
        createdBy: priya.id,
        groupId: goaTrip.id,
        category: "Transport",
        date: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 3750, splitType: "equal" },
            { userId: priya.id, amount: 3750, splitType: "equal" },
            { userId: arjun.id, amount: 3750, splitType: "equal" },
            { userId: sneha.id, amount: 3750, splitType: "equal" },
            { userId: rajesh.id, amount: 3750, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Scuba diving and parasailing",
        amount: 12500,
        paidBy: arjun.id,
        createdBy: arjun.id,
        groupId: goaTrip.id,
        category: "Entertainment",
        date: new Date(lastMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 2500, splitType: "equal" },
            { userId: priya.id, amount: 2500, splitType: "equal" },
            { userId: arjun.id, amount: 2500, splitType: "equal" },
            { userId: sneha.id, amount: 2500, splitType: "equal" },
            { userId: rajesh.id, amount: 2500, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Seafood dinner at Fisherman's Wharf",
        amount: 4250,
        paidBy: sneha.id,
        createdBy: sneha.id,
        groupId: goaTrip.id,
        category: "Food",
        date: new Date(lastMonth.getTime() + 8 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 850, splitType: "equal" },
            { userId: priya.id, amount: 850, splitType: "equal" },
            { userId: arjun.id, amount: 850, splitType: "equal" },
            { userId: sneha.id, amount: 850, splitType: "equal" },
            { userId: rajesh.id, amount: 850, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Rental bikes for 3 days",
        amount: 3750,
        paidBy: rajesh.id,
        createdBy: rajesh.id,
        groupId: goaTrip.id,
        category: "Transport",
        date: new Date(lastMonth.getTime() + 6 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: shubham.id, amount: 750, splitType: "equal" },
            { userId: priya.id, amount: 750, splitType: "equal" },
            { userId: arjun.id, amount: 750, splitType: "equal" },
            { userId: sneha.id, amount: 750, splitType: "equal" },
            { userId: rajesh.id, amount: 750, splitType: "equal" },
          ],
        },
      },
    }),

    // Office Team Expenses
    prisma.expenses.create({
      data: {
        description: "Team lunch at Mainland China",
        amount: 2400,
        paidBy: priya.id,
        createdBy: priya.id,
        groupId: officeTeam.id,
        category: "Food",
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: priya.id, amount: 600, splitType: "equal" },
            { userId: arjun.id, amount: 600, splitType: "equal" },
            { userId: kavya.id, amount: 600, splitType: "equal" },
            { userId: vikram.id, amount: 600, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Office birthday celebration cake",
        amount: 1850,
        paidBy: kavya.id,
        createdBy: kavya.id,
        groupId: officeTeam.id,
        category: "Food",
        date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: priya.id, amount: 462.5, splitType: "equal" },
            { userId: arjun.id, amount: 462.5, splitType: "equal" },
            { userId: kavya.id, amount: 462.5, splitType: "equal" },
            { userId: vikram.id, amount: 462.5, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Team outing - Imagica Theme Park",
        amount: 8800,
        paidBy: vikram.id,
        createdBy: vikram.id,
        groupId: officeTeam.id,
        category: "Entertainment",
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: priya.id, amount: 2200, splitType: "equal" },
            { userId: arjun.id, amount: 2200, splitType: "equal" },
            { userId: kavya.id, amount: 2200, splitType: "equal" },
            { userId: vikram.id, amount: 2200, splitType: "equal" },
          ],
        },
      },
    }),

    // Mumbai Flatmates Expenses
    prisma.expenses.create({
      data: {
        description: "Monthly rent - Bandra flat",
        amount: 75000,
        paidBy: sneha.id,
        createdBy: sneha.id,
        groupId: mumbaiFlat.id,
        category: "Accommodation",
        date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sneha.id, amount: 25000, splitType: "equal" },
            { userId: ananya.id, amount: 25000, splitType: "equal" },
            { userId: rohit.id, amount: 25000, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Electricity bill - MSEB",
        amount: 4200,
        paidBy: ananya.id,
        createdBy: ananya.id,
        groupId: mumbaiFlat.id,
        category: "Utilities",
        date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sneha.id, amount: 1400, splitType: "equal" },
            { userId: ananya.id, amount: 1400, splitType: "equal" },
            { userId: rohit.id, amount: 1400, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Household groceries - Nature's Basket",
        amount: 6750.25,
        paidBy: rohit.id,
        createdBy: rohit.id,
        groupId: mumbaiFlat.id,
        category: "Food",
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: sneha.id, amount: 2250.08, splitType: "equal" },
            { userId: ananya.id, amount: 2250.08, splitType: "equal" },
            { userId: rohit.id, amount: 2250.09, splitType: "equal" },
          ],
        },
      },
    }),

    // College Friends Reunion Expenses
    prisma.expenses.create({
      data: {
        description: "Hotel booking - ITC Maurya, Delhi",
        amount: 24000,
        paidBy: rajesh.id,
        createdBy: rajesh.id,
        groupId: collegeReunion.id,
        category: "Accommodation",
        date: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: rajesh.id, amount: 6000, splitType: "equal" },
            { userId: vikram.id, amount: 6000, splitType: "equal" },
            { userId: meera.id, amount: 6000, splitType: "equal" },
            { userId: shubham.id, amount: 6000, splitType: "equal" },
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Reunion dinner at Bukhara",
        amount: 8500,
        paidBy: vikram.id,
        createdBy: vikram.id,
        groupId: collegeReunion.id,
        category: "Food",
        date: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: rajesh.id, amount: 2125, splitType: "equal" },
            { userId: vikram.id, amount: 2125, splitType: "equal" },
            { userId: meera.id, amount: 2125, splitType: "equal" },
            { userId: shubham.id, amount: 2125, splitType: "equal" },
          ],
        },
      },
    }),

    // Wedding Planning Expenses
    prisma.expenses.create({
      data: {
        description: "Wedding venue advance - Leela Palace",
        amount: 150000,
        paidBy: rajesh.id,
        createdBy: rajesh.id,
        groupId: weddingPlanning.id,
        category: "Wedding",
        date: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: rajesh.id, amount: 75000, splitType: "exact" }, // 50%
            { userId: kavya.id, amount: 75000, splitType: "exact" }, // 50%
            { userId: priya.id, amount: 0, splitType: "exact" }, // Helper, no payment
            { userId: ananya.id, amount: 0, splitType: "exact" }, // Helper, no payment
          ],
        },
      },
    }),
    prisma.expenses.create({
      data: {
        description: "Wedding photography booking",
        amount: 85000,
        paidBy: kavya.id,
        createdBy: kavya.id,
        groupId: weddingPlanning.id,
        category: "Wedding",
        date: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        splits: {
          create: [
            { userId: rajesh.id, amount: 42500, splitType: "equal" },
            { userId: kavya.id, amount: 42500, splitType: "equal" },
            { userId: priya.id, amount: 0, splitType: "exact" },
            { userId: ananya.id, amount: 0, splitType: "exact" },
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
        amount: 140,
        sentId: shubham.id,
        receivedId: priya.id,
        groupId: null,
        note: "Ola cab to Phoenix Mall - thanks!",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 475,
        sentId: sneha.id,
        receivedId: arjun.id,
        groupId: null,
        note: "RRR movie tickets payment",
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 433,
        sentId: kavya.id,
        receivedId: rajesh.id,
        groupId: null,
        note: "Jio Fiber bill share",
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 190,
        sentId: ananya.id,
        receivedId: kavya.id,
        groupId: null,
        note: "CCD coffee payment",
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 60,
        sentId: rohit.id,
        receivedId: vikram.id,
        groupId: null,
        note: "Auto rickshaw fare",
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },

      // Goa Trip settlements
      {
        amount: 4500,
        sentId: priya.id,
        receivedId: shubham.id,
        groupId: goaTrip.id,
        note: "Beach resort booking share - Calangute",
        createdAt: new Date(lastMonth.getTime() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 3750,
        sentId: shubham.id,
        receivedId: priya.id,
        groupId: goaTrip.id,
        note: "Flight tickets payment - GoAir",
        createdAt: new Date(lastMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2500,
        sentId: rajesh.id,
        receivedId: arjun.id,
        groupId: goaTrip.id,
        note: "Scuba diving and parasailing share",
        createdAt: new Date(lastMonth.getTime() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 850,
        sentId: arjun.id,
        receivedId: sneha.id,
        groupId: goaTrip.id,
        note: "Seafood dinner at Fisherman's Wharf",
        createdAt: new Date(lastMonth.getTime() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 750,
        sentId: sneha.id,
        receivedId: rajesh.id,
        groupId: goaTrip.id,
        note: "Rental bikes payment for 3 days",
        createdAt: new Date(lastMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
      },

      // Office Team settlements
      {
        amount: 600,
        sentId: arjun.id,
        receivedId: priya.id,
        groupId: officeTeam.id,
        note: "Team lunch at Mainland China",
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 462.5,
        sentId: vikram.id,
        receivedId: kavya.id,
        groupId: officeTeam.id,
        note: "Birthday celebration cake contribution",
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2200,
        sentId: priya.id,
        receivedId: vikram.id,
        groupId: officeTeam.id,
        note: "Imagica Theme Park tickets",
        createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      },

      // Mumbai Flatmates settlements
      {
        amount: 25000,
        sentId: ananya.id,
        receivedId: sneha.id,
        groupId: mumbaiFlat.id,
        note: "Monthly rent - Bandra flat",
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 1400,
        sentId: rohit.id,
        receivedId: ananya.id,
        groupId: mumbaiFlat.id,
        note: "Electricity bill - MSEB",
        createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2250.08,
        sentId: sneha.id,
        receivedId: rohit.id,
        groupId: mumbaiFlat.id,
        note: "Household groceries - Nature's Basket",
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },

      // College Reunion settlements
      {
        amount: 6000,
        sentId: vikram.id,
        receivedId: rajesh.id,
        groupId: collegeReunion.id,
        note: "Hotel booking - ITC Maurya Delhi",
        createdAt: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2125,
        sentId: shubham.id,
        receivedId: vikram.id,
        groupId: collegeReunion.id,
        note: "Reunion dinner at Bukhara",
        createdAt: new Date(lastWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        amount: 2125,
        sentId: meera.id,
        receivedId: vikram.id,
        groupId: collegeReunion.id,
        note: "Bukhara dinner payment",
        createdAt: new Date(lastWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
      },

      // Wedding Planning settlements
      {
        amount: 42500,
        sentId: rajesh.id,
        receivedId: kavya.id,
        groupId: weddingPlanning.id,
        note: "Wedding photography booking share",
        createdAt: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("🎉 Seed completed successfully!");
  console.log(`👥 Found existing user: ${shubham.name}`);
  console.log(`👥 Created ${newUsers.length} new users`);
  console.log(`🏢 Created ${groups.length} groups`);
  console.log(`💰 Created ${personalExpenses.length} personal expenses`);
  console.log(`👨‍👩‍👧‍👦 Created ${groupExpenses.length} group expenses`);
  console.log(`💸 Created settlement payments with notes`);

  console.log("\n📊 Summary:");
  console.log("Existing User:", shubham.name);
  console.log("New Users:", newUsers.map((u) => u.name).join(", "));
  console.log("Groups:", groups.map((g) => g.name).join(", "));

  // Display user balances summary
  console.log("\n💳 Key User Details:");
  console.log(`- ${shubham.name} (${shubham.email}) - Primary user [EXISTING]`);
  console.log(`- ${priya.name} (${priya.email}) - Office team admin [NEW]`);
  console.log(
    `- ${rajesh.name} (${rajesh.email}) - Getting married, reunion organizer [NEW]`
  );
  console.log(`- ${sneha.name} (${sneha.email}) - Mumbai flatmate admin [NEW]`);
  console.log(`- ${kavya.name} (${kavya.email}) - Wedding co-planner [NEW]`);

  console.log("\n🏖️ Group Highlights:");
  console.log("- Goa Beach Trip: ₹61,750 total expenses (5 friends)");
  console.log("- Office Colleagues: ₹13,050 total expenses (4 members)");
  console.log("- Mumbai Flatmates: ₹85,950.25 total expenses (3 roommates)");
  console.log("- College Reunion: ₹32,500 total expenses (4 IIT alumni)");
  console.log(
    "- Wedding Planning: ₹2,35,000 total expenses (couple + helpers)"
  );
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
