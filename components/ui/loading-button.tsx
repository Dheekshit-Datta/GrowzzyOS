import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ 
  loading = false, 
  children, 
  disabled, 
  className = '', 
  ...props 
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={`relative ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
      )}
      <span className={loading ? 'ml-6' : ''}>
        {loading ? 'Loading...' : children}
      </span>
    </Button>
  );
}
