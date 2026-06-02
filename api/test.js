export default function handler(req, res) {
  res.json({
    ok: true,
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_KEY,
    url: process.env.SUPABASE_URL?.slice(0, 30),
  });
}
