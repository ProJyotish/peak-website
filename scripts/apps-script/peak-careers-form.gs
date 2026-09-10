/**
 * Peak careers form receiver.
 *
 * Receives applications from https://peaklife.me/careers/, writes one row per
 * application to a Google Sheet, saves the CV and work sample to a Drive
 * folder, and emails a notification.
 *
 * Setup is in scripts/apps-script/README.md.
 *
 * Paired with scripts/careers.mjs — if you change a field name here, change it
 * there too.
 */

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

var SETTINGS = {
  // Where to email each new application. Leave blank to switch email off.
  notifyEmail: 'rana@peaklife.me',

  // Name of the Drive folder that holds CVs and work samples. Created on first
  // run, inside the same folder as the spreadsheet.
  filesFolderName: 'Peak applications - files',

  // Only accept posts from these origins. Add your preview URL if you test there.
  allowedPages: ['peaklife.me', 'peaklife-website-drafts', 'localhost', '127.0.0.1'],

  maxCvBytes: 5 * 1024 * 1024,
  maxSampleBytes: 10 * 1024 * 1024,
};

var HEADERS = [
  'Received',
  'Role',
  'Role ID',
  'Name',
  'Email',
  'About (100 words)',
  'CV',
  'Work sample',
  'LinkedIn',
  'Instagram',
  'X',
  'YouTube',
  'Status',
  'Notes',
];

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Empty request' });
    }

    var body = JSON.parse(e.postData.contents);

    // Honeypot: real applicants never fill this in.
    if (body.website) return json({ ok: true });

    if (!pageIsAllowed(body.page)) {
      return json({ ok: false, error: 'Unrecognised origin' });
    }

    var name = clean(body.name, 120);
    var email = clean(body.email, 160);
    var about = clean(body.about, 4000);

    if (name.length < 2) return json({ ok: false, error: 'Name is missing' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: 'Email is not valid' });
    }
    if (about.length < 40) return json({ ok: false, error: 'Tell us a bit more about yourself' });
    if (!body.cv || !body.cv.data) return json({ ok: false, error: 'CV is missing' });

    var folder = filesFolder();
    var stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
    var safeName = name.replace(/[^\w\s.-]/g, '').trim() || 'applicant';
    var roleId = clean(body.roleId, 40) || 'UNKNOWN';

    var cv = saveFile(folder, body.cv, SETTINGS.maxCvBytes,
      stamp + ' ' + safeName + ' ' + roleId + ' CV');
    if (cv.error) return json({ ok: false, error: cv.error });

    var sample = { url: '' };
    if (body.sample && body.sample.data) {
      sample = saveFile(folder, body.sample, SETTINGS.maxSampleBytes,
        stamp + ' ' + safeName + ' ' + roleId + ' sample');
      if (sample.error) return json({ ok: false, error: sample.error });
    }

    var row = [
      new Date(),
      clean(body.roleTitle, 120),
      roleId,
      name,
      email,
      about,
      cv.url,
      sample.url,
      clean(body.linkedin, 300),
      clean(body.instagram, 300),
      clean(body.x, 300),
      clean(body.youtube, 300),
      'New',
      '',
    ];

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      sheet().appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // The application is saved by this point. A failed notification (mail
    // quota, mostly) must not tell the applicant their submission failed.
    try {
      notify(row);
    } catch (mailErr) {
      console.error(mailErr);
    }

    return json({ ok: true });
  } catch (err) {
    // Log so failures are visible in Executions, but never leak internals.
    console.error(err);
    return json({ ok: false, error: 'Server error, please email us instead' });
  }
}

function doGet() {
  return json({ ok: true, service: 'Peak careers form' });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function pageIsAllowed(page) {
  if (!page) return true; // tolerate clients that do not send it
  for (var i = 0; i < SETTINGS.allowedPages.length; i++) {
    if (String(page).indexOf(SETTINGS.allowedPages[i]) !== -1) return true;
  }
  return false;
}

function sheet() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications');
  if (!sh) {
    sh = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Applications');
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(6, 420); // About
  }
  return sh;
}

function filesFolder() {
  var ssFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  var parents = ssFile.getParents();
  var parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();

  var existing = parent.getFoldersByName(SETTINGS.filesFolderName);
  return existing.hasNext() ? existing.next() : parent.createFolder(SETTINGS.filesFolderName);
}

function saveFile(folder, payload, maxBytes, baseName) {
  try {
    var bytes = Utilities.base64Decode(payload.data);
    if (bytes.length > maxBytes) {
      return { error: 'File is larger than ' + Math.round(maxBytes / 1048576) + ' MB' };
    }
    var original = String(payload.name || 'file');
    var dot = original.lastIndexOf('.');
    var extension = dot > 0 ? original.slice(dot) : '';
    var blob = Utilities.newBlob(
      bytes,
      payload.type || 'application/octet-stream',
      baseName + extension
    );
    var file = folder.createFile(blob);
    return { url: file.getUrl() };
  } catch (err) {
    console.error(err);
    return { error: 'Could not save ' + (payload && payload.name ? payload.name : 'the file') };
  }
}

function notify(row) {
  if (!SETTINGS.notifyEmail) return;
  var lines = [];
  for (var i = 1; i < HEADERS.length - 2; i++) {
    if (row[i]) lines.push(HEADERS[i] + ': ' + row[i]);
  }
  lines.push('');
  lines.push('Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());

  MailApp.sendEmail({
    to: SETTINGS.notifyEmail,
    subject: 'Peak application: ' + row[3] + ' for ' + row[1],
    body: lines.join('\n'),
  });
}

/** Run once from the editor to create the sheet headers and grant permissions. */
function setup() {
  sheet();
  filesFolder();
  Logger.log('Ready. Now deploy: Deploy > New deployment > Web app.');
}
