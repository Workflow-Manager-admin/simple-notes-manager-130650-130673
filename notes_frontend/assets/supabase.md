# Supabase Integration Guide for notes_frontend

This frontend uses Supabase as the backend for notes CRUD operations.

## Environment Variables

Ensure the following variables are set in the `.env` file for this React app:

```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_KEY=your-supabase-anon-key
```

## Supabase Table: `notes`

Expected schema for the `notes` table:

| column      | type     | required | notes                 |
|-------------|----------|----------|-----------------------|
| id          | uuid     | YES      | primary key           |
| title       | text     | YES      |                       |
| content     | text     | YES      |                       |
| created_at  | timestamptz | YES   | defaults to now()     |
| updated_at  | timestamptz | YES   | defaults to now()     |

You can create this table in Supabase SQL Editor with:

```sql
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update 'updated_at' on every update:
create or replace function update_updated_at_column()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language 'plpgsql';

drop trigger if exists set_updated_at on notes;
create trigger set_updated_at
before update on notes
for each row
execute procedure update_updated_at_column();
```

## Usage

The frontend imports Supabase using `@supabase/supabase-js` and connects via these env vars.
All note CRUD happens via the `notes` table using Supabase client.

No further configuration is required.

