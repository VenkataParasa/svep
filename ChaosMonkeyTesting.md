# Chaos Monkey Implementation Complete

The Chaos Monkey testing framework has been successfully integrated into the Civic Data Platform! This will allow you to rigorously test the application's resiliency, loading skeletons, and fallback mechanisms under simulated duress.

## What Was Implemented

1. **Chaos Utilities** (`lib/chaos-monkey.ts`)
   - Created a central `injectChaos()` function that randomly introduces latency and throws errors based on configurable probability rates.
   - Built a `chaosFetch` wrapper to act as a drop-in replacement for the native Next.js `fetch` function.

2. **Database Level Chaos** (`lib/prisma.ts`)
   - Implemented a Prisma Client Extension (`$extends`) that intercepts *all* database operations (`$allModels`, `$allOperations`) and passes them through the `injectChaos()` pipeline.

3. **External API Chaos**
   - Integrated `chaosFetch` into the primary Jurisdiction Service API (`app/api/legislative-districts/route.ts`).
   - Integrated `chaosFetch` into the external image resolvers (`lib/wikipedia-photo.ts` and `lib/official-government-photo.ts`).

## How to Test It

> **CAUTION**
> Ensure that `NODE_ENV` is NOT set to `production` when testing this locally, as the Chaos Monkey is strictly disabled in production environments.

To activate the Chaos Monkey on your local development server, simply add these variables to your `.env` file and restart the server:

```env
# Enable the Chaos Monkey system
NEXT_PUBLIC_ENABLE_CHAOS_MONKEY="true"

# Define the minimum and maximum latency to inject (in milliseconds)
CHAOS_MIN_LATENCY_MS="500"
CHAOS_MAX_LATENCY_MS="3000"

# Define the failure probability (0.0 to 1.0). 
# e.g., 0.5 means a 50% chance any given fetch/query will throw an error.
CHAOS_ERROR_RATE="0.5"
```

## Expected Behavior
When activated:
- The **Dashboard** and **Issues** pages will randomly take several seconds to load, allowing you to inspect the UI Skeletons.
- If the `CHAOS_ERROR_RATE` triggers a failure, you will see your Next.js Error Boundaries catch the crash, or the `PersonAvatar` components smoothly degrading to display initials.
