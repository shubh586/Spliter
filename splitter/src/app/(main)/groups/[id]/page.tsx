"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useServerhook from "../../../../../hooks/useServerhook";
import  useCurrentUser from "../../../../../hooks/useCurrentUser";
import { PlusCircle, ArrowLeftRight, ArrowLeft, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { BarLoader } from "react-spinners";
import { GroupExpenseData } from "../../../types";
import Members from "@/components/groups/Members";
import Groupbalances from "@/components/groups/Groupbalances";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Expense from "@/components/Expense";
import Link from "next/link";
import Settlements from "@/components/Settlements";
const Page = () => {
  const [activeTab, setActiveTab] = useState<string>("expenses");
  const params = useParams();
  const { currentUser, isLoading: getingUser } = useCurrentUser();

  // const router = useRouter();
  const { data, isLoading } = useServerhook<GroupExpenseData>(
    "/api/group/getallgroupexpenses",
    "POST",
    {
      groupId: params.id,
    }
  );

  if (getingUser) {
    return (
      <div className="container mx-auto py-12 ">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="container mx-auto py-12">
        <p>User not found</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container mx-auto py-12">
        <p>No data found</p>
      </div>
    );
  }

  // const group = data.group;
  const expenses = data.expenses;
  const settlements = data.settlements;
  const userLookUpMap = data.memberLookup;
  const members = data.members;
  const balances = data.balances;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      <div>
        <Button type="button" variant="outline" asChild>
          <Link href="/contacts">
            <ArrowLeft className="h-4 w-4" />
            Back Option
          </Link>
        </Button>
      </div>
      {/* name and settle up bar */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Name and mebers length bar */}
        <div className="sm:col-span-2 w-full">
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-primary/10 p-4 rounded-md">
              <Users className=" h-8 w-8 " />
            </div>
            <div>
              <p className=" gradient-title text-4xl">Shubham</p>
              <p className="text-muted-foreground ">2 members</p>
            </div>
          </div>
        </div>

        {/* settelup annd add expenses option */}
        <div className="flex flex-row justify-between w-full">
          <Button variant={"outline"} asChild>
            <Link href={`/settlements/group/${params.id}`}>
              <ArrowLeftRight className="w-4 h-4 " />
              SettleUp
            </Link>
          </Button>
          <Button asChild>
            <Link href="/expenses">
              <PlusCircle />
              Add expenses
            </Link>
          </Button>
        </div>
      </div>

      {/* grid of  */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 border-border rounded-xl shadow-sm w-full">
          <Groupbalances balances={balances} currentUser={currentUser} />
        </div>
        <div className="w-full">
          <Members members={members} currentUser={currentUser} />
        </div>
      </div>
      {/* tabs */}
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
            showOtherPerson={true}
            isGroupExpense={true}
            userLookupMap={userLookUpMap}
            currentUser={currentUser}
            otherPersonId={null}
          />
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Settlements
            settlements={settlements}
            currentUser={currentUser}
            userLookupMap={userLookUpMap}
            isGroupExpense={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
