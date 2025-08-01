import { User, Balance } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const Groupbalances = ({
  currentUser,
  balances,
}: {
  currentUser: User;
  balances: Balance[];
}) => {
  if (balances.length === 0 || !currentUser) {
    return <div>Balances not found</div>;
  }
  const me = balances.find((user) => currentUser.id === user.id);
  if (!me) {
    return <div>mai basdk group ka memeber nahi hu</div>;
  }
  const userMap: { [key: string]: Balance } = Object.fromEntries(
    balances.map((balance) => [balance.id, balance])
  );
  const owesFrom = me.owesFrom
    .map(({ from, amount }) => ({
      ...userMap[from],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount); //anne wala hai re baba
  const owesTo = me.owesTo
    .map(({ to, amount }) => ({
      ...userMap[to],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
  const isSettleup: boolean =
    me.totalBalance === 0 && owesFrom.length === 0 && owesTo.length === 0;

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Group Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current user's total balance */}
          <div className="text-center pb-4 border-b">
            <p className="text-sm text-muted-foreground mb-1">Your balance</p>
            <p
              className={`text-2xl font-bold ${
                me.totalBalance > 0
                  ? "text-green-600"
                  : me.totalBalance < 0
                    ? "text-red-600"
                    : ""
              }`}
            >
              {me.totalBalance > 0
                ? `+$${me.totalBalance.toFixed(2)}`
                : me.totalBalance < 0
                  ? `-$${Math.abs(me.totalBalance).toFixed(2)}`
                  : "$0.00"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {me.totalBalance > 0
                ? "You are owed money"
                : me.totalBalance < 0
                  ? "You owe money"
                  : "You are all settled up"}
            </p>
          </div>

          {isSettleup ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Everyone is settled up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* People who owe the current user */}
              {owesFrom.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <ArrowUpCircle className="h-4 w-4 text-green-500 mr-2" />
                    Owed to you
                  </h3>
                  <div className="space-y-3">
                    {owesFrom.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                member.imageUrl === null
                                  ? ""
                                  : `${member.imageUrl}`
                              }
                            />
                            <AvatarFallback>
                              {member.name?.charAt(0) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <span className="font-medium text-green-600">
                          ${member.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* People the current user owes */}
              {owesTo.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <ArrowDownCircle className="h-4 w-4 text-red-500 mr-2" />
                    You owe
                  </h3>
                  <div className="space-y-3">
                    {owesTo.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                member.imageUrl === null
                                  ? ""
                                  : `${member.imageUrl}`
                              }
                            />
                            <AvatarFallback>
                              {member.name?.charAt(0) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <span className="font-medium text-red-600">
                          ${member.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Groupbalances;
