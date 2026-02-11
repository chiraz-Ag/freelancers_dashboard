/// pages/dashboard/index.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardIndex() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // attendre la session
    if (status === "authenticated") {
      router.replace("/dashboard/overview"); // connecté → Overview
    } else {
      router.replace("/signin"); // pas connecté → SignIn
    }
  }, [status, router]);

  return null; // aucun rendu UI, on redirige directement
}
