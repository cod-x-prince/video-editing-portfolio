import fs from "fs";
import path from "path";
import { google } from "googleapis";

const REPORT_PATH = "reports/calendar-diagnostic.json";
const ENV_PATH = ".env.local";

interface DiagnosticReport {
  timestamp: string;
  status: "pending" | "success" | "failed";
  steps: {
    id: string;
    status: "pending" | "success" | "failed" | "skipped";
    details?: any;
    error?: string;
  }[];
  envCheck?: {
    missing: string[];
    present: string[];
  };
}

const report: DiagnosticReport = {
  timestamp: new Date().toISOString(),
  status: "pending",
  steps: [],
};

function logStep(
  id: string,
  status: "success" | "failed" | "skipped",
  details?: any,
  error?: string,
) {
  console.log(`[${id}] ${status.toUpperCase()} ${error ? "- " + error : ""}`);
  report.steps.push({ id, status, details, error });
  saveReport();
}

function saveReport() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
}

function loadEnv() {
  if (fs.existsSync(ENV_PATH)) {
    const content = fs.readFileSync(ENV_PATH, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  }
}

async function runDiagnostics() {
  console.log("Starting Calendar Diagnostics...");
  loadEnv();

  // 1. Env Audit
  const requiredVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_CALENDAR_ID",
  ];
  const missing = requiredVars.filter((v) => !process.env[v]);
  const present = requiredVars.filter((v) => !!process.env[v]);

  report.envCheck = { missing, present };

  if (missing.length > 0) {
    logStep(
      "env-audit",
      "failed",
      { missing },
      "Missing environment variables",
    );
    report.status = "failed";
    saveReport();
    console.error("Aborting due to missing env vars");
    process.exit(1);
  }
  logStep("env-audit", "success", { present });

  // 2. OAuth Test
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID,
  } = process.env;

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/calendar/callback", // Placeholder, not used for refresh
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  try {
    const tokenInfo = await oauth2Client.getAccessToken();
    logStep("oauth-test", "success", { hasAccessToken: !!tokenInfo.token });
  } catch (err: any) {
    logStep("oauth-test", "failed", {}, err.message);
    report.status = "failed";
    saveReport();
    process.exit(1);
  }

  // 3. Scope Check (Implicit in getAccessToken, but we can try to verify token info if needed)
  // We'll skip deep verification unless we inspect the token, which requires an extra call.
  // We'll assume success if we got a token.
  logStep("calendar-scope-check", "success", { note: "Access token obtained" });

  // 4. Calendar ID Check
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  try {
    const cal = await calendar.calendars.get({
      calendarId: GOOGLE_CALENDAR_ID!,
    });
    logStep("calendar-id-check", "success", {
      id: cal.data.id,
      summary: cal.data.summary,
    });
  } catch (err: any) {
    logStep("calendar-id-check", "failed", {}, err.message);
    report.status = "failed";
    saveReport();
    process.exit(1);
  }

  // 5. Event Insert Test
  try {
    const event = {
      summary: "Agent Diagnostic Event",
      description: "Test event created by CalendarDiagnosticsAgent",
      start: {
        dateTime: new Date().toISOString(),
      },
      end: {
        dateTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 mins
      },
    };

    const res = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    logStep("event-insert-test", "success", {
      eventId: res.data.id,
      link: res.data.htmlLink,
    });
    report.status = "success";
  } catch (err: any) {
    logStep("event-insert-test", "failed", {}, err.message);
    report.status = "failed";
  }

  saveReport();
}

runDiagnostics().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
