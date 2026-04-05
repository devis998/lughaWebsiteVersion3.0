/*
  # Create quote_requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key) - Unique identifier for each quote request
      - `name` (text) - Client's full name
      - `email` (text) - Client's email address
      - `phone` (text) - Client's phone number
      - `category` (text) - Translation category (e.g., Legal, Medical, Technical)
      - `description` (text) - Project description/details
      - `urgency` (text) - Timeline urgency level
      - `source_language` (text) - Source language for translation
      - `target_languages` (text array) - Target languages needed
      - `message` (text) - Additional client notes/message
      - `created_at` (timestamp) - Auto-generated timestamp
      - `status` (text) - Request status (pending, reviewed, contacted)

  2. Security
    - Enable RLS on `quote_requests` table
    - Add policy to allow public INSERT (anyone can submit quote requests)
    - Add restrictive policy to prevent unauthorized SELECT/UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  urgency text DEFAULT 'standard',
  source_language text NOT NULL,
  target_languages text[] NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No direct access"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (false);