import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Protected({ roles = [], children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <LoadingSpinner label="Checking session..." />;
  if (!user) return null;

  if (roles.length && !roles.includes(user.role)) {
    return (
      <div className="max-w-3xl mx-auto mt-10 card">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-white/70 mt-2">You don’t have permission to view this page.</p>
      </div>
    );
  }

  return children;
}