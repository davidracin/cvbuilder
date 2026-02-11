// Re-export useAuth from the shared AuthProvider context
// All components using this hook share the same user and profile state
export { useAuth } from '@/components/AuthProvider';
