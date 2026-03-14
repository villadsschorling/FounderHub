#!/bin/bash
# Script to apply Supabase schema
# Make sure you have the Supabase CLI installed and configured

echo "Applying Supabase schema..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
fi

# Apply the schema
echo "Running schema.sql..."
supabase db reset --db-url="your-supabase-db-url-here"

echo ""
echo "IMPORTANT: Replace 'your-supabase-db-url-here' with your actual Supabase database URL."
echo "You can find it in your Supabase dashboard: Project Settings -> Database -> Connection string"
echo ""
echo "Alternatively, you can copy the SQL from supabase/schema.sql and run it manually"
echo "in the Supabase SQL Editor at: https://supabase.com/dashboard/project/_/sql"