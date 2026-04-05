/*
  # Create contact_inquiries table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key) - Unique identifier for each inquiry
      - `name` (text) - Inquirer's full name
      - `email` (text) - Inquirer's email address
      - `phone` (text) - Inquirer's phone number
      - `subject` (text) - Subject of inquiry
      - `message` (text) - Detailed message/question
      - `created_at` (timestamp) - Auto-generated timestamp
      - `status` (text) - Inquiry status (pending, reviewed)

  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy to allow public INSERT (anyone can submit contact form)
    - Add restrictive policy to prevent unauthorized SELECT/UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No direct access"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (false);