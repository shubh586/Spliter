
export type GroupMember = {
  id: string;
  name: string;
  email: string; 
  role: "admin" | "member";
};
export type User = {
  id: string;
  email: string;
  name: string;
  clerkId: string;
};
export type Expense = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  paidBy: string;
  groupId: string | null;
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
  groupId: string | null;
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
  totalBalance:number
};


export type GroupExpenseData = {
  group: {
    id: string,
    name: string,
    description: string | null
  },
  expenses: Expense[],
  settlements: Settlement[],
  members: GroupMember[],
  balances: Balance[],
  memberLookup: { [key: string]: GroupMember }
};

