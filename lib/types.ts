/**
 * Shared TypeScript types derived from the Supabase DB schema.
 * Add to this file as more tables are used in the app.
 * Do NOT import generated Supabase types here — keep this manual
 * and minimal until we need full type generation.
 */

export type Profile = {
  id: string;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: 'traveler' | 'admin';
  created_at: string;
};
