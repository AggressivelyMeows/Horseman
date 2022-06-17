export async function handleRequest(request) {
  // Parse the request's url so we can get the path
  const url = new URL(request.url);
  // Get the path's current count
  const currentValue = await COUNTER_NAMESPACE.get(url.pathname);
  // Increment the path's count, defaulting it to 0
  const newValue = (parseInt(currentValue ?? "0") + 1).toString();
  // Store the new count
  await COUNTER_NAMESPACE.put(url.pathname, newValue);
  // Return the new count
  return new Response(newValue);
}
