/**
 * Careers page generator.
 *
 * Roles come from `src/content/careers.json` (single source of truth).
 * The page is fully static: the listing needs no JavaScript, and the apply
 * form posts to a Google Apps Script web app (`applyEndpoint` in that JSON)
 * which writes a row to a Google Sheet and drops files in a Drive folder.
 *
 * Contract with scripts/apps-script/peak-careers-form.gs:
 *   POST body: JSON string, Content-Type text/plain (keeps it a CORS-simple
 *   request, so no OPTIONS preflight that Apps Script cannot answer).
 *   { roleId, roleTitle, name, email, linkedin, instagram, x, youtube,
 *     about, cv: {name, type, data}, sample: {name, type, data} | null,
 *     website }   // `website` is the honeypot, must be empty
 *   Response: { ok: true } or { ok: false, error: "..." }
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

export const CAREERS_PATH = "/careers";

export function loadCareers() {
  return JSON.parse(
    readFileSync(resolve(root, "src/content/careers.json"), "utf8"),
  );
}

function esc(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const COUNT_WORDS = ["no", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

/** "Three" for 3. Falls back to digits past nine, which we will never hit. */
function countWord(n) {
  return COUNT_WORDS[n] ?? String(n);
}

function bulletList(items) {
  return `<ul class="role-list">${items
    .map((item) => `<li>${esc(item)}</li>`)
    .join("")}</ul>`;
}

function roleSection(role) {
  return `
      <section class="role" id="${esc(role.slug)}">
        <div class="role-head">
          <div>
            <p class="role-id">${esc(role.id)}</p>
            <h2>${esc(role.title)}</h2>
          </div>
          <span class="role-status">${esc(role.status)}</span>
        </div>

        <dl class="role-facts">
          <div><dt>Commitment</dt><dd>${esc(role.commitment)}</dd></div>
          <div><dt>Location</dt><dd>${esc(role.location)}</dd></div>
          <div><dt>Compensation</dt><dd>${esc(role.compensation)}</dd></div>
        </dl>

        <p class="role-summary">${esc(role.summary)}</p>

        <h3>What you'll do</h3>
        ${bulletList(role.responsibilities)}

        <h3>What we're looking for</h3>
        ${bulletList(role.lookingFor)}

        <h3>What you get</h3>
        ${bulletList(role.whatYouGet)}

        <p class="role-apply">
          <a class="btn" href="#apply" data-role="${esc(role.id)}">apply for this role →</a>
        </p>
      </section>`;
}

function jobPostingJsonLd(roles, origin, datePosted) {
  return roles.map((role) => {
    const description = [
      `<p>${role.summary}</p>`,
      `<p><strong>What you'll do</strong></p><ul>${role.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>`,
      `<p><strong>What we're looking for</strong></p><ul>${role.lookingFor.map((r) => `<li>${r}</li>`).join("")}</ul>`,
      `<p><strong>What you get</strong></p><ul>${role.whatYouGet.map((r) => `<li>${r}</li>`).join("")}</ul>`,
    ].join("");

    // Google Jobs treats jobLocationType: TELECOMMUTE as a promise that the
    // applicant never needs to be physically present. True for our remote
    // roles; false for a hybrid/in-office one, which instead needs a real
    // jobLocation. We don't have a specific office address on file, so this
    // falls back to a country-level Place rather than mis-declaring it as
    // fully remote.
    const isRemote = role.remote !== false;

    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: role.title,
      description,
      identifier: {
        "@type": "PropertyValue",
        name: "Peak",
        value: role.id,
      },
      datePosted,
      employmentType: role.employmentType,
      hiringOrganization: {
        "@type": "Organization",
        name: "Peak",
        sameAs: origin,
        logo: `${origin}/android-chrome-512x512.png`,
      },
      ...(isRemote
        ? {
            jobLocationType: "TELECOMMUTE",
            applicantLocationRequirements: { "@type": "Country", name: "India" },
          }
        : {
            jobLocation: {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressCountry: "IN" },
            },
          }),
      directApply: true,
      url: `${origin}${CAREERS_PATH}/#${role.slug}`,
    };
  });
}

