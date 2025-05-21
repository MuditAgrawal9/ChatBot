"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

interface AuthFormProps {
  isLogin: boolean;
}

/**
 * AuthForm Component
 * ------------------
 * Renders a login or registration form based on the `isLogin` prop.
 * Handles authentication using Supabase Auth.
 *
 * Props:
 * - isLogin: boolean - If true, renders the login form; otherwise, renders the registration form.
 */

export default function AuthForm({ isLogin }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Handles form submission for login or registration.
   * On success, navigates to /chat or /login as appropriate.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        // login with Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/chat"); // Redirect to chat on successful login
      } else {
        // registration with Supabase Auth
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert(
          "Registration successful! Please check your email to verify your account."
        );
        router.replace("/login"); // Redirect to login after registration
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message);
        // setError("Hello");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form className="space-y-4 text-black" onSubmit={handleSubmit}>
      {/* Form title */}
      <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h2>

      {/* Email input */}
      <input
        className="w-full p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password input */}
      <input
        className="w-full p-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Submit button */}
      <button
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="submit"
      >
        {isLogin ? "Login" : "Register"}
      </button>

      {/* Error message display */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Link to switch between login and register */}
      <div className="text-sm mt-2">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <a className="text-blue-600 underline" href="/register">
              Register
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a className="text-blue-600 underline" href="/login">
              Login
            </a>
          </>
        )}
      </div>
    </form>
  );
}
