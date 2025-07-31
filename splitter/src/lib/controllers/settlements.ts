import prisma from "../prisma";
import { getCurrentUser } from "./storeduser";

type OtherUser ={
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
}

type UserSettlementData ={
  type: "user";
  counterpart: OtherUser;
  youAreOwed: number;
  youOwe: number;
  netBalance: number;
}

type GroupMemberBalance ={
  userId: string;
  name: string;
  imageUrl: string | null;
  youAreOwed: number;
  youOwe: number;
  netBalance: number;
}

type GroupSettlementData ={
  type: "group";
  group: {
    id: string;
    name: string;
    description: string | null;
  };
  balances: GroupMemberBalance[];
}

type settlementsArgs ={
  amount: number; 
  note?: string;
  paidBy: string;
  receivedBy: string;
  groupId?: string; 
  // relatedExpenseIds?: string[];
}

type settlementsType ={
  entityType: string; 
  entityId: string; 
}

export const createSettlement = async (

  args: settlementsArgs
) => {
  
  const caller = await getCurrentUser()

  if (!caller) {
    throw new Error("User not found");
  }
  if (args.amount <= 0) throw new Error("Amount must be positive");
  if (args.paidBy === args.receivedBy) {
    throw new Error("Payer and receiver cannot be the same user");
  }
  if (caller.id !== args.paidBy && caller.id !== args.receivedBy) {
    throw new Error("You must be either the payer or the receiver");
  }

  if (args.groupId) {
    const group = await prisma.group.findUnique({
      where: { id: args.groupId },
      include: {
        members: true,
      },
    });

    if (!group) throw new Error("Group not found");

    const isMember = (uid: string) =>
      group.members.some((m) => m.userId === uid);
    if (!isMember(args.paidBy) || !isMember(args.receivedBy)) {
      throw new Error("Both parties must be members of the group");
    }
  }

  
  return await prisma.payments.create({
    data: {
      amount: args.amount,
      sentId: args.paidBy,
      receivedId: args.receivedBy,
      groupId: args.groupId,
      //note:args.note
    },
  });
};


export const getSettlementData = async (
  args: settlementsType
): Promise<UserSettlementData | GroupSettlementData> => {
  // get current user
  const me = await getCurrentUser()

  if (!me) {
    throw new Error("Current user not found");
  }

    if (args.entityType === "user") {

    const other = await prisma.user.findUnique({
      where: { id: args.entityId },
    });

    if (!other) throw new Error("User not found");

   
    const expenses = await prisma.expenses.findMany({
      where: {
        OR: [
          { paidBy: me.id, groupId: null },
          { paidBy: other.id, groupId: null },
        ],
      },
      include: {
        splits: true,
      },
    });
      

    let owed = 0; // they owe me unko muje dene hai
    let owing = 0; // I owe them mujhe unko dene hai

    for (const exp of expenses) {
      const involvesMe =
        exp.paidBy === me.id || exp.splits.some((s) => s.userId === me.id);
      const involvesThem =
        exp.paidBy === other.id ||
        exp.splits.some((s) => s.userId === other.id);

      if (!involvesMe || !involvesThem) continue;

      // case 1: I paid
      if (exp.paidBy === me.id) {
        const split = exp.splits.find(
          (s) => s.userId === other.id
        );
        if (split) owed += split.amount;
      }

      // case 2: They paid
      if (exp.paidBy === other.id) {
        const split = exp.splits.find((s) => s.userId === me.id);
        if (split) owing += split.amount;
      }
    }

    
    const settlements = await prisma.payments.findMany({
      where: {
        OR: [
          { sentId: me.id, groupId: null },
          { sentId: other.id, groupId: null },
        ],
      },
    });

    for (const st of settlements) {
      if (st.sentId === me.id && st.receivedId === other.id) {
        
        owing = Math.max(0, owing - st.amount);
      } else if (st.sentId === other.id && st.receivedId === me.id) {
       
        owed = Math.max(0, owed - st.amount);
      }
    }

    return {
      type: "user",
      counterpart: {
        userId: other.id,
        name: other.name,
        email: other.email,
        imageUrl: other.imageUrl,
      },
      youAreOwed: owed,
      youOwe: owing,
      netBalance: owed - owing, 
    };
  } else if (args.entityType === "group") {
    const group = await prisma.group.findUnique({
      where: { id: args.entityId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) throw new Error("Group not found");

    const isMember = group.members.some((m) => m.userId === me.id);
    if (!isMember) throw new Error("You are not a member of this group");

    const expenses = await prisma.expenses.findMany({
      where: { groupId: group.id },
      include: {
        splits: true,
      },
    });

    const balances: Record<string, { owed: number; owing: number }> = {};
    group.members.forEach((m) => {
      if (m.userId !== me.id) {
        balances[m.userId] = { owed: 0, owing: 0 };
      }
    });

    
    for (const exp of expenses) {
      if (exp.paidBy === me.id) {
     
        exp.splits.forEach((split) => {
          if (split.userId !== me.id) {
            if (balances[split.userId]) {
              balances[split.userId].owed += split.amount;
            }
          }
        });
      } else if (balances[exp.paidBy]) {
        
        const split = exp.splits.find((s) => s.userId === me.id);
        if (split) {
          balances[exp.paidBy].owing += split.amount;
        }
      }
    }


    const settlements = await prisma.payments.findMany({
      where: { groupId: group.id },
    });

    for (const st of settlements) {
      
      if (st.sentId === me.id && balances[st.receivedId]) {
        balances[st.receivedId].owing = Math.max(
          0,
          balances[st.receivedId].owing - st.amount
        );
      }
      if (st.receivedId === me.id && balances[st.sentId]) {
        balances[st.sentId].owed = Math.max(
          0,
          balances[st.sentId].owed - st.amount
        );
      }
    }

    const list: GroupMemberBalance[] = Object.keys(balances).map((uid) => {
      const member = group.members.find((m) => m.userId === uid);
      const { owed, owing } = balances[uid];
      return {
        userId: uid,
        name: member?.user.name || "Unknown",
        imageUrl: member?.user.imageUrl || null,
        youAreOwed: owed,
        youOwe: owing,
        netBalance: owed - owing,
      };
    });

    return {
      type: "group",
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
      },
      balances: list,
    };
  }

  
  throw new Error("Invalid entityType; expected 'user' or 'group'");
};
