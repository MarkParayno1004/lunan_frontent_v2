import { redirect } from "next/navigation";

export default function LegacyCounselorRedirectPage() {
  redirect("/dashboard/counselor");
}
