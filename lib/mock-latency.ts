// Simulates realistic network latency for the mock REST API layer so the
// Admin API Monitor and loading skeletons have something genuine to show.
export async function simulateLatency(minMs = 120, maxMs = 420): Promise<number> {
  const ms = Math.round(minMs + Math.random() * (maxMs - minMs));
  await new Promise((resolve) => setTimeout(resolve, ms));
  return ms;
}
