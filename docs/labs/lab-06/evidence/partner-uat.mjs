// Lab 6 Part B: executes ยอดนักบิด's UAT-01..06 against their deployed release through the API.
// Passwords are read from env (ORG_PW, PART_PW) and are never logged.
const BASE = "https://sdb3eb069-4d7hbszvwq-as.a.run.app";
const ORG = { email: "organizer@kmutt.ac.th", password: process.env.ORG_PW };
const PART = { email: "participant@kmutt.ac.th", password: process.env.PART_PW };
const ts = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13);
const tag = `T2-${ts}`;
const out = [];
const log = (...a) => { const l = a.join(" "); out.push(l); console.log(l); };
const now = () => new Date().toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });
const day = 86400000;

const client = (label) => {
  let cookie = "";
  return async (method, path, body) => {
    const r = await fetch(BASE + path, {
      method,
      headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const sc = r.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0];
    const text = await r.text();
    let json; try { json = JSON.parse(text); } catch { json = text; }
    const shown = path.includes("/auth/login") ? { ...body, password: "<redacted>" } : body;
    const bodyStr = typeof json === "string" ? json : JSON.stringify(json);
    log(`  [${now()}] ${label} ${method} ${path}${shown ? " " + JSON.stringify(shown) : ""} -> ${r.status} ${bodyStr.length > 400 ? bodyStr.slice(0, 400) + "…" : bodyStr}`);
    return { status: r.status, json };
  };
};
const check = (name, cond) => { log(`    ${cond ? "OK " : "MISMATCH"} ${name}`); return cond; };
const results = {};
const evt = (title, startOffset, capacity) => {
  const s = new Date(Date.now() + startOffset);
  return { title, description: "Synthetic UAT event", category: "SEMINAR", location: "Room CB4-101",
    startAt: s.toISOString(), endAt: new Date(s.getTime() + 2 * 3600000).toISOString(), capacity };
};

log(`Partner UAT run ${tag} start ${now()} ICT, target ${BASE}`);

// UAT-06 health/ready
log("UAT-06 Service health & readiness");
{
  const anon = client("anon");
  const h = await anon("GET", "/api/health");
  const r = await anon("GET", "/api/ready");
  results["UAT-06"] = [check("health 200 status ok", h.status === 200 && h.json.status === "ok"),
    check("ready 200 database connected", r.status === 200 && r.json.database === "connected")].every(Boolean);
}

// UAT-01 normal journey
log("UAT-01 Organizer publishes, participant registers");
const org = client("ORG-A");
const part = client("PART-1");
let ev1;
{
  const c = [];
  c.push(check("ORG-A login 200", (await org("POST", "/api/auth/login", ORG)).status === 200));
  const cr = await org("POST", "/api/events", evt(`UAT-01 Cloud Seminar ${tag}`, 7 * day, 5));
  ev1 = cr.json.event?.id;
  c.push(check("create 201 DRAFT", cr.status === 201 && cr.json.event?.status === "DRAFT"));
  const pb = await org("POST", `/api/events/${ev1}/publish`);
  c.push(check("publish 200 PUBLISHED", pb.status === 200 && pb.json.event?.status === "PUBLISHED"));
  c.push(check("PART-1 login 200", (await part("POST", "/api/auth/login", PART)).status === 200));
  const cat = await part("GET", "/api/events");
  const inCat = cat.json.events?.find((e) => e.id === ev1);
  c.push(check("event in catalog with remainingSeats 5", inCat?.remainingSeats === 5));
  const rg = await part("POST", `/api/events/${ev1}/registrations`);
  c.push(check("register 201", rg.status === 201));
  const after = await part("GET", `/api/events/${ev1}`);
  c.push(check("remainingSeats 4", after.json.event?.remainingSeats === 4));
  const mine = await part("GET", "/api/registrations/me");
  const mr = mine.json.registrations?.find((r) => r.event?.id === ev1 || r.eventId === ev1);
  c.push(check("in My Registrations, ACTIVE", mr?.status === "ACTIVE"));
  const ros = await org("GET", `/api/events/${ev1}/registrations`);
  const rosStr = JSON.stringify(ros.json);
  c.push(check("roster 200 lists participant@kmutt.ac.th ACTIVE", ros.status === 200 && rosStr.includes("participant@kmutt.ac.th") && rosStr.includes("ACTIVE")));
  c.push(check("roster has no passwordHash", !rosStr.includes("passwordHash")));
  results["UAT-01"] = c.every(Boolean);
}

// UAT-02 capacity, duplicate, capacity floor (PART-2 not provided -> fallback)
log("UAT-02 Capacity / duplicate / capacity floor (PART-2 not provisioned: fallback per plan)");
{
  const c = [];
  const cr = await org("POST", "/api/events", evt(`UAT-02 Cap-1 Workshop ${tag}`, 7 * day, 1));
  const id = cr.json.event?.id;
  await org("POST", `/api/events/${id}/publish`);
  const r1 = await part("POST", `/api/events/${id}/registrations`);
  c.push(check("first registration 201", r1.status === 201));
  const g = await part("GET", `/api/events/${id}`);
  c.push(check("remainingSeats 0", g.json.event?.remainingSeats === 0));
  const r2 = await part("POST", `/api/events/${id}/registrations`);
  c.push(check("duplicate 409", r2.status === 409));
  const cap0 = await org("PATCH", `/api/events/${id}/capacity`, { capacity: 0 });
  c.push(check("capacity 0 rejected 400/409", [400, 409].includes(cap0.status)));
  const g2 = await org("GET", `/api/events/${id}`);
  c.push(check("capacity still 1, active count 1", g2.json.event?.capacity === 1 && g2.json.event?.remainingSeats === 0));
  log("    step 4 (PART-2 registers on full event): not executable, PART-2 not provisioned");
  results["UAT-02"] = c.every(Boolean);
}

// UAT-03 past publish / draft hidden
log("UAT-03 Past-start publish rejected; DRAFT hidden");
{
  const c = [];
  const a = await org("POST", "/api/events", evt(`UAT-03 Past Draft ${tag}`, -day, 10));
  const aId = a.json.event?.id;
  const pa = await org("POST", `/api/events/${aId}/publish`);
  c.push(check("publish past event 400", pa.status === 400));
  const aAfter = await org("GET", `/api/events/${aId}`);
  c.push(check("Event A still DRAFT", aAfter.json.event?.status === "DRAFT"));
  const b = await org("POST", "/api/events", evt(`UAT-03 Future Draft ${tag}`, 10 * day, 10));
  const bId = b.json.event?.id;
  const cat = await part("GET", "/api/events");
  const ids = (cat.json.events || []).map((e) => e.id);
  c.push(check("neither A nor B in participant catalog", !ids.includes(aId) && !ids.includes(bId)));
  const gb = await part("GET", `/api/events/${bId}`);
  c.push(check("participant GET draft B 404", gb.status === 404));
  const rb = await part("POST", `/api/events/${bId}/registrations`);
  c.push(check("participant register draft B 404/409", [404, 409].includes(rb.status)));
  const rosB = await org("GET", `/api/events/${bId}/registrations`);
  const n = (rosB.json.registrants || rosB.json.registrations || []).length;
  c.push(check("zero registrations on B", rosB.status === 200 && n === 0));
  results["UAT-03"] = c.every(Boolean);
}

// UAT-04 forbidden role / ownership / no passwordHash
log("UAT-04 Forbidden role, ownership, sensitive data (ORG-B not provisioned: step 5 N/A)");
{
  const c = [];
  const anon = client("anon");
  c.push(check("anon GET /api/events 401", (await anon("GET", "/api/events")).status === 401));
  c.push(check("anon roster 401", (await anon("GET", `/api/events/${ev1}/registrations`)).status === 401));
  const p2 = client("PART-1#2");
  const lg = await p2("POST", "/api/auth/login", PART);
  const lgStr = JSON.stringify(lg.json);
  c.push(check("login body has user{id,email,name,role}", ["id", "email", "name", "role"].every((k) => k in (lg.json.user || {}))));
  c.push(check("login body has no passwordHash", !lgStr.includes("passwordHash")));
  const before = (await org("GET", "/api/events/organizer/events")).json.events?.length;
  c.push(check("participant POST /api/events 403", (await p2("POST", "/api/events", evt(`UAT-04 Forbidden ${tag}`, 7 * day, 5))).status === 403));
  const afterN = (await org("GET", "/api/events/organizer/events")).json.events?.length;
  c.push(check(`no event created (organizer count ${before} -> ${afterN})`, before === afterN));
  const pr = await p2("GET", `/api/events/${ev1}/registrations`);
  c.push(check("participant roster 403, no roster data", pr.status === 403 && !JSON.stringify(pr.json).includes("@")));
  c.push(check("organizer register 403", (await org("POST", `/api/events/${ev1}/registrations`)).status === 403));
  c.push(check("organizer /registrations/me 403", (await org("GET", "/api/registrations/me")).status === 403));
  log("    step 5 (ORG-B cross-organizer): N/A, ORG-B not provisioned");
  results["UAT-04"] = c.every(Boolean);
}

// UAT-05 session lifecycle (steps 1-3); steps 4-5 need partner redeploy
log("UAT-05 Session lifecycle & persistence (steps 1-3; 4-5 need Product Team redeploy)");
{
  const c = [];
  const p3 = client("PART-1#3");
  await p3("POST", "/api/auth/login", PART);
  c.push(check("/api/auth/me 200", (await p3("GET", "/api/auth/me")).status === 200));
  c.push(check("/api/auth/me 200 again (reload keeps session)", (await p3("GET", "/api/auth/me")).status === 200));
  c.push(check("logout 200", (await p3("POST", "/api/auth/logout")).status === 200));
  c.push(check("/api/auth/me 401 after logout", (await p3("GET", "/api/auth/me")).status === 401));
  await p3("POST", "/api/auth/login", PART);
  const mine = await p3("GET", "/api/registrations/me");
  const has = JSON.stringify(mine.json).includes(`UAT-01 Cloud Seminar ${tag}`);
  c.push(check(`UAT-01 registration visible before restart (event ${ev1})`, has));
  results["UAT-05 (steps 1-3)"] = c.every(Boolean);
}

for (const cl of [org, part]) await cl("POST", "/api/auth/logout");
log(`Summary ${now()}: ${JSON.stringify(results)}`);
log(`UAT-01 event id for UAT-05 step 5 recheck: ${ev1}`);
const fs = await import("node:fs");
fs.writeFileSync(new URL(`./partner-uat-${tag}.log`, import.meta.url), out.join("\n") + "\n");
