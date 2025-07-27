import { Role } from "@prisma/client";
export type GroupMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  imageUrl: string | "";
};
export type User = {
  id: string;
  email: string;
  name: string;
  clerkId: string;
  imageUrl: string | "";
};
export type Expense = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  paidBy: string;
  groupId?: string;
  splits: Split[];
};

export type Split = {
  id: string;
  createdAt: string;
  amount: number;
  expenseId: string;
  userId: string;
  splittype?: "equal" | "percentage" | "exact";
};

export type Settlement = {
  id: string;
  amount: number;
  createdAt: string;
  groupId?: string;
  sentId: string;
  receivedId: string;
};
export type Balance = GroupMember & {
  owesTo: {
    to: string;
    amount: number;
  }[];
  owesFrom: {
    from: string;
    amount: number;
  }[];
  totalBalance: number;
};

export type GroupExpenseData = {
  group: {
    id: string;
    name: string;
    description: string | null;
  };
  expenses: Expense[];
  settlements: Settlement[];
  members: GroupMember[];
  balances: Balance[];
  memberLookup: { [key: string]: GroupMember };
};

export type GroupSummary = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  members: number;
};

export type SelectedGroupMember = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  members: {
    id: string;
    name: string;
    email: string;
    role: Role;
    imageUrl: string | "";
  }[];
};

export type Splits = {
  userId: string;
  amount: number;
};

export type CreateExpenseInput = {
  description: string;
  amount: number;
  category: string;
  date: number;
  paidByUserId: string;
  splitType: "equal" | "percentage" | "exact";
  splits: Splits[];
  groupId?: string;
};

export type User1 = {
  id: string;
  name: string;
  email: string;
  imageUrl: string | "";
  type: "user";
};

export type Group1 = {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  type: "group";
};

export type ContactData = {
  users: User1[];
  groups: Group1[];
};

export type newSplits= {
  userId: string;
  name: string;
  email: string;
  imageUrl: string | "";
  amount: number;
  percentage: number;
  paid: boolean;
}
