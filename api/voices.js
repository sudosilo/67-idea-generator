// Lists the ElevenLabs voices on the account
const checkUser = require("./_auth");

module.exports = async (req, res) => {
  const user = await checkUser(req);
  if (!user) { res.status(401).json({ error: "This account is not allowed" }); return; }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "ELEVENLABS_API_KEY is not set" }); return; }
  const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": key } });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) { res.status(r.status || 500).json({ error: "Could not load voices" }); return; }
  const voices = (data.voices || []).map(v => ({ id: v.voice_id, name: v.name }));
  voices.sort((a, b) => a.name.localeCompare(b.name));
  res.status(200).json({ voices: voices });
};
