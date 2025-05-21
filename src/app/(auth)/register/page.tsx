/**
 * RegisterPage
 * -------------------
 * This page renders the authentication form in register mode.
 * It is used for user registration in the application.
 */

import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return <AuthForm isLogin={false} />;
}
