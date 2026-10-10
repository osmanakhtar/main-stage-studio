// node console-auth.js <state-out.json>
// Signs in to the sandbox console off camera and saves the session for the recorder.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright'); const fs = require("fs"); const { execSync } = require("child_process");
(async () => {
  execSync('curl -s -o /dev/null -X POST -d "email=osman.akhtar@gmail.com" http://localhost:3451/console/vera/login'); await new Promise(r => setTimeout(r, 1500));
  const dir = "/Users/osmanakhtar/workspace/.worktrees/sp-v6-reskin/service/outbox-sandbox";
  const f = fs.readdirSync(dir).filter(x => x.includes("login")).map(x => dir + "/" + x).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  const link = execSync(`python3 -c "import email,re,sys;m=email.message_from_bytes(open(sys.argv[1],'rb').read());print([re.findall(r'https?://\\S+',p.get_payload(decode=True).decode()) for p in m.walk() if p.get_content_type()=='text/plain'][0][0])" "${f}"`).toString().trim();
  const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage();
  await p.goto(link); await p.locator('main button').first().click(); await p.waitForLoadState("networkidle");
  await ctx.storageState({ path: process.argv[2] }); console.log("signed in:", p.url());
  await b.close(); })();