const PAGE_STYLES = `
    .careers-intro { font-size: 1.0625rem; }
    .role {
      border-top: 1px solid var(--border);
      padding-top: 2rem;
      margin-top: 3rem;
    }
    .role-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .role-id {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
      margin: 0;
    }
    article .role h2 { margin: 0.4rem 0 0; }
    article .role h3 {
      font-size: 0.7rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gold);
      margin: 1.75rem 0 0.6rem;
      font-weight: 500;
    }
    .role-status {
      flex: none;
      border: 1px solid var(--gold);
      border-radius: 999px;
      padding: 0.25rem 0.7rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--gold);
      white-space: nowrap;
    }
    .role-facts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 2.25rem;
      margin: 1.25rem 0 1.5rem;
    }
    .role-facts div { margin: 0; }
    .role-facts dt {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--clay);
      margin: 0 0 0.2rem;
    }
    .role-facts dd { margin: 0; color: var(--ink); font-size: 0.9375rem; }
    .role-summary { color: var(--ink); font-size: 1.0625rem; }
    article ul.role-list { margin: 0; padding-left: 1.1rem; }
    .role-apply { margin: 1.75rem 0 0; }
    .btn {
      display: inline-block;
      border: 1px solid var(--ink);
      padding: 0.6rem 1.1rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: lowercase;
      letter-spacing: 0.12em;
      color: var(--ink);
      text-decoration: none;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }
    .btn:hover { background: var(--ink); color: var(--parchment); }
    article a.btn:hover { color: var(--parchment); }
    .btn[disabled] { opacity: 0.5; cursor: default; }

    .apply {
      border-top: 1px solid var(--border);
      margin-top: 4rem;
      padding-top: 2.5rem;
      scroll-margin-top: 1.5rem;
    }
    .field { margin-bottom: 1.5rem; }
    .field label {
      display: block;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--clay);
      margin-bottom: 0.45rem;
    }
    .field .hint {
      display: block;
      margin-top: 0.4rem;
      font-size: 0.8125rem;
      color: var(--clay);
      line-height: 1.5;
      text-transform: none;
      letter-spacing: 0;
      font-family: Inter, system-ui, sans-serif;
    }
    .field input[type="text"],
    .field input[type="email"],
    .field input[type="url"],
    .field select,
    .field textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid var(--border);
      border-radius: 0.125rem;
      padding: 0.7rem 0.75rem;
      font-family: Inter, system-ui, sans-serif;
      font-size: 0.9375rem;
      color: var(--ink);
    }
    .field textarea { min-height: 9rem; resize: vertical; line-height: 1.65; }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none;
      border-color: var(--gold);
    }
    .field input[type="file"] {
      width: 100%;
      font-size: 0.8125rem;
      color: var(--muted);
      font-family: Inter, system-ui, sans-serif;
    }
    .field input[type="file"]::file-selector-button {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.6);
      border-radius: 0.125rem;
      padding: 0.45rem 0.8rem;
      margin-right: 0.75rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: lowercase;
      letter-spacing: 0.1em;
      color: var(--ink);
      cursor: pointer;
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 1.25rem;
    }
    @media (max-width: 34rem) { .field-grid { grid-template-columns: 1fr; } }
    .req { color: var(--gold); }
    .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
    .wordcount {
      float: right;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      color: var(--clay);
      text-transform: none;
    }
    .wordcount.over { color: #B0554C; }
    .form-note {
      font-size: 0.8125rem;
      color: var(--clay);
      line-height: 1.6;
      margin: 0 0 1.75rem;
    }
    .form-status {
      margin-top: 1.25rem;
      font-size: 0.9375rem;
      line-height: 1.6;
      display: none;
    }
    .form-status.show { display: block; }
    .form-status.err { color: #B0554C; }
    .form-status.ok {
      color: var(--ink);
      border-left: 2px solid var(--gold);
      padding-left: 1rem;
    }
    .noscript-note {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.4);
      padding: 1rem 1.25rem;
      font-size: 0.9375rem;
    }
`;

