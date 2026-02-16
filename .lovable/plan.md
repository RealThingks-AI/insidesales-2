# Details Panel Refinements

## Changes

### 1. Rename column headers

- History section: "Changes" → "Updates"
- Action Items section: "Task" → "Action Items"

### 2. Only Hide "#" column from both sections

- Hide the `#` header but make numbers visible from both History and Action Items tables

### 3. Only log status changes to History when status becomes "Completed" (not "In Progress")

- In `handleStatusChange`, only insert a `security_audit_log` entry when the new status is "Completed" or "Cancelled"
- Skip logging for "Open" and "In Progress" status changes

### 4. Add floating (+) button at the bottom of each section

- Add a fixed-position floating circular `+` button at the bottom-right of both the History scroll container and the Action Items scroll container
- Each button opens the Add Detail modal pre-set to the correct type (log or action_item), skipping the "Type" dropdown since the context is already known
- The Type selector row will be hidden when the modal is opened from a section-specific floating button
- A new state variable `addDetailFromSection` (null | 'log' | 'action_item') tracks whether the modal was opened from a section button

## Technical Details

### File: `src/components/DealExpandedPanel.tsx`

**Column header renames (lines 558-559, 627):**

- `Changes` → `Updates`
- `Task` → `Action Items`

**Remove # column:**

- Remove `<TableHead>` for `#` in both table headers
- Remove `<TableCell>` for index number in both table body rows
- Update `colSpan` in empty state rows from 5→4 (History) and 6→5 (Action Items)

**Conditional status logging (line 487-511):**

```tsx
const handleStatusChange = async (id: string, status: string) => {
  const item = actionItems.find((i) => i.id === id);
  await supabase.from('action_items').update({ status, updated_at: new Date().toISOString() }).eq('id', id);

  // Only log to history when completed or cancelled
  if (status === 'Completed' || status === 'Cancelled') {
    try {
      await supabase.from('security_audit_log').insert({...});
    } catch (e) { ... }
    queryClient.invalidateQueries({ queryKey: ['deal-audit-logs', deal.id] });
  }

  invalidateActionItems();
};
```

**Floating (+) buttons:**

- Wrap each section's scroll container in a `relative` parent
- Add an absolutely positioned circular button at bottom-right inside each section
- New state: `addDetailFromSection: null | 'log' | 'action_item'`
- When clicking History (+): set `addDetailType='log'`, `addDetailFromSection='log'`, open modal
- When clicking Action Items (+): set `addDetailType='action_item'`, `addDetailFromSection='action_item'`, open modal
- In the modal: conditionally hide the Type selector when `addDetailFromSection !== null`
- Reset `addDetailFromSection` to null when modal closes