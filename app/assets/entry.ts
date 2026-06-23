import { run } from "remix/ui";

let app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl);
    return mod[exportName];
  },
  async resolveFrame(src, signal, target) {
    let headers = new Headers({ accept: "text/html" });
    if (target) headers.set("x-remix-target", target);
    let response = await fetch(src, { headers, signal });
    return response.body ?? (await response.text());
  },
});

app.addEventListener("error", (event) => {
  console.error("Component error:", (event as any).error);
});

app.ready().catch((error) => {
  console.error("Failed to boot application:", error);
});
