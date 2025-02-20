-- Drop existing company-related columns from profiles
ALTER TABLE profiles
DROP COLUMN IF EXISTS company_id,
DROP COLUMN IF EXISTS company_role;

-- Add company-related columns to profiles
ALTER TABLE profiles
ADD COLUMN company_id uuid REFERENCES companies(id),
ADD COLUMN company_role text CHECK (company_role IN ('admin', 'user'));

-- Drop existing company policies
DROP POLICY IF EXISTS "Companies are viewable by their members" ON companies;
DROP POLICY IF EXISTS "Companies are updatable by admins" ON companies;
DROP POLICY IF EXISTS "Companies are insertable during registration" ON companies;

-- Create more permissive policies for companies
CREATE POLICY "Companies are insertable by anyone"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Companies are viewable by their members"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Companies are updatable by admins"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM profiles 
      WHERE id = auth.uid() 
      AND company_role = 'admin'
    )
  );

-- Add helpful comments
COMMENT ON POLICY "Companies are insertable by anyone" ON companies 
  IS 'Allows any authenticated user to create a company';
COMMENT ON POLICY "Companies are viewable by their members" ON companies 
  IS 'Allows company members to view their company details';
COMMENT ON POLICY "Companies are updatable by admins" ON companies 
  IS 'Allows company admins to update company details';