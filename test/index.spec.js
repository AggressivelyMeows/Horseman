import test from "ava";
import { Miniflare } from "miniflare";

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  const mf = new Miniflare({
    // Autoload configuration from `.env`, `package.json` and `wrangler.toml`
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
  });
  t.context = { mf };
});

test("increments path count for new paths", async (t) => {
  // Get the Miniflare instance
  const { mf } = t.context;
  // Dispatch a fetch event to our worker
  const res = await mf.dispatchFetch("http://localhost:8787/a");
  // Check the count is "1" as this is the first time we've been to this path
  t.is(await res.text(), "1");
});

test("increments path count for existing paths", async (t) => {
  // Get the Miniflare instance
  const { mf } = t.context;
  // Get the counter KV namespace
  const ns = await mf.getKVNamespace("COUNTER_NAMESPACE");
  // Set an initial count of 5
  await ns.put("/a", "5");
  // Dispatch a fetch event to our worker
  const res = await mf.dispatchFetch("http://localhost:8787/a");
  // Check returned count is now "6"
  t.is(await res.text(), "6");
  // Check KV count is now "6" too
  t.is(await ns.get("/a"), "6");
});
