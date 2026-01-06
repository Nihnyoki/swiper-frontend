import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '@/lib/utils/classNames';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <button
      {...rest}
      className={classNames(
        'px-3 py-2 rounded text-sm',
        variant === 'primary' && 'bg-pink-500 text-white',
        variant === 'ghost' && 'bg-transparent text-pink-300',
        className
      )}
    >
      {children}
    </button>
  );
}
