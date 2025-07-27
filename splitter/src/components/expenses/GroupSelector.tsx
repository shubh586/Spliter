"use client";

import type { GroupSummary, SelectedGroupMember } from "@/app/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import useServerhook from "../../../hooks/useServerhook";
import axios from "axios";

const GroupSelector = ({
  onChange,
}: {
  onChange: (group: SelectedGroupMember | null) => void;
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const { data: groups, isLoading } = useServerhook<GroupSummary[] | []>(
    "/api/expenses/getgroups/"
  );

  const handleGroupChange = async (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsGroupLoading(true);
    try {
      const response = await axios.post<SelectedGroupMember>(
        `/api/expenses/getGroupmembers/`,
        { groupId }
      );
      const groupMemberdetails = response.data;
      console.log(groupMemberdetails);
      onChange(groupMemberdetails);
    } catch (error) {
      console.log("error from getting groups members ,", error);
    } finally {
      setIsGroupLoading(false);
    }
  };

  if (isLoading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  if (!groups) {
    return (
      <div className="text-sm text-amber-600 p-2 bg-amber-50 rounded-md">
        You need to create a group first before adding a group expense null
        wala.
      </div>
    );
  }
  if (groups.length === 0) {
    return (
      <div className="text-sm text-amber-600 p-2 bg-amber-50 rounded-md">
        You need to create a group first before adding a group expense.
      </div>
    );
  }

  return (
    <div>
      <Select value={selectedGroupId} onValueChange={handleGroupChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group: GroupSummary) => (
            <SelectItem key={group.id} value={group.id}>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Users className="h-3 w-3 text-primary" />
                </div>
                <span>{group.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({group.members} members)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isGroupLoading && (
        <div className="mt-2">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
