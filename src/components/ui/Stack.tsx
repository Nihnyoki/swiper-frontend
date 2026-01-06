import { PropsWithChildren } from 'react';

interface Props {
  direction?: 'row' | 'column';
  gap?: number;
}

export function Stack({
  direction = 'column',
  gap = 2,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`flex flex-${direction} gap-${gap}`}
    >
      {children}
    </div>
  );
}
