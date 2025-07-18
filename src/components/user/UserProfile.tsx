import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit3, 
  MapPin, 
  Mail, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Camera, 
  Settings,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Activity,
  Star
} from 'lucide-react';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import AccountSettings from './AccountSettings';

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  joinDate: string;
  location: string;
  stats: {
    comments: number;
    likes: number;
    uploads: number;
    reviews: number;
  };
}

interface ActivityHistoryItem {
  stopId: number;
  locationName: string;
  createdAt: string;
  itineraryId: number;
  itineraryTitle: string;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState<UserData>({
    id: '1',
    name: 'Minh Nguyen',
    email: 'minh.nguyen@example.com',
    bio: 'Adventure enthusiast exploring the beautiful caves and landscapes of Quang Binh. Love capturing moments and sharing travel tips with fellow explorers! 🌿',
    avatar: '/api/placeholder/120/120',
    joinDate: '2023-05-15',
    location: 'Dong Hoi, Quang Binh',
    stats: {
      comments: 45,
      likes: 128,
      uploads: 23,
      reviews: 15
    }
  });

  // Activity History state (dữ liệu thật từ API)
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Fetch activity history
  useEffect(() => {
    const userId = 1; // set cứng theo yêu cầu
    const token = localStorage.getItem('accessToken');
    setActivityLoading(true);
    fetch(`http://localhost:8081/api/user/${userId}/activity-history`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setActivityHistory(data))
      .catch(err => {
        console.error(err);
        setActivityHistory([]);
      })
      .finally(() => setActivityLoading(false));
  }, []);

  const getActivityIcon = () => (
    <MapPin className="h-4 w-4" />
  );

  const handleUpdateProfile = (updatedData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updatedData }));
    setShowEditProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-nature p-4 pt-24">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header Card */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-soft">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-glow">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-2xl font-bold text-primary">{userData.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{userData.location}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                  {userData.bio}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{userData.stats.comments}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{userData.stats.likes}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{userData.stats.uploads}</div>
                    <div className="text-xs text-muted-foreground">Uploads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{userData.stats.reviews}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button 
                variant="default"
                className="self-start"
                onClick={() => setShowEditProfile(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="activity" className="text-sm font-medium">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity History
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Activity History Tab */}
              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {activityLoading ? (
                    <div className="text-center text-muted-foreground py-8">Loading activity...</div>
                  ) : activityHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No activity history yet.</div>
                  ) : (
                    activityHistory.map((item) => (
                      <div
                        key={item.stopId}
                        className="flex gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors duration-200"
                      >
                        <div className="p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          {getActivityIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-foreground text-sm">{item.locationName}</h3>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            <span className="font-medium text-primary">Itinerary: </span>
                            {item.itineraryTitle}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Load more button nếu cần (mock) */}
                {/* <div className="text-center pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Load More Activity
                  </Button>
                </div> */}
              </TabsContent>

              {/* Account Settings Tab */}
              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="grid gap-3">
                  {/* Change Password */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Change Password</h3>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowChangePassword(true)}
                    >
                      Change
                    </Button>
                  </div>
                  {/* Notification Settings */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Notifications</h3>
                        <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAccountSettings(true)}
                    >
                      Manage
                    </Button>
                  </div>
                  {/* Privacy Settings */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-100 text-purple-700">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Privacy Settings</h3>
                        <p className="text-sm text-muted-foreground">Control your privacy and data</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  {/* Logout */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-100 text-orange-700">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Sign Out</h3>
                        <p className="text-sm text-muted-foreground">Sign out of your account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out
                    </Button>
                  </div>
                  {/* Delete Account */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-destructive">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Join Date */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            <span>Member since {new Date(userData.joinDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfile
          userData={userData}
          onSave={handleUpdateProfile}
          onCancel={() => setShowEditProfile(false)}
        />
      )}
      {showChangePassword && (
        <ChangePassword
          onSave={() => setShowChangePassword(false)}
          onCancel={() => setShowChangePassword(false)}
        />
      )}
      {showAccountSettings && (
        <AccountSettings
          onSave={() => setShowAccountSettings(false)}
          onCancel={() => setShowAccountSettings(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
