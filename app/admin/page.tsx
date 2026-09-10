import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { ensureFirstAdmin, getAdminSnapshot } from "@/lib/nac-data";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowed = await ensureFirstAdmin(user.email, user.displayName);
  if (!allowed) {
    return <main className="admin-denied"><h1>Accesso non autorizzato</h1><p>Questo account non può gestire il sito NAC.</p><a href={chatGPTSignOutPath("/admin")} target="_top">Cambia account</a></main>;
  }
  const data = await getAdminSnapshot();
  return <AdminDashboard initialData={data} userName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
