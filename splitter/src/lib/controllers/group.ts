import prisma from "@/lib/prisma";
import { getCurrentUser } from "./storeduser";

export const getGroupExpenses = async (groupId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("not authenticated");

  //geting the group members,expenses,settelments
  const groupWithMembers = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!groupWithMembers) throw new Error("Group not found");

  //check the member exits in the groupWithMembers or not
  const isUser = groupWithMembers.members.some(
    (member) => member.userId === user.id
  );
  if (!isUser) throw new Error("currentUser is not present is the group");

  // gettting all group expenses

  const expenses = await prisma.expenses.findMany({
    where: { groupId },
    include: {
      splits: true,
    },
  });
  //gettin settelments
  const settlements = await prisma.payments.findMany({
    where: { groupId },
  });

  const groupMembers = groupWithMembers.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    email: member.user.email,
    role: member.role,
  }));

  //member ids
  const idss = groupMembers.map((member) => member.id);
  // idss.map((id) => ({ [id]: 0 }));=>[{a:0},{b:0}]
  const totals: { [key: string]: number } = Object.fromEntries(
    idss.map((id) => [id, 0]) // array of [key,value]
  ); // this object of key value {a:0,b:0,c:0}

  //ledger or record {a:{b:0,c:0}} a ko b aur c ko kitne dene hai

  const Records: { [key: string]: { [key: string]: number } } = {};

  for (const a of idss) {
    Records[a] = {};
    for (const b of idss) {
      if (a !== b) {
        Records[a][b] = 0;
      }
    }
  } //why not dot operator? wouldn't it have taken it dynamically

  for (const ex of expenses) {
    const pair = ex.paidBy;
    for (const sp of ex.splits) {
      if (sp.userId === pair) continue;
      const debter = sp.userId;
      totals[pair] += sp.amount;
      totals[debter] -= sp.amount;
      Records[debter][pair] += sp.amount;
    }
  }

  // settelments in groups

  for (const settel of settlements) {
    totals[settel.sentId] += settel.amount;
    totals[settel.receivedId] -= settel.amount;
    Records[settel.sentId][settel.receivedId] -= settel.amount;
  } // this contains the a ko b ko kitna dena and vice-versa

  //finally kisko kitna net amount dena hai.

  for (const a of idss) {
    for (const b of idss) {
      if (a >= b) continue;
      const diff = Records[a][b] - Records[b][a];
      if (diff > 0) {
        Records[a][b] = diff;
        Records[b][a] = 0;
      } else if (diff < 0) {
        Records[a][b] = 0;
        Records[b][a] = -diff;
      } else {
        Records[a][b] = 0;
        Records[b][a] = 0;
      }
    }
  }

  const balances = groupMembers.map((m) => ({
    ...m,
    owesTo: Object.entries(Records[m.id])
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        to: key,
        amount: value,
      })), //[{to,amount},{}] m ko dene hai
    owesFrom: idss
      .filter((id) => id !== m.id && Records[id][m.id] > 0)
      .map((other) => ({
        from: other,
        amount: Records[other][m.id],
      })), // paisa hi paisa aane wala hai
    totalBalance: totals[m.id],
  }));

  const memberLookup = Object.fromEntries(
    groupMembers.map((member) => [member.id, member])
  );
  //{id:member,id:member}
  return {
    group: {
      id: groupWithMembers.id,
      name: groupWithMembers.name,
      description: groupWithMembers?.description,
    },
    expenses,
    settlements,
    members: groupMembers,
    balances,
    memberLookup,
  };
};

export const getGroupsWithORWirhoutMemebrs = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("You are not authenticated");
  }

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: currentUser.id,
        },
      },
    },
    include: {
      members: true,
    },
  });
  if (groups.length === 0) {
    return {
      groups:[]
    }
  }
  return {
    groups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      members: group.members.length,
    })),
  };
};

export const getGroupMembersWithId = async (groupId: string | null) => {
  if (!groupId) {
    throw new Error("Problem in loading groups");
  }

  const selectedGroup = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!selectedGroup) {
    throw new Error("Group may not exits . please create the group");
  }
  return {
    selectedGroup: {
      id: selectedGroup.id,
      name: selectedGroup.name,
      description: selectedGroup.description,
      createdAt: selectedGroup.createdAt,
      members: selectedGroup.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
      })),
    },
  };
};
