/*
  # Create reading_history and collections tables

  ## Overview
  Adds two new tables to support the three-tab profile panel:
  - `reading_history` — records each (question → book) reading session
  - `collections` — stores user-saved items: dispatches, books, or quotes

  ## New Tables

  ### reading_history
  Tracks when a user taps "Start Reading" in the article dispatch view.
  Each row pairs the question that triggered the dispatch with the
  book recommended in the response.

  Columns:
  - `id` (uuid, PK) — auto-generated
  - `device_id` (uuid, NOT NULL) — device-scoped identifier from localStorage
  - `date` (date, NOT NULL) — calendar date of the reading session (YYYY-MM-DD)
  - `question_text` (text) — the question the user asked
  - `book_title` (text) — the book title from the dispatch response
  - `book_author` (text) — the book author
  - `tag` (text) — reading dimension tag (Health, Ideas, etc.)
  - `color` (text) — card accent color from the dispatch
  - `created_at` (timestamptz) — server timestamp

  ### collections
  Stores items the user saves via the "Save" button. Type field
  distinguishes between dispatch summaries, book recommendations,
  and pull quotes.

  Columns:
  - `id` (uuid, PK) — auto-generated
  - `device_id` (uuid, NOT NULL) — device-scoped identifier from localStorage
  - `type` (text, NOT NULL) — one of: 'dispatch' | 'book' | 'quote'
  - `title` (text) — primary display title (empathy headline or book title)
  - `subtitle` (text) — secondary info (book name or tag label)
  - `content` (text) — optional longer saved text (pull quote body, etc.)
  - `tag` (text) — reading dimension tag
  - `color` (text) — card accent color
  - `created_at` (timestamptz) — server timestamp

  ## Security
  - RLS enabled on both tables
  - Policies scope all access to rows with a matching non-null device_id
  - Uses anon role since the app has no user authentication system
  - Separate policies for SELECT, INSERT, UPDATE, DELETE

  ## Notes
  1. The device_id is generated once per device and stored in localStorage
  2. No UPDATE needed for reading_history (immutable event log)
  3. Collections can be deleted (user removes a saved item)
  4. Indexes added on device_id for query performance
*/

-- ── reading_history ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reading_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id   uuid NOT NULL,
  date        date NOT NULL DEFAULT CURRENT_DATE,
  question_text text DEFAULT '',
  book_title  text DEFAULT '',
  book_author text DEFAULT '',
  tag         text DEFAULT '',
  color       text DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reading_history_device_id_idx ON reading_history (device_id);
CREATE INDEX IF NOT EXISTS reading_history_date_idx ON reading_history (device_id, date);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "device can read own reading history"
  ON reading_history FOR SELECT
  TO anon
  USING (device_id IS NOT NULL);

CREATE POLICY "device can insert reading history"
  ON reading_history FOR INSERT
  TO anon
  WITH CHECK (device_id IS NOT NULL);

CREATE POLICY "device can delete own reading history"
  ON reading_history FOR DELETE
  TO anon
  USING (device_id IS NOT NULL);


-- ── collections ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id   uuid NOT NULL,
  type        text NOT NULL DEFAULT 'dispatch',
  title       text DEFAULT '',
  subtitle    text DEFAULT '',
  content     text DEFAULT '',
  tag         text DEFAULT '',
  color       text DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collections_device_id_idx ON collections (device_id);
CREATE INDEX IF NOT EXISTS collections_type_idx ON collections (device_id, type);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "device can read own collections"
  ON collections FOR SELECT
  TO anon
  USING (device_id IS NOT NULL);

CREATE POLICY "device can insert collections"
  ON collections FOR INSERT
  TO anon
  WITH CHECK (device_id IS NOT NULL);

CREATE POLICY "device can delete own collections"
  ON collections FOR DELETE
  TO anon
  USING (device_id IS NOT NULL);
