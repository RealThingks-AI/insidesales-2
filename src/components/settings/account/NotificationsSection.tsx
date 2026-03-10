import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Clock, AlarmClock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationPrefs {
  email_notifications: boolean;
  in_app_notifications: boolean;
  push_notifications: boolean;
  lead_assigned: boolean;
  deal_updates: boolean;
  task_reminders: boolean;
  meeting_reminders: boolean;
  weekly_digest: boolean;
  notification_frequency: string;
  leads_notifications: boolean;
  contacts_notifications: boolean;
  accounts_notifications: boolean;
  daily_reminder_time: string;
}

interface NotificationsSectionProps {
  notificationPrefs: NotificationPrefs;
  setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
  userId: string;
  userTimezone?: string;
}

// Generate time options from 06:00 to 22:00 in 30-min intervals
const TIME_OPTIONS = Array.from({ length: 33 }, (_, i) => {
  const totalMinutes = 6 * 60 + i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const label = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  return { value, label };
});

const NotificationsSection = ({ notificationPrefs, setNotificationPrefs, userId, userTimezone }: NotificationsSectionProps) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(notificationPrefs));
  const [isSaving, setIsSaving] = useState(false);

  const saveNotificationPrefs = useCallback(async (prefs: NotificationPrefs) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          email_notifications: prefs.email_notifications,
          in_app_notifications: prefs.in_app_notifications,
          push_notifications: prefs.push_notifications,
          lead_assigned: prefs.lead_assigned,
          deal_updates: prefs.deal_updates,
          task_reminders: prefs.task_reminders,
          meeting_reminders: prefs.meeting_reminders,
          weekly_digest: prefs.weekly_digest,
          notification_frequency: prefs.notification_frequency,
          leads_notifications: prefs.leads_notifications,
          contacts_notifications: prefs.contacts_notifications,
          accounts_notifications: prefs.accounts_notifications,
          daily_reminder_time: prefs.daily_reminder_time,
          updated_at: new Date().toISOString()
        } as any, { onConflict: 'user_id' });
      if (error) throw error;
      lastSavedRef.current = JSON.stringify(prefs);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  useEffect(() => {
    const currentPrefs = JSON.stringify(notificationPrefs);
    if (currentPrefs === lastSavedRef.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveNotificationPrefs(notificationPrefs), 600);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [notificationPrefs, saveNotificationPrefs]);

  const updatePref = <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Delivery Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Delivery Methods
          </CardTitle>
          <CardDescription className="text-xs">Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.email_notifications}
              onCheckedChange={(checked) => updatePref('email_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">In-App Notifications</Label>
                <p className="text-xs text-muted-foreground">Show notifications within the app</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.in_app_notifications}
              onCheckedChange={(checked) => updatePref('in_app_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Frequency */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Delivery Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={notificationPrefs.notification_frequency}
            onValueChange={(value) => updatePref('notification_frequency', value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Daily Reminder Time - shown when task_reminders is enabled */}
      {notificationPrefs.task_reminders && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlarmClock className="h-4 w-4" />
              Daily Action Item Reminder
            </CardTitle>
            <CardDescription className="text-xs">
              Get a daily summary of your pending action items at your preferred time
              {userTimezone && (
                <span className="block mt-1 text-muted-foreground">
                  Timezone: <span className="font-medium">{userTimezone}</span>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium whitespace-nowrap">Reminder Time</Label>
              <Select
                value={notificationPrefs.daily_reminder_time}
                onValueChange={(value) => updatePref('daily_reminder_time', value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Module Notifications</CardTitle>
          <CardDescription className="text-xs">Choose which modules you want to receive notifications from</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Leads</Label>
            <Switch
              checked={notificationPrefs.leads_notifications}
              onCheckedChange={(checked) => updatePref('leads_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Contacts</Label>
            <Switch
              checked={notificationPrefs.contacts_notifications}
              onCheckedChange={(checked) => updatePref('contacts_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Accounts</Label>
            <Switch
              checked={notificationPrefs.accounts_notifications}
              onCheckedChange={(checked) => updatePref('accounts_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Triggers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Event Triggers</CardTitle>
          <CardDescription className="text-xs">Choose which events should trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Lead Assigned</Label>
            <Switch
              checked={notificationPrefs.lead_assigned}
              onCheckedChange={(checked) => updatePref('lead_assigned', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Deal Updates</Label>
            <Switch
              checked={notificationPrefs.deal_updates}
              onCheckedChange={(checked) => updatePref('deal_updates', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Action Item Reminders</Label>
            <Switch
              checked={notificationPrefs.task_reminders}
              onCheckedChange={(checked) => updatePref('task_reminders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Meeting Reminders</Label>
            <Switch
              checked={notificationPrefs.meeting_reminders}
              onCheckedChange={(checked) => updatePref('meeting_reminders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Weekly Digest</Label>
            <Switch
              checked={notificationPrefs.weekly_digest}
              onCheckedChange={(checked) => updatePref('weekly_digest', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