function applyFormHtml(careers) {
  const options = careers.roles
    .map(
      (role) =>
        `<option value="${esc(role.id)}">${esc(role.title)} (${esc(role.commitment)})</option>`,
    )
    .join("");

  const sampleHints = careers.roles
    .map((role) => `${role.title}: ${role.sampleHint}`)
    .join(" · ");

  const mailto = `mailto:${esc(careers.applyFallbackEmail)}?subject=${encodeURIComponent("Application - Peak")}`;

  if (!careers.applyEndpoint) {
    return `
      <section class="apply" id="apply">
        <h2>Apply</h2>
        <div class="noscript-note">
          <p style="margin:0">The form is being switched on. Until it is, email
          <a href="${mailto}">${esc(careers.applyFallbackEmail)}</a> with the role
          you want, your CV, and a hundred words on why you fit it.</p>
        </div>
      </section>`;
  }

  return `
      <section class="apply" id="apply">
        <h2>Apply</h2>
        <p class="form-note">One form, every role. Everything marked
          <span class="req">*</span> is required. Your files come to us and go
          nowhere else.</p>

        <noscript>
          <div class="noscript-note">
            <p style="margin:0">This form needs JavaScript to send your files.
            With it switched off, email
            <a href="${mailto}">${esc(careers.applyFallbackEmail)}</a> instead.</p>
          </div>
        </noscript>

        <form id="apply-form" novalidate>
          <div class="field">
            <label for="role">Role <span class="req">*</span></label>
            <select id="role" name="role" required>${options}</select>
          </div>

          <div class="field-grid">
            <div class="field">
              <label for="name">Your name <span class="req">*</span></label>
              <input type="text" id="name" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="email">Email <span class="req">*</span></label>
              <input type="email" id="email" name="email" autocomplete="email" required>
            </div>
          </div>

          <div class="field">
            <label>Your profiles <span style="text-transform:none;letter-spacing:0;font-family:Inter,system-ui,sans-serif">(optional)</span></label>
            <span class="hint" style="margin-top:0;margin-bottom:0.75rem">Share whichever you actually use. Leave the rest blank.</span>
          </div>

          <div class="field-grid">
            <div class="field">
              <label for="linkedin">LinkedIn</label>
              <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." autocomplete="url">
            </div>
            <div class="field">
              <label for="instagram">Instagram</label>
              <input type="url" id="instagram" name="instagram" placeholder="https://instagram.com/...">
            </div>
            <div class="field">
              <label for="x">X</label>
              <input type="url" id="x" name="x" placeholder="https://x.com/...">
            </div>
            <div class="field">
              <label for="youtube">YouTube</label>
              <input type="url" id="youtube" name="youtube" placeholder="https://youtube.com/@...">
            </div>
          </div>

          <div class="field">
            <label for="about">
              About you, in the context of this role <span class="req">*</span>
              <span class="wordcount" id="wordcount">0 / 100 words</span>
            </label>
            <textarea id="about" name="about" required maxlength="1400"></textarea>
            <span class="hint">Roughly a hundred words. Not a cover letter. Why
              you, and why this role. We read every one ourselves, which is the
              reason for the hundred.</span>
          </div>

          <div class="field">
            <label for="cv">CV <span class="req">*</span></label>
            <input type="file" id="cv" name="cv" required
              accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <span class="hint">PDF or Word, up to ${Math.round(careers.maxCvBytes / 1048576)} MB.</span>
          </div>

          <div class="field">
            <label for="sample">Work sample <span style="text-transform:none;letter-spacing:0;font-family:Inter,system-ui,sans-serif">(optional)</span></label>
            <input type="file" id="sample" name="sample">
            <span class="hint">Only if it is relevant. Up to ${Math.round(careers.maxSampleBytes / 1048576)} MB.
              ${esc(sampleHints)}</span>
          </div>

          <div class="hp" aria-hidden="true">
            <label for="website">Website</label>
            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
          </div>

          <button class="btn" type="submit" id="apply-submit">send application</button>
          <p class="form-status" id="apply-status" role="status" aria-live="polite"></p>
        </form>
      </section>`;
}

