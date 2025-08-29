"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";

import Settlements from "@/components/Settlements";
import useServerhook from "../../../../../hooks/useServerhook";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";
import { oneToOneExpenses, User } from "@/app/types";
import Expense from "@/components/Expense";
export default function PersonExpensesPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");
  const { currentUser, isLoading: gettinguser } = useCurrentUser();
  const { data, isLoading } = useServerhook<oneToOneExpenses>(
    "/api/person/getpertoperexpenses",
    "POST",
    {
      userId: params.id,
    }
  );

  if (gettinguser || isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  if (!currentUser) {
    return <div className="py-12">currentuser not found</div>;
  }
  if (!data) {
    return <div className="py-12">currentuser data found</div>;
  }

  const otherUser = data?.otherUser;
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balance = data?.balance || 0;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={otherUser.imageUrl === null ? "" : otherUser.imageUrl}
              />
              <AvatarFallback>
                {otherUser?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl gradient-title">{otherUser?.name}</h1>
              <p className="text-muted-foreground">{otherUser?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/settlements/user/${params.id}`}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Settle up
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/expenses`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add expense
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Balance card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              {balance === 0 ? (
                <p>You are all settled up</p>
              ) : balance > 0 ? (
                <p>
                  <span className="font-medium">{otherUser?.name}</span> owes
                  you
                </p>
              ) : (
                <p>
                  You owe <span className="font-medium">{otherUser?.name}</span>
                </p>
              )}
            </div>
            <div
              className={`text-2xl font-bold ${balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : ""}`}
            >
              ${Math.abs(balance).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for expenses and settlements */}
      <Tabs
        defaultValue="expenses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">
            Expenses ({expenses.length})
          </TabsTrigger>
          <TabsTrigger value="settlements">
            Settlements ({settlements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <Expense
            expenses={expenses}
            showOtherPerson={false}
            otherPersonId={`${params.id}`}
            userLookupMap={{
              [currentUser.id]: {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                imageUrl: currentUser.imageUrl,
                role: "member",
              },
              [otherUser.id]: otherUser,
            }}
            currentUser={currentUser}
            isGroupExpense={false}
          />
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Settlements
            currentUser={currentUser}
            settlements={settlements}
            userLookupMap={{
              [currentUser.id]: {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                imageUrl: currentUser.imageUrl,
                role: "member",
              },
              [otherUser.id]: otherUser,
            }}
            isGroupExpense={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
