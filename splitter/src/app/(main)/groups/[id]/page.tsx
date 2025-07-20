"use client";
import React from "react";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useServerhook from "../../../../../hooks/useServerhook";
import { PlusCircle, ArrowLeftRight, ArrowLeft, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { BarLoader } from "react-spinners";
import { GroupExpenseData,User } from "./types";
import Members from "@/components/groups/Members";
import Groupbalances from "@/components/groups/Groupbalances";
const Page = () => {
  const params = useParams();
  const { data: currentUser, isLoading: getingUser } = useServerhook<User>(
    "/api/user/currentuser"
  );

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
      <div className="container mx-auto py-12">
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
   return <div className="container mx-auto py-12">
      <p>User not found</p>
    </div>;
  }
  if (!data) {
    return (
      <div className="container mx-auto py-12">
        <p>No data found</p>
      </div>
    );
  }

  // const group = data.group;
  // const expenses = data.expenses;
  // const settlements = data.settlements;
  // const userLookUpMap = data.memberLookup;
  const members = data.members;
  const balances = data.balances;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      <div>
        <Button type="button" variant="outline">
          <ArrowLeft />
          Back Option
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
        <div className="flex flex-row gap-4 w-full">
          <Button variant={"outline"}>
            <ArrowLeftRight className="w-4 h-4 " />
            SettleUp
          </Button>
          <Button>
            <PlusCircle />
            Add expenses
          </Button>
        </div>
      </div>
      {/* grid of  */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 border rounded-xl shadow-sm w-full">
          <Groupbalances balances={balances} currentUser={currentUser} />
        </div>
        <div className="w-full">
          <Members members={members} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};


export default Page;