function applyScript(careers) {
  if (!careers.applyEndpoint) return "";

  return `
<script>
(function () {
  var ENDPOINT = ${JSON.stringify(careers.applyEndpoint)};
  var MAX_CV = ${careers.maxCvBytes};
  var MAX_SAMPLE = ${careers.maxSampleBytes};
  var ROLES = ${JSON.stringify(
    Object.fromEntries(careers.roles.map((r) => [r.id, r.title])),
  )};
  var FALLBACK = ${JSON.stringify(careers.applyFallbackEmail)};

  var form = document.getElementById('apply-form');
  if (!form) return;
  var status = document.getElementById('apply-status');
  var submit = document.getElementById('apply-submit');
  var roleSelect = document.getElementById('role');
  var about = document.getElementById('about');
  var counter = document.getElementById('wordcount');

  function countWords(text) {
    var trimmed = text.trim();
    return trimmed ? trimmed.split(/\\s+/).length : 0;
  }

  about.addEventListener('input', function () {
    var n = countWords(about.value);
    counter.textContent = n + ' / 100 words';
    counter.classList.toggle('over', n > 130);
  });

  // "Apply for this role" buttons preselect the role.
  document.querySelectorAll('a.btn[data-role]').forEach(function (link) {
    link.addEventListener('click', function () {
      roleSelect.value = link.getAttribute('data-role');
    });
  });

  // ?role=PEAK-INT-02 or #community-outreach-associate also preselects it.
  var wanted = new URLSearchParams(location.search).get('role');
  if (wanted && ROLES[wanted]) roleSelect.value = wanted;

  function say(message, kind) {
    status.textContent = message;
    status.className = 'form-status show ' + kind;
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Could not read ' + file.name)); };
      reader.onload = function () {
        var result = String(reader.result);
        resolve({
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: result.slice(result.indexOf(',') + 1),
        });
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var text = about.value.trim();
    var cvFile = form.cv.files[0];
    var sampleFile = form.sample.files[0];

    if (name.length < 2) return say('Please tell us your name.', 'err');
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) return say('That email address does not look right.', 'err');
    if (countWords(text) < 30) return say('Please write at least a few sentences about yourself.', 'err');
    if (!cvFile) return say('Please attach your CV.', 'err');
    if (cvFile.size > MAX_CV) return say('Your CV is larger than ' + Math.round(MAX_CV / 1048576) + ' MB. Please attach a smaller file.', 'err');
    if (sampleFile && sampleFile.size > MAX_SAMPLE) return say('Your work sample is larger than ' + Math.round(MAX_SAMPLE / 1048576) + ' MB. Please attach a smaller file or send a link instead.', 'err');

    submit.disabled = true;
    say('Sending. Large files take a moment.', 'ok');

    Promise.all([readFile(cvFile), sampleFile ? readFile(sampleFile) : null])
      .then(function (files) {
        return fetch(ENDPOINT, {
          method: 'POST',
          // text/plain keeps this a CORS-simple request (no preflight).
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            roleId: roleSelect.value,
            roleTitle: ROLES[roleSelect.value] || roleSelect.value,
            name: name,
            email: email,
            linkedin: form.linkedin.value.trim(),
            instagram: form.instagram.value.trim(),
            x: form.x.value.trim(),
            youtube: form.youtube.value.trim(),
            about: text,
            cv: files[0],
            sample: files[1],
            website: form.website.value,
            page: location.href,
          }),
        });
      })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result || !result.ok) throw new Error((result && result.error) || 'Unknown error');
        form.style.display = 'none';
        say('Your application for ' + (ROLES[roleSelect.value] || 'this role') + ' is in. We read every one ourselves. If there is a fit, you will hear from us.', 'ok');
        status.style.display = 'block';
        if (window.dataLayer) window.dataLayer.push({ event: 'career_application', role: roleSelect.value });
      })
      .catch(function (error) {
        submit.disabled = false;
        say('We could not send that: ' + error.message + '. Please try again, or email ' + FALLBACK + ' with your CV.', 'err');
      });
  });
})();
</script>`;
}

/** @returns {{ path: string } & Record<string, unknown>} a page for postbuild's writePage */
export function careersPage({ origin = "https://peaklife.me", datePosted } = {}) {
  const careers = loadCareers();
  const posted = datePosted || new Date().toISOString().slice(0, 10);

  const jsonLd = jobPostingJsonLd(careers.roles, origin, posted)
    .map(
      (data) =>
        `  <script type="application/ld+json">${JSON.stringify(data)}</script>`,
    )
    .join("\n");

  const content = `
      <p class="careers-intro"><strong>Small team. Paid work. No layer between
      you and the founders.</strong></p>

      <p>That is the short version.</p>

      <p>Peak is a user manual for your life: jyotisha put to work on real
      decisions, in an app people open every morning. We are early. That means
      what you build ships in days rather than quarters. It also means nobody is
      going to hand you a brief and a process. You will be writing both.</p>

      <p>${countWord(careers.roles.length)} roles are open. All remote. All
      paid. Read the one you want, then use the single form at the bottom of
      this page.</p>

      ${careers.roles.map(roleSection).join("\n")}

      ${applyFormHtml(careers)}
      ${applyScript(careers)}`;

  return {
    path: "careers/index.html",
    title: "Careers - Peak",
    description:
      "Open roles at Peak: remote, paid, working directly with the founders on jyotisha built for real decisions.",
    eyebrow: "Careers",
    heading: "Work at Peak.",
    metaLine: `${careers.roles.length} open roles · Remote`,
    backHref: "/",
    backLabel: "Home",
    extraHead: `${jsonLd}\n  <style>${PAGE_STYLES}  </style>\n`,
    content,
  };
}
