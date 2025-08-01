"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import {
  UserSettlementData,
  GroupSettlementData,
  settlementsArgs,
} from "@/app/types";



// Props for the component
type SettlementFormProps = {
  entityType: "user" | "group";
  entityData: UserSettlementData | GroupSettlementData;
  currentUser: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  onSuccess?: () => void;
};

// Form schema validation
const settlementSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  note: z.string().optional(),
  paymentType: z.enum(["youPaid", "theyPaid"]),
});

type FormData = z.infer<typeof settlementSchema>;

export default function SettlementForm({
  entityType,
  entityData,
  currentUser,
  onSuccess,
}: SettlementFormProps) {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      amount: "",
      note: "",
      paymentType: "youPaid",
    },
  });

  // Get selected payment direction
  const paymentType = watch("paymentType");

  // API call to create settlement
  const createSettlement = async (datatri: settlementsArgs) => {
    try {
      const response = await axios.post(
        "/api/settlements/createsettlementsdata",
        datatri
      );
      const data = response.data
      if (data) {
        toast.success("Settlement is created successfully")
      }
    } catch (error) {
      toast.error("Settlements creation Failed ")
      console.log((error as Error)?.message);
    }
  };

  // single user settlement
  const handleUserSettlement = async (data: FormData) => {
    const entityDataUser = entityData as UserSettlementData;
    const amount = parseFloat(data.amount);

    try {
      // determine payer and receiver based on the selected payment type
      const paidBy =
        data.paymentType === "youPaid"
          ? currentUser.id
          : entityDataUser.OtherUser.userId;

      const receivedBy =
        data.paymentType === "youPaid"
          ? entityDataUser.OtherUser.userId
          : currentUser.id;

      await createSettlement({
        amount,
        note: data.note,
        paidBy,
        receivedBy,
        // no groupId for user settlements
      });

      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + (error as Error).message);
    }
  };

  // group settlement
  const handleGroupSettlement = async (
    data: FormData,
    selectedUserId: string
  ) => {
    if (!selectedUserId) {
      toast.error("Please select a group member to settle with");
      return;
    }

    const entityDataGroup = entityData as GroupSettlementData;
    const amount = parseFloat(data.amount);

    try {
      // get the selected user from the group balances
      const selectedUser = entityDataGroup.balances.find(
        (balance) => balance.userId === selectedUserId
      );

      if (!selectedUser) {
        toast.error("Selected user not found in group");
        return;
      }

      // determine payer and receiver based on the selected payment type and balances
      const paidBy =
        data.paymentType === "youPaid" ? currentUser.id : selectedUser.userId;

      const receivedBy =
        data.paymentType === "youPaid" ? selectedUser.userId : currentUser.id;

      await createSettlement({
        amount,
        note: data.note,
        paidBy,
        receivedBy,
        groupId: entityDataGroup.group.id,
      });

      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + (error as Error).message);
    }
  };

  // For group settlements, we need to select a member
  const [selectedGroupMemberId, setSelectedGroupMemberId] = useState<
    string | null
  >(null);

  // handle form submission
  const onSubmit = async (data: FormData) => {
    if (entityType === "user") {
      await handleUserSettlement(data);
    } else if (entityType === "group" && selectedGroupMemberId) {
      await handleGroupSettlement(data, selectedGroupMemberId);
    }
  };

  // render the form for individual settlement
  if (entityType === "user") {
    const entityDataUser = entityData as UserSettlementData;
    const otherUser = entityDataUser.OtherUser;
    const netBalance = entityDataUser.netBalance;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* balance information */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Current balance</h3>
          {netBalance === 0 ? (
            <p>You are all settled up with {otherUser.name}</p>
          ) : netBalance > 0 ? (
            <div className="flex justify-between items-center">
              <p>
                <span className="font-medium">{otherUser.name}</span> owes you
              </p>
              <span className="text-xl font-bold text-green-600">
                ${netBalance.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p>
                You owe <span className="font-medium">{otherUser.name}</span>
              </p>
              <span className="text-xl font-bold text-red-600">
                ${Math.abs(netBalance).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* payment direction */}
        <div className="space-y-2">
          <Label>Who paid?</Label>
          <RadioGroup
            defaultValue="youPaid"
            {...register("paymentType")}
            className="flex flex-col space-y-2"
            onValueChange={(value) => {
              register("paymentType").onChange({
                target: { name: "paymentType", value },
              });
            }}
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="youPaid" id="youPaid" />
              <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={currentUser.imageUrl || undefined} />
                    <AvatarFallback>
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>You paid {otherUser.name}</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="theyPaid" id="theyPaid" />
              <Label htmlFor="theyPaid" className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={otherUser.imageUrl || undefined} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{otherUser.name} paid you</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input
              id="amount"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              className="pl-7"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* note */}
        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Dinner, rent, etc."
            {...register("note")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  // render form for group settlement
  if (entityType === "group") {
    const entityDataGroup = entityData as GroupSettlementData;
    const groupMembers = entityDataGroup.balances;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* select group member */}
        <div className="space-y-2">
          <Label>Who are you settling with?</Label>
          <div className="space-y-2">
            {groupMembers.map((member) => {
              const isSelected = selectedGroupMemberId === member.userId;
              const isOwing = member.netBalance < 0; 
              const isOwed = member.netBalance > 0; 

              return (
                <div
                  key={member.userId}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedGroupMemberId(member.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl || undefined} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div
                      className={`font-medium ${
                        isOwing
                          ? "text-green-600"
                          : isOwed
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      {isOwing
                        ? `They owe you $${Math.abs(member.netBalance).toFixed(2)}`
                        : isOwed
                          ? `You owe $${Math.abs(member.netBalance).toFixed(2)}`
                          : "Settled up"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!selectedGroupMemberId && (
            <p className="text-sm text-amber-600">
              Please select a member to settle with
            </p>
          )}
        </div>

        {selectedGroupMemberId && (
          <>
            {/* payment direction */}
            <div className="space-y-2">
              <Label>Who paid?</Label>
              <RadioGroup
                defaultValue="youPaid"
                {...register("paymentType")}
                className="flex flex-col space-y-2"
                onValueChange={(value) => {
                  register("paymentType").onChange({
                    target: { name: "paymentType", value },
                  });
                }}
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="youPaid" id="youPaid" />
                  <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={currentUser.imageUrl || undefined} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        You paid{" "}
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="theyPaid" id="theyPaid" />
                  <Label
                    htmlFor="theyPaid"
                    className="flex-grow cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.imageUrl || undefined
                          }
                        />
                        <AvatarFallback>
                          {groupMembers
                            .find((m) => m.userId === selectedGroupMemberId)
                            ?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {
                          groupMembers.find(
                            (m) => m.userId === selectedGroupMemberId
                          )?.name
                        }{" "}
                        paid you
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="pl-7"
                  {...register("amount")}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Dinner, rent, etc."
                {...register("note")}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !selectedGroupMemberId}
        >
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  return null;
}
