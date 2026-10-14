import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { database } from '@/db/raw';
import { photoInput, photoEstimate, validImage } from '@/lib/food-photo';

const respond = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
const model = 'gemini-2.5-flash';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return respond({ error: 'Sign in again to estimate your meal.' }, 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return respond({ error: 'Invalid request origin.' }, 403);
  const key = (env as unknown as Record<string, string>).GEMINI_API_KEY;
  if (!key) return respond({ error: 'Gemini is not configured on the published website. Add GEMINI_API_KEY to the hosting environment.' }, 503);

  try {
    const raw = await request.text();
    if (raw.length > 2_500_000) return respond({ error: 'Photo is too large. Please choose a smaller image.' }, 413);
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { return respond({ error: 'Could not read the uploaded photo.' }, 400); }
    const parsed = photoInput.safeParse(payload);
    if (!parsed.success || !validImage(parsed.data.image)) return respond({ error: 'Please upload a valid JPEG, PNG or WebP food photo.' }, 400);

    const day = new Date().toISOString().slice(0, 10);
    const usage = await database().prepare('INSERT INTO photo_usage(owner,day,count) VALUES (?,?,1) ON CONFLICT(owner,day) DO UPDATE SET count=photo_usage.count+1 WHERE photo_usage.count<30 RETURNING count').bind(user.userId, day).first();
    if (!usage) return respond({ error: 'Daily photo-analysis limit reached. Use manual entry or try tomorrow.' }, 429);

    const [header, imageData] = parsed.data.image.split(',');
    const mimeType = header.slice(5).split(';')[0];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25_000);
    let upstream: Response;
    try {
      upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [
            { text: 'Identify the foods in this photo and estimate totals for the whole meal. Extra details: ' + (parsed.data.context || 'none') + '. Return ONLY JSON with keys: isFood (boolean), name, portion, calories, protein, carbs, fat, fiber, sugar, sodium, caloriesLow, caloriesHigh, confidence (low/medium/high), notes. All nutrient values are nonnegative numbers; fiber, sugar and sodium can be null. Calories in kcal, sodium in mg, others in grams. Give realistic estimates, including visible oils and sauces. CaloriesLow <= calories <= caloriesHigh. If the image is not food, set isFood false and explain in notes.' },
            { inlineData: { mimeType, data: imageData } }
          ] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500, responseMimeType: 'application/json' }
        })
      });
    } catch {
      return respond({ error: 'Gemini did not respond within 25 seconds. Try again or import a ChatGPT estimate.' }, 504);
    } finally { clearTimeout(timer); }

    if (!upstream.ok) {
      const details = await upstream.json().catch(() => null) as { error?: { message?: string } } | null;
      const detail = details?.error?.message || '';
      if (upstream.status === 429) return respond({ error: 'Gemini quota exceeded. Try again later or use ChatGPT estimate import.' }, 429);
      if (upstream.status === 401 || upstream.status === 403) return respond({ error: 'Gemini API access denied. Check the key and enable the Generative Language API in its Google project.' }, 503);
      if (upstream.status === 404) return respond({ error: 'The Gemini model is not available for this API key.' }, 503);
      return respond({ error: 'Gemini rejected the request (' + upstream.status + '). ' + detail.slice(0, 200) }, 502);
    }

    const body = await upstream.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const answer = body.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!answer) return respond({ error: 'Gemini returned no nutrition estimate. Try another photo.' }, 422);
    let candidate: unknown;
    try { candidate = JSON.parse(answer.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); }
    catch { return respond({ error: 'Gemini returned an unreadable estimate. Try again.' }, 422); }
    const result = photoEstimate.safeParse(candidate);
    if (!result.success) return respond({ error: 'Gemini returned an incomplete estimate. Try another photo or use ChatGPT import.' }, 422);
    if (!result.data.isFood) return respond({ error: result.data.notes || 'No food detected in the photo.' }, 422);
    return respond({ estimate: result.data, provider: 'Gemini', model });
  } catch {
    return respond({ error: 'Photo analysis failed. Try again or import an estimate from ChatGPT.' }, 503);
  }
}
