
import React from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPreferences } from "@/types/profile";
import { PointsBadge } from "@/components/PointsBadge";
import PreferencesDisplay from "./PreferencesDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDetailsProps {
  userData: {
    name: string;
    email?: string;
    avatar_url?: string;
    points?: number;
  };
  preferences: UserPreferences;
  onEditPreferences: () => void;
}

const ProfileDetails = ({ userData, preferences, onEditPreferences }: ProfileDetailsProps) => {
  const initials = userData.name.split(' ').map(n => n[0]).join('') || 'U';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <CardTitle>Profile Details</CardTitle>
          <Button variant="outline" size="sm" onClick={onEditPreferences}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Preferences
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
            <AvatarImage src={userData.avatar_url} alt={userData.name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold mb-1">{userData.name}</h2>
          {userData.email && (
            <p className="text-sm text-muted-foreground mb-2">{userData.email}</p>
          )}
          
          {userData.points !== undefined && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <PointsBadge points={userData.points} />
            </div>
          )}
        </div>
        
        <PreferencesDisplay preferences={preferences} />
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
