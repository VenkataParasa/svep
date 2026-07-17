export function isChaosMonkeyEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENABLE_CHAOS_MONKEY === "true"
  );
}

export async function injectChaos(source: string = "unknown") {
  if (!isChaosMonkeyEnabled()) return;

  const errorRate = parseFloat(process.env.CHAOS_ERROR_RATE || "0.1"); // Default 10%
  const minLatency = parseInt(process.env.CHAOS_MIN_LATENCY_MS || "500", 10);
  const maxLatency = parseInt(process.env.CHAOS_MAX_LATENCY_MS || "3000", 10);

  // 1. Inject Latency
  const latency = Math.floor(Math.random() * (maxLatency - minLatency + 1)) + minLatency;
  console.log(`[Chaos Monkey] Injecting ${latency}ms latency into ${source}...`);
  await new Promise((resolve) => setTimeout(resolve, latency));

  // 2. Inject Failure
  if (Math.random() < errorRate) {
    const errorMsg = `[Chaos Monkey] Simulated failure in ${source}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function chaosFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const sourceName = typeof input === "string" ? input : input instanceof URL ? input.toString() : "fetch";
  await injectChaos(`fetch(${sourceName.substring(0, 50)}...)`);
  return fetch(input, init);
}
