import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "fs";
import path from "path";

const dir = path.resolve(".");
const repoUrl = "https://github.com/saurabhkakde18/KV-Flash.git";
const token = process.env.GITHUB_TOKEN || process.argv[2];

async function main() {
  console.log("🚀 Initializing Git repository in:", dir);

  try {
    await git.init({ fs, dir, defaultBranch: "main" });
    console.log("✔ Git repository initialized.");
  } catch (e) {
    console.log("Notice on init:", e.message);
  }

  console.log("📦 Staging all source files...");

  // Recursive directory walker respecting basic ignores
  async function stageFiles(currentDir, relativeBase = "") {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git" ||
        entry.name === ".env.local" ||
        entry.name === ".vercel"
      ) {
        continue;
      }

      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        await stageFiles(fullPath, relPath);
      } else {
        await git.add({ fs, dir, filepath: relPath });
      }
    }
  }

  await stageFiles(dir);
  console.log("✔ All files staged.");

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: "Saurabh Kakade",
      email: "kakadesaurabh18@gmail.com",
    },
    message: "Initial commit: KV Flash Vehicle Finance Intelligence Suite for Vercel deployment",
  });
  console.log("✔ Commit created:", sha);

  if (!token) {
    console.log("\n⚠️ No GITHUB_TOKEN provided. To push automatically, run:");
    console.log("node scripts/push-to-github.mjs <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>\n");
    return;
  }

  console.log("🌐 Pushing to remote:", repoUrl);
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: "origin",
    url: repoUrl,
    ref: "main",
    onAuth: () => ({
      username: "saurabhkakde18",
      password: token,
    }),
  });

  console.log("🎉 Successfully pushed all files to GitHub!", pushResult);
}

main().catch((err) => {
  console.error("❌ Error during git operation:", err);
});
