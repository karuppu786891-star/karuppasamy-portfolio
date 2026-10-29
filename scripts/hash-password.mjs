import { emitKeypressEvents } from "node:readline";
import bcrypt from "bcryptjs";

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function" || !process.stdout.isTTY) {
  console.error("Hidden password entry is unavailable in this terminal. Run npm run admin:password in an interactive PowerShell or VS Code terminal.");
  process.exit(1);
}

let password = "";
let finished = false;
const onKeypress = async (character, key = {}) => {
  if (finished) return;

  if ((key.ctrl && key.name === "c") || key.sequence === "\u0003") {
    finished = true;
    password = "";
    cleanup();
    process.stdout.write("\nCancelled. Password input was discarded.\n");
    process.exitCode = 130;
    return;
  }

  if (key.name === "return" || key.name === "enter" || key.sequence === "\r" || key.sequence === "\n") {
    finished = true;
    cleanup();
    process.stdout.write("\n");
    if (Array.from(password).length < 12) {
      password = "";
      console.error("Password must be at least 12 characters.");
      process.exitCode = 1;
      return;
    }

    try {
      const hash = await bcrypt.hash(password, 12);
      password = "";
      console.log("Bcrypt hash for .env (12 salt rounds):");
      console.log(hash.replace(/\$/g, "\\$"));
      console.log("Copy this escaped value into .env as ADMIN_PASSWORD_HASH. For hosting dashboards, use the raw hash without backslashes. Restart the dev server afterward.");
    } catch {
      password = "";
      console.error("Could not generate the password hash.");
      process.exitCode = 1;
    }
    return;
  }

  if (key.name === "backspace" || key.sequence === "\u007f" || key.sequence === "\b") {
    const chars = Array.from(password);
    if (chars.length > 0) {
      password = chars.slice(0, -1).join("");
      process.stdout.write("\b \b");
    }
    return;
  }

  // Ignore control/meta keys and non-printing characters. In raw mode the terminal
  // does not echo the real input; only a masking asterisk is written here.
  if (typeof character === "string" && character.length > 0 && !key.ctrl && !key.meta && !/[\u0000-\u001f\u007f]/u.test(character)) {
    const chars = Array.from(character);
    password += character;
    process.stdout.write("*".repeat(chars.length));
  }
};

const cleanup = () => {
  process.stdin.off("keypress", onKeypress);
  process.stdin.pause();
  try {
    process.stdin.setRawMode(false);
  } catch {
    // The terminal may already have closed; never fall back to visible input.
  }
};

try {
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
} catch {
  try {
    process.stdin.setRawMode(false);
  } catch {
    // Keep terminal setup failure quiet beyond the safe message below.
  }
  console.error("Could not enable safe hidden input for this terminal. No password was read. Try an interactive PowerShell or VS Code terminal.");
  process.exit(1);
}

process.stdout.write("New admin password (minimum 12 characters; input masked): ");
process.stdin.on("keypress", onKeypress);
