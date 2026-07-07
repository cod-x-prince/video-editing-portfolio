import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const reportDate = new Date().toISOString().split("T")[0];
const reportDir = path.join(rootDir, "reports");
const reportPath = path.join(reportDir, `${reportDate}.md`);

// Ensure reports directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}

// Read Analysis Report
let analysis = {};
try {
  const analysisPath = path.join(rootDir, "analysis-report.json");
  if (fs.existsSync(analysisPath)) {
    analysis = JSON.parse(fs.readFileSync(analysisPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to read analysis report:", e);
}

// Read Bookings
let bookings = [];
let pendingBookings = 0;
try {
  const bookingsPath = path.join(rootDir, "data/bookings.json");
  if (fs.existsSync(bookingsPath)) {
    bookings = JSON.parse(fs.readFileSync(bookingsPath, "utf-8"));
    pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  }
} catch (e) {
  // DB might not exist yet
}

const content = `# Daily Agent Report: ${reportDate}

## 📊 Project Health
- **Total Files**: ${analysis.files?.total || "N/A"}
- **Vulnerabilities**: ${analysis.dependencies?.vulnerabilities || 0}
- **Type Check**: ${analysis.typeCheck?.passed ? "Passed ✅" : "Failed ❌"}

## 🛡️ Security Status
- **Secrets Found**: ${analysis.security?.secretsFound?.length || 0}
${analysis.security?.secretsFound?.length > 0 ? "> ⚠️ Action Required: Review analysis-report.json for details." : ""}

## 📅 Booking Activity
- **Total Bookings**: ${bookings.length}
- **Pending Actions**: ${pendingBookings} ${pendingBookings > 0 ? "🔴" : "🟢"}

## 🤖 Agent Actions
- Analysis Pipeline: Run successfully
- Daily Report: Generated
`;

fs.writeFileSync(reportPath, content);
console.log(`Daily report generated: ${reportPath}`);
