"use client";
import React from "react";
import { PlusCircle, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Expenses } from "@/components/dashboard/Expenses";
import useServerhook from "../../../../hooks/useServerhook";
import {
  BalanceSummary,
  getUserGroupList,
  monthlySpendingList,
  User,
} from "@/app/types";
import BalanceSummaryList from "@/components/dashboard/BalancyHistory";
import { GroupList } from "@/components/dashboard/GroupList";
import BarLoader from "react-spinners/BarLoader";

const Dashboard = () => {
  const { data: currentUser, isLoading: userLoading } = useServerhook<User>(
    "/api/user/currentuser"
  );

  const { data: balances, isLoading: balancesLoading } =
    useServerhook<BalanceSummary>("/api/dashboard/getuserspending", "POST", {
      userId: currentUser?.id,
    });

  const { data: groups, isLoading: groupsLoading } =
    useServerhook<getUserGroupList>("/api/dashboard/getusergroups", "POST", {
      userId: currentUser?.id,
    });

  const { data: totalSpent, isLoading: totalSpentLoading } =
    useServerhook<number>("/api/dashboard/gettotalspending", "POST", {
      userId: currentUser?.id,
    });

  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useServerhook<monthlySpendingList>(
      "/api/dashboard/getmonthlyspending",
      "POST",
      {
        userId: currentUser?.id,
      }
    );
  const isLoading =
    userLoading ||
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  if (isLoading || !currentUser) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }
  return (
    <div className="container mx-auto space-y-6 py-6 ">
      {/*  */}
      <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="gradient-title text-5xl">Dashboard</h1>
        <Button asChild>
          <Link href="/expenses">
            <PlusCircle className='"mr-2 h-4 w-4' />
            Add Expenses
          </Link>
        </Button>
      </div>
      {/* balance overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* card 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balances?.totalBalance !== undefined &&
              balances.totalBalance > 0 ? (
                <span className="text-green-600">
                  +${balances?.totalBalance.toFixed(2)}
                </span>
              ) : balances?.totalBalance !== undefined &&
              balances.totalBalance < 0 ? (
                <span className="text-red-600">
                  -${Math.abs(balances?.totalBalance).toFixed(2)}
                </span>
              ) : (
                <span>$0.00</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground mt-1">
              {balances?.totalBalance??0 > 0
                ? "You are owed money"
                : balances?.totalBalance??0 < 0
                  ? "You owe money"
                  : "All settled up!"}
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>You are owed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${balances?.youAreOwed.toFixed(2)}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground mt-1">
              From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>You Owe</CardTitle>
          </CardHeader>
          <CardContent>
            {(balances?.oweDetails?.youOwe?.length?? 0) > 0 ? (
              <>
                <div className="text-2xl font-bold text-red-600">
                  ${balances?.youOwe.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  To {balances?.oweDetails?.youOwe?.length || 0} people
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground mt-1">
                  You don&apos;t owe anyone
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/*  left */}
        <div className="col-span-2 h-auto">
          <Expenses monthlySpending={monthlySpending??[]} totalSpent={totalSpent??0} />
        </div>
        {/*right has 2 div of cards */}
        <div className="grid grid-rows-1 gap-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Balance detatils</CardTitle>
                <Button
                  asChild
                  variant="link"
                  className="bg-gradient-to-bl from-green-500 to-green-700 hover:brightness-110 text-white p-0"
                >
                  <Link href="/contacts">
                    view all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BalanceSummaryList balances={balances??{ totalBalance: 0, youAreOwed: 0, youOwe: 0, oweDetails: { youOwe: [], youAreOwedBy: [] } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Groups</CardTitle>
                <Button
                  asChild
                  variant="link"
                  className="bg-gradient-to-bl from-green-500 to-green-700 hover:brightness-110 text-white p-0"
                >
                  <Link href="/contacts">
                    view all <Users className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <GroupList groups={groups??[]} />
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/contacts?createGroup=true">
                    <Users className="ml-1 h-4 w-4" />
                    Create New Group
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
