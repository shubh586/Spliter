"use client";
import React from "react";
import { PlusCircle, ChevronRight,Users } from "lucide-react"; //, Users, CreditCard, ChevronRight
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
const Dashboard = () => {
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
      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* card 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <p className="text-green-400">$00.00</p>
            </div>
          </CardContent>
          <CardFooter>
            <p>You are owed money</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>You are owed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <p className="text-green-400">$00.00</p>
            </div>
          </CardContent>
          <CardFooter>
            <p>From 1 people</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>You Owe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <p className="text-green-400">$00.00</p>
            </div>
          </CardContent>
          <CardFooter>
            <p>{`You don't owe anyone`}</p>
          </CardFooter>
        </Card>
      </div>
      {/* maain content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/*  left */}
        <div className="col-span-2 h-auto">
          <Expenses />
        </div>
        {/* has 2 div of cards */}
        <div className="grid grid-rows-1 gap-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Balance detatils</CardTitle>
                <Button asChild>
                  <Link href="/contacts">
                    view all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <p className="text-green-400">Balanced history components</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Groups</CardTitle>
                <Button asChild>
                  <Link href="/groups">
                    view all <Users className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <p className="text-green-400">Group list component</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <p> Create New Group</p>
                <Button asChild>
                  <Link href="/groups">
                    <Users className="ml-1 h-4 w-4" />
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
