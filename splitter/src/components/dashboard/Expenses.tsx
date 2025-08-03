import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
//contains summary
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { monthlySpendingList } from "@/app/types";
export const Expenses = ({
  monthlySpending,
  totalSpent,
}: {
  monthlySpending: monthlySpendingList;
  totalSpent: number;
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData =
    monthlySpending?.map((item) => {
      const date = new Date(item.month);
      return {
        name: monthNames[date.getMonth()],
        amount: item.total,
      };
    }) || [];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/*  */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total this month</p>
              <h3 className="text-2xl font-bold mt-1">
                {" "}
                ${monthlySpending?.[currentMonth]?.total.toFixed(2) || "0.00"}
              </h3>
            </div>
            {/*  */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                ${totalSpent?.toFixed(2) || "0.00"}
              </p>
              <h3 className="text-2xl font-bold mt-1">${"0.00"}</h3>
            </div>
            {/*  */}
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => {
                    const num =
                      typeof value === "number"
                        ? value
                        : parseFloat(value as string);
                    return [`$${num.toFixed(2)}`, "Amount"];
                  }}
                  labelFormatter={() => "Spending"}
                />
                <Bar dataKey="amount" fill="#36d7b7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs sm:text-xl text-muted-foreground text-center mt-2">
            Monthly spending for  {currentYear}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
