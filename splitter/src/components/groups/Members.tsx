import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupMember } from "@/app/types";
import { User } from "@/app/types";
import { Badge } from "@/components/ui/badge";

const Members = ({
  members,
  currentUser,
}: {
  members: GroupMember[];
  currentUser: User;
}) => {
  if (!members || members.length === 0) {
    return <p className="text-muted-foreground text-sm">No members found.</p>;
  }
  return (
    <Card className="border-border rounded-xl shadow-sm w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Group Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => {
          const isCurrentUser = currentUser.id === member.id;

          return (
            <div key={member.id} className="flex items-center  gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    {isCurrentUser ? "You" : member.name}
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1 py-0.5 h-5"
                      >
                        You
                      </Badge>
                    )}
                  </p>
                  {member.role === "admin" && (
                    <Badge className="w-fit text-xs px-1 py-0.5 h-5">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Members;
