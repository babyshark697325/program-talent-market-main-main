# Waitlist Setup Guide

## Overview
This guide explains how to set up the waitlist functionality that has been added to the sign-up/in authentication system.

## What's Been Added

### 1. Frontend Changes
- **Auth.tsx**: Added a new "Waitlist" tab alongside Sign In and Sign Up
- **AdminUsers.tsx**: Added waitlist management interface for administrators
- **Types**: Updated Supabase types to include waitlist table structure

### 2. Database Changes
A new `waitlist` table needs to be created in your Supabase database.

## Database Setup

### Option 1: Run Migration (Recommended)
If you have Supabase CLI access:

```bash
cd program-talent-market-main
npx supabase login
npx supabase link --project-ref xlrjhstadddzhkxpxyof
npx supabase db push
```

### Option 2: Manual SQL Execution
If you can't use the CLI, run this SQL in your Supabase SQL editor:

```sql
-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for waitlist
CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admins can view all waitlist entries"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update waitlist entries"
ON public.waitlist
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create index on status for filtering
CREATE INDEX idx_waitlist_status ON public.waitlist(status);
```

## Features

### User Experience
- Users can join a waitlist without creating an account
- Form collects: first name, last name, email (required), role, and city
- Prevents duplicate email entries
- Shows success message and redirects to sign-in after joining

### Admin Management
- View all waitlist entries in the Admin Users page
- See waitlist count in admin dashboard stats
- Approve or reject waitlist entries
- Track entry status (pending, approved, rejected)
- View entry details including join date, role, and city

## Usage

### For Users
1. Go to the authentication page
2. Click the "Waitlist" tab
3. Fill out the form with your information
4. Submit to join the waitlist
5. Wait for admin approval

### For Admins
1. Navigate to Admin Dashboard → Manage Users
2. Scroll down to the "Waitlist Management" section
3. View all waitlist entries
4. Use Approve/Reject buttons to manage entries
5. Monitor waitlist count in the dashboard stats

## Security
- Row Level Security (RLS) is enabled
- Anonymous users can only insert new entries
- Only authenticated admins can view and update entries
- Email addresses are unique to prevent duplicates

## Customization
You can modify the waitlist form fields by editing:
- `Auth.tsx` - Form fields and validation
- `AdminUsers.tsx` - Admin interface and management
- Database schema - Add new fields as needed

## Troubleshooting
- If you see "Error fetching waitlist" in admin panel, ensure the database table exists
- Check that RLS policies are properly set up
- Verify admin role permissions in your user_roles table
