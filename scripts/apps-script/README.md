# Careers form backend (Google Apps Script)

The careers page at `/careers` posts applications to a Google Apps Script web
app. Rows land in a Google Sheet, CVs and work samples in a Drive folder next
to it, and you get an email for each application.

Nothing here is a secret: the web app URL is a public POST endpoint by design,
so it is safe to commit in `src/content/careers.json`.

## One-time setup (about 3 minutes)

1. Create a new Google Sheet, name it **Peak applications**.
   Put it wherever you want the CVs to live: the script creates a
   `Peak applications - files` folder alongside it.

2. In that sheet: **Extensions > Apps Script**.

3. Select everything already in the editor and delete it, including the
   `function myFunction() {` line and its closing `}`. Then paste the whole of
   `peak-careers-form.gs` and save.

   The paste has to be the entire file, at the top level. Pasting *inside*
   `myFunction` is valid JavaScript and saves without complaint, but it hides
   `doGet` and `doPost` from the runtime, and the deployment then answers
   `Script function not found: doGet`.

4. Check the `SETTINGS` block at the top. `notifyEmail` is where the alerts go.

5. Run the `setup` function once (pick it in the toolbar dropdown, press Run).
   Google will ask you to authorise the script: choose your account, then
   **Advanced > Go to (project name)** to get past the unverified-app warning,
   and **Allow**. This is your own script running in your own account.

6. **Deploy > New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then copy the **Web app URL**. It looks like
     `https://script.google.com/macros/s/AKfycb.../exec`.

7. Paste that URL into `applyEndpoint` in `src/content/careers.json`, then
   rebuild and deploy the site.

## Changing the script later

Edit the code, then **Deploy > Manage deployments > (pencil) > Version: New
version > Deploy**. The URL stays the same. If you create a *new* deployment
instead, you get a new URL and have to update `careers.json` again.

## Checking it works

Open the web app URL in a browser. You should see exactly this:

```json
{"ok":true,"service":"Peak careers form"}
```

Anything else means the deployment is not serving your code:

| What you see | What it means | Fix |
|---|---|---|
| `Script function not found: doGet` | The deployment is pinned to a version that predates your paste | Save the file, then **Deploy > Manage deployments > (pencil) > Version: New version > Deploy** |
| A Google sign-in page | Access is not set to **Anyone** | **Deploy > Manage deployments > (pencil) > Who has access: Anyone > Deploy** |
| `Authorization is required` | The `setup` function was never run | Run `setup` from the editor and accept the permission prompts |

Every one of these also shows up on the careers page as "We could not send
that: Failed to fetch", because an Apps Script error page carries no CORS
header for the browser to read.

## Notes

- The browser posts JSON as `text/plain` so the request stays CORS-simple.
  Apps Script cannot answer an `OPTIONS` preflight, so do not change that
  header to `application/json`.
- Files arrive base64 encoded inside the request body. Keep the caps in
  `careers.json` and in `SETTINGS` in step with each other.
- A hidden `website` field is a honeypot. Bots fill it, people do not, and the
  script silently drops those.
- `allowedPages` rejects posts that do not come from a known page.
