import { ButtonHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils/classNames';

export function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={classNames(
        'p-2 rounded-full bg-black/30 text-white',
        className
      )}
    />
  );
}
