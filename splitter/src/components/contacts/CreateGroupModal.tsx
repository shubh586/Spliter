"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useServerhook from "../../../hooks/useServerhook";
import { toast } from "sonner";
import axios from "axios";
const groupSchema = z.object({
  name: z.string().min(1, "group name is required"),
  description: z.string().optional(),
});
import type { User } from "@/app/types";

type Contact = {
  id: string;
  name: string;
  email: string;
  imageUrl:string|""
};

// type Group = {
//   name: string
//   description: string|null
//   members: string[]
// };

const CreateGroupModal = ({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
    onSuccess: (groupId: string) => void;
}) => {
  const [selectedMembers, setSelectedMembers] = useState<Contact[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const { data, isLoading } = useServerhook<User>("/api/user/currentuser");
  const { data: contactList, isLoading: isSearching } = useServerhook<
    Contact[]
  >("/api/user/searchAllContacts", "POST", { query: searchQuery });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, //
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const addMember = (user: Contact) => {
    if (!selectedMembers.some((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setCommandOpen(false);
  };

  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
  };

  const onSubmit = async (data :{ name: string; description?: string }) => {
    try {
      const memberIds = selectedMembers.map((member) => member.id);

      const response = await axios.post("/api/group/creategroup/", {
        name: data.name,
        description: data.description,
        members: memberIds,
      });
      if (!response.data) {
        throw new Error("Group creation failed")
      }
      toast.success("Group created successfully!");
      reset();
      setSelectedMembers([]);
      onClose();
      if (onSuccess) {
        onSuccess(response.data.id);
      }
    } catch (error) {
      toast.error("Failed to create group: " + (error as Error).message);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    onClose();
  };

  if (isLoading) return <div></div>;
  if (!data) return <div>currentUser not found</div>;
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* group name */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="Enter group name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            {/* group description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description(Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter group description"
                {...register("description")}
              />
            </div>
            {/* group members */}
            <div className="space-y-2">
              <Label>Members</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap mb-2 gap-4">
                  {data.name && (
                    <Badge variant="secondary" className="px-3 py-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={data.imageUrl} />
                        <AvatarFallback className="h-5 w-5  bg-green-400">
                          {data.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{data.name} (You)</span>
                    </Badge>
                  )}
                  {selectedMembers?.map((data) => (
                    <Badge
                      key={data.id}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={data.imageUrl} />
                        <AvatarFallback className="h-5 w-5  bg-green-400">
                          {data.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{data.name}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(data.id)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" type="button">
                        <UserPlus />
                        Add members
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        <Command>
                          <CommandInput
                            placeholder="Type at or search..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {searchQuery.length < 2 ? (
                                <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                  Type at least 2 characters to search
                                </p>
                              ) : isSearching ? (
                                <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                  Searching...
                                </p>
                              ) : (
                                <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                  No users found
                                </p>
                              )}
                            </CommandEmpty>
                            <CommandGroup heading="Users">
                              {contactList?.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={user.name + user.email}
                                  onSelect={() => addMember(user)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={user.imageUrl} />
                                      <AvatarFallback>
                                        {user.name?.charAt(0) || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="text-sm">
                                        {user.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {user.email}
                                      </span>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedMembers.length === 0 && (
                  <p className="text-sm text-amber-600">
                    Add at least one other person to the group
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleClose} variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={selectedMembers.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Creating group ..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateGroupModal;
