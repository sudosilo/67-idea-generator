// Checks the Supabase sign-in token and only lets allowed accounts through
const SB_URL = "https://vogxdikogfaxhwcgajfg.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3hkaWtvZ2ZheGh3Y2dhamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTk4MDAsImV4cCI6MjEwNjk3NTgwMH0.fUosu3JdsUI5GFnQjDbOxfYCWO1hfijQO3O8lJVsU98";

module.exports = async function checkUser(req) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Bearer ")) return null;
  const r = await fetch(SB_URL + "/auth/v1/user", { headers: { Authorization: h, apikey: SB_ANON } });
  if (!r.ok) return null;
  const u = await r.json();
  if (!u || !u.id || u.is_anonymous) return null;
  const allow = (process.env.IDEA67_ALLOWED_USERS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (allow.indexOf(u.id) === -1) return null;
  return u;
};
