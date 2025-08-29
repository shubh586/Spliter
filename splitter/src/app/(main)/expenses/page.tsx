"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpensesForm from "@/components/expenses/expensesForm";
import { BarLoader } from "react-spinners";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { User } from "../../types";
import router from "next/router";
const Expenses = () => {
  const { currentUser, isLoading } = useCurrentUser();
  if (isLoading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }
  if (!currentUser) {
    return (
      <div>
        <p className="py-6"> Can load expense</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-3xl space-y-6 py-6">
      <div>
        <h1 className="text-5xl gradient-title">Add a new expense</h1>
        <p className="text-muted-foreground mt-1">
          Record a new expense to split with others
        </p>
      </div>
      <div>
        <Card>
          <CardContent>
            <Tabs defaultValue="individual" className="pb-3">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="individual">
                  Individual Expenses
                </TabsTrigger>
                <TabsTrigger value="group">Group Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="individual">
                <ExpensesForm
                  type={"individual"}
                  currentUser={currentUser}
                  onSuccess={(id: string|undefined) => router.push(`/person/${id}`)}
                />
              </TabsContent>

              <TabsContent value="group">
                <ExpensesForm
                  type={"group"}
                  currentUser={currentUser}
                  onSuccess={(id:string|undefined) => router.push(`/group/${id}`)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;
