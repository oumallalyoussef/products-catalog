interface StatusMessageProps {
  readonly variant: 'loading' | 'error' | 'empty';
  readonly message: string;
}

export function StatusMessage({ variant, message }: StatusMessageProps) {
  return (
    <p
      className={`status status--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {message}
    </p>
  );
}
