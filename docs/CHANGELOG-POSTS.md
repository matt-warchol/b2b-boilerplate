# Public changelog (/changelog)

Format and layout follow highseat.com/changelog: newest first, date and tags on the left, one card per entry with an optional screenshot, body text, then **Improvements** and **Fixes**. Every entry has its own page (`/changelog/<slug>`) and is in the RSS feed (`/changelog/rss.xml`).

- Data: `content/changelog.ts` (one object per entry). Code: `lib/changelog.ts`, `components/changelog/`, `app/(marketing)/changelog/`.
- The same module is used in RFPZen (`matt-warchol/rfpzen`); keep the code identical and change only `content/changelog.ts`.

## When to post

- At most one entry per day, and only when something shipped that a client would notice: a **new feature** or a clear **ease-of-use improvement**. 
- Small fixes and polish do not get their own entry. Add them as bullets under **Improvements** or **Fixes** of the next entry.
- Several features on one day may get separate entries when each is worth its own link (put the newest on top).
- Never: admin or internal tooling, security internals, customer names, numbers from real customer data.

## How to write an entry

- English, plain words, short sentences. Title says what the user can now do ("Invite your team"), not what we built.
- `summary`: one sentence (RSS, link previews). `body`: 1–3 short paragraphs. **Bold** the UI labels the user clicks.
- `tags`: one or two from `changelogTags`. `image` optional: a screenshot from `public/` (product shots only, fictional sample data).
- `date` = the day it reached production. A future date keeps the entry hidden until that day (pages revalidate hourly).

## Daily automation

Keep a plain-language log of user-visible changes (for example `CHANGELOG.md`). Once a day a scheduled agent run reads the items newer than the latest `date` in `content/changelog.ts`, picks the new features and clear improvements, and, if there is anything worth a post, writes the entries to `content/changelog.ts` on a branch and opens a PR. No empty entries, no direct pushes to `main`.
