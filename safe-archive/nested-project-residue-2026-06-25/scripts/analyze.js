import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const report = {
  timestamp: new Date().toISOString(),
  files: {
    total: 0,
    byType: {},
  },
  security: {
    secretsFound: [],
    envIssues: [],
  },
  typeCheck: {
    passed: false,
    output: "",
  },
  dependencies: {
    vulnerabilities: 0,
    summary: {},
  },
};

// Helper to recursively walk directory
function walkDir(dir, callback) {
  if (
    dir.includes("node_modules") ||
    dir.includes(".git") ||
    dir.includes("dist")
  )
    return;

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const startPath = path.join(dir, file);
    const stat = fs.statSync(startPath);
    if (stat.isDirectory()) {
      walkDir(startPath, callback);
    } else {
      callback(startPath);
    }
  });
}

// 1. File Stats & Secret Scanning
console.log("Scanning files...");
const SECRET_PATTERNS = [
  { name: "Generic API Key", pattern: /api_?key/i },
  { name: "Generic Secret", pattern: /secret/i },
  { name: "Private Key", pattern: /private_?key/i },
  { name: "Auth Token", pattern: /auth_?token/i },
];

walkDir(rootDir, (filePath) => {
  report.files.total++;
  const ext = path.extname(filePath);
  report.files.byType[ext] = (report.files.byType[ext] || 0) + 1;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    SECRET_PATTERNS.forEach(({ name, pattern }) => {
      if (pattern.test(content)) {
        // Simple heuristic: if it looks like an assignment or definition
        // We want to avoid flagging strictly types or comments if possible, but greedy is safer for now
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (pattern.test(line) && line.length < 200) {
            // arbitrary line length limit to avoid minified code
            report.security.secretsFound.push({
              file: path.relative(rootDir, filePath),
              line: index + 1,
              type: name,
              snippet: line.trim().substring(0, 50) + "...", // truncate for safety
            });
          }
        });
      }
    });
  } catch (e) {
    // binary files etc
  }
});

// 2. Type Check
console.log("Running type check...");
try {
  execSync("npx tsc --noEmit", { stdio: "pipe", cwd: rootDir });
  report.typeCheck.passed = true;
  report.typeCheck.output = "Passed";
} catch (error) {
  report.typeCheck.passed = false;
  report.typeCheck.output = error.stdout?.toString() || error.message;
}

// 3. Dependency Audit
console.log("Auditing dependencies...");
try {
  // Using npm audit --json
  const auditOutput = execSync("npm audit --json", {
    stdio: "pipe",
    cwd: rootDir,
  }).toString();
  const auditResult = JSON.parse(auditOutput);
  report.dependencies.vulnerabilities =
    auditResult.metadata?.vulnerabilities?.total || 0;
  report.dependencies.summary = auditResult.metadata?.vulnerabilities || {};
} catch (error) {
  // npm audit returns non-zero exit code if vulns found
  try {
    const auditOutput = error.stdout.toString();
    const auditResult = JSON.parse(auditOutput);
    report.dependencies.vulnerabilities =
      auditResult.metadata?.vulnerabilities?.total || 0;
    report.dependencies.summary = auditResult.metadata?.vulnerabilities || {};
  } catch (e) {
    report.dependencies.error = "Failed to parse audit output";
  }
}

// Write Report
const reportPath = path.join(rootDir, "analysis-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Report generated at ${reportPath}`);
