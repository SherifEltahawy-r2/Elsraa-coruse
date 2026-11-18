# Al-Israa Law Center setup

The site uses Supabase Auth, Postgres, Realtime, and a private Storage bucket.
It does not include an administrator password or a Gmail password.

## 1. Create Supabase project and schema

Create a Supabase project. In its SQL Editor, run `supabase-schema.sql` on a
new project. The previous schema used a different profile structure; do not
run this replacement over a live database without first backing up and
migrating its data.

In **Project Settings → API**, copy the Project URL and the publishable key
(or legacy `anon` key) into `js/config.js`. These are browser-visible values;
never put a `service_role` key in this project.

After the base schema has been installed, run `supabase-social-settings-migration.sql`
in the SQL Editor. It creates the public social-link settings row, which only
administrators can update from the dashboard. The same migration also adds
editable website copyright and R2J WEB DEV developer-credit fields.

Then run `supabase-safety-migration.sql` to enable account moderation, account
status, temporary mute/kick controls, extra course videos, message deletion,
and call-room tables. The SQL migration uses administrator-only RPC functions.
Password recovery is always sent through Supabase email; passwords are never
read or displayed by this website.

## 2. Require confirmed email

In **Authentication → Providers → Email**, enable email confirmation. In
**Authentication → URL Configuration**, set the production site URL and add
the local and production callback URLs for `dashboard.html` and
`update-password.html`.

To add a bot check as well as mailbox confirmation, create a Cloudflare
Turnstile site key and secret. Put only the site key in
`ALISRAA_TURNSTILE_SITE_KEY` in `js/config.js`; configure the secret under
**Authentication → Bot and Abuse Protection** in Supabase. Email confirmation
verifies control of the mailbox; Turnstile is the separate human/bot check.

For production email delivery, configure a custom SMTP provider in
**Authentication → SMTP Settings**. If using Gmail, create a Google App
Password with two-step verification and enter it only in Supabase's SMTP
settings. Never put the Gmail password or App Password in `config.js`, source
control, or chat. Supabase's default mail service is intended for testing and
has sending limits.

## 3. Set the first administrator

Register with the Gmail address that should own the site and confirm the
email. Then run this SQL once in the Supabase SQL Editor, replacing the
placeholder with that address:

```sql
update public.profiles
set role = 'admin'
where lower(email) = lower('YOUR_ADMIN_EMAIL')
  and exists (
    select 1 from auth.users
    where auth.users.id = profiles.id
      and auth.users.email_confirmed_at is not null
  );
```

After that, an administrator can promote or demote confirmed accounts from
the admin dashboard. Do not assign administrator roles to unverified users.

## 4. Use the site

- Users register with their name, faculty, year, phone, email, and password.
  Supabase sends the confirmation email and stores account data centrally, so
  it is shared across devices.
- Password recovery sends a Supabase email link to `update-password.html`.
- Enrollment requests are manual: the administrator approves or rejects each
  request. Approval creates a unique code tied to that student's account.
  No online payment provider is connected; the selected first version uses
  manual administrator approval and does not charge a card or wallet.
- Administrators manage bilingual course details, private course videos,
  schedules, user roles, and announcements. New courses and schedules create
  notifications; enrollment requests notify administrators.
- Videos should be uploaded to the private `course-videos` bucket through the
  admin form (50 MB per file in this version). Access is checked against the
  signed-in account's approved enrollment.

Deploy the files to a static host over HTTPS and add the final site URL to
Supabase's allowed redirect URLs. Keep `js/config.js` limited to the public
Project URL and publishable/anon key; database RLS is the security boundary.
