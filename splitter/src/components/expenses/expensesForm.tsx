"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import CategorySelector from "./CategorySelector";
import { getAllCategories } from "@/lib/ex-categories";



const ExpensesForm = ({ type }: { type: string }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const categories = getAllCategories(); // no need to declare type here type inference will figure it out from return type
  return (
    <form action="">
      <div className="space-y-4">
        {/* description and amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Lunch, movie tickets, etc."
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="0.00" />
          </div>
        </div>
        {/* data and category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="catagory">Description</Label>
            <CategorySelector
              categories={categories}
              onChange={(categoryId: string) => {
                if (categoryId) {
                }
              }}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal`}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* group selector */}
        {
          type === 'group' && <div>
            
          </div>
        }
      </div>
    </form>
  );
};

export default ExpensesForm;
