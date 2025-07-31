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
import { User } from "@/app/types";
import GroupSelector from "./GroupSelector";
import { ParticipantSelector } from "./ParticipantSelector";
import type { newSplits, SelectedGroupMember, Splits } from "../../app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SplitSelector from "./SplitsSelector";
import { toast } from "sonner";
import axios from "axios";
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
  onSuccess
}: {
  type: string;
    currentUser: User;
  onSuccess: (id: string|undefined) => Promise<boolean>
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [participants, setParticipants] = useState<
    | {
        id: string;
        name: string;
        email: string;
        role: string;
        imageUrl: string | "";
      }[]
    | []
  >([]);
  const [selectedGroup, setSelectedGroup] =
    useState<SelectedGroupMember | null>(null);
  const [splits, setSplits] = useState<Splits[] | []>([]);

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
  const amountValue = watch("amount");
  const paidByUserId = watch("paidBy");

  if (!currentUser) return <div>Expenses cant be added</div>;
  const onSubmit =  async (data: z.infer<typeof expenseSchema>) => {
    try {
      const amount = parseFloat(data.amount);
      const formattedSplits = splits.map((split) => ({
        userId: split.userId,
        amount: split.amount,
        // paid: split.userId === data.paidBy,
      }));

      const totalSplitAmount = formattedSplits.reduce(
        (sum, split) => sum + split.amount, //sum is a acumulator function
        0
      );
      const tolerance = 0.01;

      if (Math.abs(totalSplitAmount - amount) > tolerance) {
        toast.error(
          `Split amounts don't add up to the total. Please adjust your splits.`
        );
        return;
      }
      const groupId = type === "individual" ? undefined : data.groupId;

      try {
        const reponse = await axios.post("/api/expenses/createExpense/", {
          description: data.description,
          amount: amount,
          category: data.category || "Other",
          date: data.date.getTime(), // Convert to timestamp
          paidByUserId: data.paidBy,
          splitType: data.splitType,
          splits: formattedSplits,
          groupId,
        });

   
        const rdata: string = reponse.data.expenseId;
        if (rdata) {
          console.log("sucess expenses created");
        }
      } catch (error) {
        console.log(error);
        console.log("error in the create expenses");
      }

      toast.success("Expense created successfully!");
      reset();

      const otherParticipant = participants.find(
        (p) => p.id !== currentUser.id
      );//return only the first match
      const otherUserId = otherParticipant?.id;

      if (onSuccess) onSuccess(type === "individual" ? otherUserId : groupId);
    } catch (error) {
      toast.error("Failed to create expense: " + (error as Error).message);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      {/* why */}
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
                Please select a group to continue
              </p>
            )}
          </div>
        )}
        {type === "individual" && (
          <div className="space-y-2">
            <Label>Participants</Label>
            <ParticipantSelector
              currentUser={currentUser}
              participants={participants}
              onParticipantsChange={setParticipants}
            />
            {participants.length <= 1 && (
              <p className="text-xs text-amber-600">
                Please add at least one other participant
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
            {participants &&
              participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.id === currentUser.id ? "You" : participant.name}
                </option>
              ))}
          </select>
          {errors.paidBy && (
            <p className="text-sm text-red-500">{errors.paidBy.message}</p>
          )}
        </div>

        {/* splits */}
        <div className="space-y-2">
          <Label>Split type</Label>
          <Tabs
            defaultValue="equal"
            onValueChange={(value: string) => {
              if (
                value === "equal" ||
                value === "percentage" ||
                value === "exact"
              ) {
                setValue("splitType", value);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="equal">Equal</TabsTrigger>
              <TabsTrigger value="percentage">Percentage</TabsTrigger>
              <TabsTrigger value="exact">Exact Amounts</TabsTrigger>
            </TabsList>
            <TabsContent value="equal" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Split equally among all participants
              </p>
              <SplitSelector
                type="equal"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidBy={paidByUserId}
                onSplitsChange={(newSplit: newSplits[]) => {
                  const splits: Splits[] = newSplit.map((split) => ({
                    userId: split.userId,
                    amount: split.amount,
                  }));
                  setSplits(splits);
                }} // Use setSplits directly
              />
            </TabsContent>
            <TabsContent value="percentage" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Split by percentage
              </p>
              <SplitSelector
                type="percentage"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidBy={paidByUserId}
                onSplitsChange={(newSplit: newSplits[]) => {
                  const splits: Splits[] = newSplit.map((split) => ({
                    userId: split.userId,
                    amount: split.amount,
                  }));
                  setSplits(splits);
                }} // Use setSplits directly
              />
            </TabsContent>
            <TabsContent value="exact" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Enter exact amounts
              </p>
              <SplitSelector
                type="exact"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidBy={paidByUserId}
                onSplitsChange={(newSplit: newSplits[]) => {
                  const splits: Splits[] = newSplit.map((split) => ({
                    userId: split.userId,
                    amount: split.amount,
                  }));
                  setSplits(splits);
                }} // Use setSplits directly
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || participants.length <= 1}
          className="hover:pointer-coarse:"
        >
          {isSubmitting ? "Creating..." : "Create Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpensesForm;
