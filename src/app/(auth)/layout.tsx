import { ReactNode } from "react";

// AuthLayout Component
//  * --------------------
//  * Provides a centered, styled layout for authentication pages.
//  * Wraps its children in a card-like container.

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        {children}
      </div>
    </div>
  );
}
