# Repbook

[Open Repbook](https://gym.sujanparajuli786.chatgpt.site)

Private workout, nutrition and weekly weight journal with ChatGPT sign-in.

## Separate sections
- Workouts: Push, Pull and Legs routines, weights/reps for each set, progress and weekly history.
- Nutrition: dated food diary; calories, protein, carbs, fat; optional fiber, sugar, sodium; remaining daily amounts; editable meals and targets.
- Weight: weigh-ins, Monday–Sunday averages, goal and observed weight trend.

## Food photos
Take or choose a photo, add optional portion/ingredient details, then click **Estimate calories & macros**. Gemini returns an editable estimate, uncertainty range and assumptions. A preview shows the daily amounts remaining after the draft meal. Save the reviewed entry to update the diary and totals.

Images are resized in the browser and sent to Google only on the Estimate click. Repbook does not persist the original photo. Google free-tier quotas and data-use terms apply; the app does not configure or enable billing. The app caps photo requests at 30 attempts per user per UTC day. Provider quota errors, unavailable service, disabled API and unclear/non-food images display actionable errors; no fake estimates are substituted.

The current Google project reports the Gemini API is disabled. Enable that API for the configured key to activate live estimates. Manual entry and ChatGPT JSON import work independently.

## Privacy & configuration
Source is in `source/`. User records are stored in D1 and scoped to the signed-in user. Public source includes only generic example profile defaults. Personal starting details and `GEMINI_API_KEY` are private runtime secrets; neither keys nor diary records are committed here. An optional `REPBOOK_STARTING_PROFILE` JSON secret supplies a private initial profile. Saved profiles override those initial defaults.

## Target estimates
Mifflin–St Jeor resting calorie estimate × an editable activity multiplier; an adjustable calorie deficit; protein/fat targets with carbs filling the remaining calorie budget. The research explanation in the app links the underlying references. Steps and lifting are not counted twice. Targets and the planning horizon are estimates; scale changes do not measure pure fat loss.

## Validation
From `source/`: `node --experimental-strip-types tests/nutrition.test.mjs` and `node node_modules/typescript/bin/tsc --noEmit`. Production build passed. API checks covered persistence, account isolation, repeat weigh-ins, dates, origins, photo file validation, output validation and quota errors. Live Gemini image verification remains blocked on the Google project setting. Browser QA was unavailable.
