import type { Settlement, User, GroupMember } from "@/app/types";
import { format } from "date-fns";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowLeftRight } from "lucide-react";
import { Badge } from "./ui/badge";

const Settlements = ({
  settlements,
  currentUser,
  userLookupMap,
  isGroupExpense = true,
}: {
  settlements: Settlement[];
  currentUser: User;
  userLookupMap: { [key: string]: GroupMember };
  isGroupExpense: boolean;
}) => {
  const getUserDatails = (userId: string): GroupMember => {
    const user = userLookupMap[userId];
    return user;
  };

  if (!currentUser || settlements.length === 0) {
    return (
      <div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No expenses found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {settlements.map((settlement) => {
        const payer = getUserDatails(settlement.sentId);
        const receiver = getUserDatails(settlement.receivedId);
        const isCurrentUserPayer: boolean = payer.id === currentUser.id;
        const isCurrentUserReceiver: boolean = receiver.id === currentUser.id;

        return (
          <Card
            key={settlement.id}
            className="hover:bg-muted/30 transition-colors"
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                {/* who paid who with date and note */}
                <div className="flex items-center gap-3">
                  {/* arrow */}
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                  </div>
                  {/* name and date */}
                  <div>
                    <h1 className="font-medium">
                      {isCurrentUserPayer
                        ? `You paid  ${receiver.name}`
                        : isCurrentUserReceiver
                          ? `${payer.name} paid you`
                          : `${payer.name} paid ${receiver.name}`}
                    </h1>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>
                        {format(new Date(settlement.createdAt), "MMM d, yyyy")}
                      </span>
                      {/* {settlement.note && (
                        <>
                          <span>•</span>
                          <span>{settlement.note}</span>
                        </>
                      )} */}
                    </div>
                  </div>
                </div>

                {/* expense and group related  */}
                <div className="text-right">
                  <div className="font-medium">
                    ${settlement.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isGroupExpense ? (
                      <Badge variant="outline">Group Expense</Badge>
                    ) : isCurrentUserPayer ? (
                      <span className="text-amber-600">You paid</span>
                    ) : (
                      <span className="text-green-600">You received</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Settlements;
