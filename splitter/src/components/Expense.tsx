"use client";
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { getCategoryById, getCategoryIcon } from "@/lib/ex-categories";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Expense, GroupMember, User } from "@/app/types";

const Expense = ({
  expenses,
  userLookupMap,
  currentUser,
  showOtherPerson = true,
  isGroupExpense = false,
  otherPersonId = null,
}: {
  expenses: Expense[];
  userLookupMap: { [key: string]: GroupMember };
  currentUser: User;
  showOtherPerson: boolean;
  isGroupExpense: boolean;
  otherPersonId: string | null;
}) => {
  if (!currentUser) {
    return <div>No expenses found</div>;
  }
  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No expenses found
        </CardContent>
      </Card>
    );
  }
  const getUserDatails = (userId: string): GroupMember => {
    const user = userLookupMap[userId];
    return user;
  };
  const canDeleteExpense = (expense: Expense): boolean => {
    // const delete=expense.paidBy=currentUser.id || expense.createdBy===currentUser
    const canDelete = expense.paidBy === currentUser.id;
    return canDelete;
  };
  const handleDeleteExpense = async () => {
    //expense
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );
    if (!confirmed) return;
    try {
      // delete function api call
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense: " + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {expenses.map((expense, index) => {
        const payer = getUserDatails(expense.paidBy);
        const isCurrentUserPayer = expense.paidBy === currentUser.id;
        const category = getCategoryById(expense.category); //expense.category
        const CategoryIcon = getCategoryIcon(category.id);
        const showDeleteOption = canDeleteExpense(expense);

        return (
          <Card
            className="hover:bg-muted/30 transition-colors"
            key={`${expense.id}-${index}-${expense.createdAt}`}
          >
            <CardContent>
              <div className="flex items-center justify-between flex-wrap gap-2 ">
                <div className="flex items-center gap-3">
                  {/* Category icon */}
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>
                        {format(new Date(expense.createdAt), "MMM d, yyyy")}
                      </span>
                      {showOtherPerson && (
                        <>
                          <span>•</span>
                          <span>
                            {isCurrentUserPayer ? "You" : payer.name} paid
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {showDeleteOption && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteExpense()} //(expnse)
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  )}
                  <div className="text-left">
                    <div className="font-medium">
                      ${expense.amount.toFixed(2)}
                    </div>
                    {isGroupExpense ? (
                      <Badge variant="outline" className="mt-1">
                        Group expense
                      </Badge>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {isCurrentUserPayer ? (
                          <span className="text-green-600">You paid</span>
                        ) : (
                          <span className="text-red-600">
                            {payer.name} paid
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Display splits info */}
              <div className="mt-3 text-sm">
                <div className="flex gap-2 flex-wrap">
                  {expense.splits.map((split, idx) => {
                    const splitUser = getUserDatails(split.userId);
                    const isCurrentUser = split.userId === currentUser?.id;
                    const shouldShow =
                      showOtherPerson ||
                      (!showOtherPerson &&
                        (split.userId === currentUser?.id ||
                          split.userId === otherPersonId));

                    if (!shouldShow) return null;
                    if (!splitUser) return null;
                    return (
                      <Badge
                        key={idx}
                        variant={
                          split.userId === expense.paidBy
                            ? "outline"
                            : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={splitUser.imageUrl===null?"":`${splitUser.imageUrl}`} />
                          <AvatarFallback>
                            {splitUser.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {isCurrentUser ? "You" : splitUser.name}: $
                          {split.amount.toFixed(2)}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Expense;
