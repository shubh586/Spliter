"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { newSplits, participant } from "@/app/types";

export default function SplitSelector({
  type,
  amount,
  participants,
  paidBy,
  onSplitsChange,
}: {
  type: "equal" | "exact" | "percentage";
  amount: number;
  participants: participant[];
  paidBy: string;
  onSplitsChange: (newSplit: newSplits[]) => void;
}) {
  const [splits, setSplits] = useState<newSplits[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Compute initial splits
  useEffect(() => {
    if (!amount || participants.length === 0) return;

    const newSplits = participants.map((p) => {
      const shareAmount = amount / participants.length;
      const percentage = 100 / participants.length;
      return {
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount:
          type === "equal"
            ? shareAmount
            : type === "percentage"
              ? (amount * percentage) / 100
              : shareAmount,
        percentage:
          type === "equal"
            ? percentage
            : type === "percentage"
              ? percentage
              : (shareAmount / amount) * 100,
        paid: p.id === paidBy,
      };
    });

    setSplits(newSplits);
    setTotalAmount(newSplits.reduce((sum, s) => sum + s.amount, 0));
    setTotalPercentage(newSplits.reduce((sum, s) => sum + s.percentage, 0));
    onSplitsChange(newSplits);
  }, [type, amount, participants, paidBy, onSplitsChange]);

  const updatePercentageSplit = (userId: string, newPercentage: number) => {
    const updated = splits.map((s) =>
      s.userId === userId
        ? {
            ...s,
            percentage: newPercentage,
            amount: (amount * newPercentage) / 100,
          }
        : s
    );
    setSplits(updated);
    setTotalAmount(updated.reduce((sum, s) => sum + s.amount, 0));
    setTotalPercentage(updated.reduce((sum, s) => sum + s.percentage, 0));
    onSplitsChange(updated);
  };

  const updateExactSplit = (userId: string, newAmount: string) => {
    const parsed = parseFloat(newAmount) || 0;
    const updated = splits.map((s) =>
      s.userId === userId
        ? {
            ...s,
            amount: parsed,
            percentage: amount > 0 ? (parsed / amount) * 100 : 0,
          }
        : s
    );
    setSplits(updated);
    setTotalAmount(updated.reduce((sum, s) => sum + s.amount, 0));
    setTotalPercentage(updated.reduce((sum, s) => sum + s.percentage, 0));
    onSplitsChange(updated);
  };

  const isAmountValid = Math.abs(totalAmount - amount) < 0.01;
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-4 mt-4">
      {splits.map((split) => (
        <div
          key={split.userId}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 min-w-[120px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={split.imageUrl===null?"":`${split.imageUrl}`} />
              <AvatarFallback>{split.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {split.userId === paidBy ? "You" : split.name}
            </span>
          </div>

          {type === "equal" && (
            <div className="text-right text-sm">
              ${split.amount.toFixed(2)} ({split.percentage.toFixed(1)}%)
            </div>
          )}

          {type === "percentage" && (
            <div className="flex items-center gap-4 flex-1">
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) =>
                  updatePercentageSplit(split.userId, val[0])
                }
                className="flex-1"
              />
              <div className="flex gap-1 items-center min-w-[100px]">
                <Input
                  type="number"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(
                      split.userId,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm ml-1">${split.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1" />
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={split.amount.toFixed(2)}
                  onChange={(e) =>
                    updateExactSplit(split.userId, e.target.value)
                  }
                  className="w-24 h-8"
                />
                <span className="text-sm text-muted-foreground ml-1">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between border-t pt-3 mt-3">
        <span className="font-medium">Total</span>
        <div className="text-right">
          <span className={`font-medium ${!isAmountValid && "text-amber-600"}`}>
            ${totalAmount.toFixed(2)}
          </span>
          {type !== "equal" && (
            <span
              className={`text-sm ml-2 ${
                !isPercentageValid ? "text-amber-600" : ""
              }`}
            >
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {!isPercentageValid && type === "percentage" && (
        <p className="text-sm text-amber-600 mt-1">
          Total percentage must be exactly 100%.
        </p>
      )}

      {!isAmountValid && type === "exact" && (
        <p className="text-sm text-amber-600 mt-1">
          Total amount must equal ${amount.toFixed(2)}.
        </p>
      )}
    </div>
  );
}
