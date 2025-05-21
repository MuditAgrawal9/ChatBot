create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now()),
  role text not null, -- 'user' or 'assistant'
  content text not null
);

-- ALTER TABLE chat_messages ADD COLUMN role text;
-- ALTER TABLE chat_messages ADD COLUMN content text;

-- ALTER TABLE chat_messages DROP COLUMN IF EXISTS user_message;
-- ALTER TABLE chat_messages DROP COLUMN IF EXISTS bot_response;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_messages';

-- Allow users to read their own messages
create policy "User can view their messages"
on chat_messages for select
using (user_id = auth.uid());

-- Allow users to insert their own messages
create policy "User can insert messages"
on chat_messages for insert
with check (user_id = auth.uid());

-- SELECT column_name FROM information_schema.columns WHERE table_name = 'chat_messages';
