PDF Chat Assistant 🤖📄

A modern, full-stack AI chatbot where users can upload PDFs and chat with an AI assistant powered by the Gemini API.  
Built with **Next.js App Router**, **Supabase Auth & Database**, and **Gemini API**.

---

Features

- **User Authentication** (Register, Login, Logout) with Supabase
- **PDF Upload & Parsing** (extract text from user PDFs)
- **Chat with Gemini AI** (context-aware answers using uploaded PDF)
- **Chat History** (all messages are stored per user in Supabase)
- **Timestamps** for every message
- **Responsive, modern UI** (Tailwind CSS)
- **Secure**: No API keys exposed client-side

---

Getting Started

1. Clone the Repo

2. Install Dependencies

3. Environment Variables
   
Create a `.env.local` file in the root with:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key

- Get Supabase keys from [app.supabase.com](https://app.supabase.com/).
- Get Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4. Database Setup

- In Supabase, create a table called `chat_messages` with columns:
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `role` (text)
  - `content` (text)
  - `created_at` (timestamp, default: now())
 
- Enable **Row Level Security** and add this policy:
- create policy "User can view their messages"
  on chat_messages for select
  using (user_id = auth.uid());
   
5. Run the App

---

Additional Information
-Code Comments:
All source code files include clear comments explaining the logic and structure.

-Database Schema:
The Supabase SQL code for table creation and policies is provided in schema-code.sql.

-Sample Queries & Responses:
Example user queries and chatbot responses are included in query_response.txt.
