"use client"
import React from "react";
import {Card, CardContent,} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpensesForm from "@/components/expenses/expensesForm";
const Expenses = () => {
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
                <ExpensesForm type={"individual"} />
              </TabsContent>

              <TabsContent value="group">
                <ExpensesForm type={"group"} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;
