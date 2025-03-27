import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '***REMOVED***';
const supabaseKey = '***REMOVED***';

export const supabase = createClient(supabaseUrl, supabaseKey);
