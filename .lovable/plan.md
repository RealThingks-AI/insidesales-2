

# Daily Action Item Reminder System

## Overview
Build a scheduled edge function that runs every 15 minutes, checks each user's preferred reminder time (in their timezone), and creates in-app notification reminders for incomplete action items. Users configure the reminder time in Settings > Notifications.

## Changes Required

### 1. Database Migration
Add a `daily_reminder_time` column to `notification_preferences` table (e.g., `'09:00'`) and a `last_reminder_sent_at` column to track when the last reminder was sent (prevents duplicates).

```sql
ALTER TABLE notification_preferences 
  ADD COLUMN daily_reminder_time text DEFAULT '09:00',
  ADD COLUMN last_reminder_sent_at date;
```

### 2. Edge Function: `daily-action-reminders`
**New file: `supabase/functions/daily-action-reminders/index.ts`**

Logic:
1. Query all users from `notification_preferences` where `task_reminders = true`
2. Join with `profiles` to get their `timezone`
3. For each user, check if current time in their timezone matches their `daily_reminder_time` (within a 15-min window) AND `last_reminder_sent_at != today`
4. Query `action_items` where `assigned_to = user_id` AND `status != 'Completed'` AND `archived_at IS NULL`
5. If there are pending items, insert a summary notification into `notifications` table
6. Update `last_reminder_sent_at` to today

### 3. Cron Job
Schedule the edge function to run every 15 minutes using `pg_cron` + `pg_net`:
```sql
SELECT cron.schedule(
  'daily-action-reminders',
  '*/15 * * * *',
  $$ SELECT net.http_post(...) $$
);
```

### 4. UI: Add Reminder Time Picker in NotificationsSection
**File: `src/components/settings/account/NotificationsSection.tsx`**

Add a new card "Daily Reminder Time" (shown when `task_reminders` is enabled):
- A time select dropdown (e.g., 06:00 through 22:00 in 30-min intervals)
- Small helper text: "Reminder sent daily at this time in your timezone ({timezone})"
- The selected value is saved as `daily_reminder_time` in `notification_preferences`

Update the `NotificationPrefs` interface and `AccountSettingsPage` to include the new `daily_reminder_time` field.

### 5. Update AccountSettingsPage.tsx
- Add `daily_reminder_time` to the `NotificationPrefs` interface and default state
- Pass user's timezone from profile to `NotificationsSection` so it can display it

## File Changes Summary

| File | Change |
|---|---|
| DB migration | Add `daily_reminder_time` and `last_reminder_sent_at` columns |
| `supabase/functions/daily-action-reminders/index.ts` | New edge function |
| `src/components/settings/account/NotificationsSection.tsx` | Add reminder time picker UI |
| `src/components/settings/AccountSettingsPage.tsx` | Update interface, pass timezone prop |
| Cron job (SQL insert) | Schedule every 15 minutes |

