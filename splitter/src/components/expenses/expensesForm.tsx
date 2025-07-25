"use client";
import React, { useState } from "react";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useServerhook from "../../../hooks/useServerhook";
import { User } from "@/app/(main)/groups/[id]/types";
import GroupSelector from "./GroupSelector";
import { BarLoader } from "react-spinners";
// import { ParticipantSelector } from "./ParticipantSelector";
import type { SelectedGroupMember } from "../../app/(main)/groups/[id]/types";
const categories = getAllCategories();
const expenseSchema = z.object({
  description: z.string().min(1, "Description is required "),
  amount: z
    .string()
    .min(1, "amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive required",
    }),
  category: z.string().optional(),
  date: z.date(),
  paidBy: z.string().min(1, "Payer is required"),
  splitType: z.enum(["equal", "percentage", "exact"]),
  groupId: z.string().optional(),
});

const ExpensesForm = ({
  type,
  currentUser,
}: {
  type: string;
  currentUser: User;
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [participants, setParticipants] = useState<
    | {
        id: string;
        name: string;
        email: string;
        role: string;
      }[]
    | null
  >(null);
  const [selectedGroup, setSelectedGroup] =
    useState<SelectedGroupMember | null>(null);
  // const [splits, setSplits] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date(),
      paidBy: currentUser?.id || "",
      splitType: "equal",
      groupId: undefined,
    },
  });
  if (!currentUser) return <div>Expenses cant be added</div>;

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
              {...register("description")}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              {...register("amount")}
            />
          </div>
        </div>
        {/* data and category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="category">Category</Label>
            <CategorySelector
              categories={categories}
              onChange={(categoryId: string) => {
                if (categoryId) {
                  setValue("category", categoryId);
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
                  onSelect={(date) => {
                    setDate(date);
                    if (date) setValue("date", date);
                  }}
                  initialFocus
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* group selector */}

        {type === "group" && (
          <div className="space-y-2">
            <Label>Group</Label>
            <GroupSelector
              onChange={(group: SelectedGroupMember | null) => {
                if (group) {
                  setSelectedGroup(group);
                  setValue("groupId", group.id);
                  if (group.members && Array.isArray(group.members)) {
                    setParticipants(group.members);
                  }
                }
              }}
            />
            {!selectedGroup && (
              <p className="mt-2 pl-1 text-xs text-amber-600">
                Please select a group to
                continue
              </p>
            )}
          </div>
        )}

        {/* Paid by s*/}
        <div className="space-y-2">
          <Label>Paid by</Label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("paidBy")}
          >
            <option value="">Select who paid</option>
            {participants&&participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.id === currentUser.id ? "You" : participant.name}
              </option>
            ))}
          </select>
          {errors.paidBy && (
            <p className="text-sm text-red-500">{errors.paidBy.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ExpensesForm;
