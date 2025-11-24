interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'gray' | 'blue' | 'green';
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'indigo' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-32 w-32'
  };

  const colorClasses = {
    indigo: 'border-indigo-500',
    gray: 'border-gray-500',
    blue: 'border-blue-500',
    green: 'border-green-500'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${colorClasses[color]}`} />
  );
}