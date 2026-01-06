import { PropsWithChildren } from 'react';

interface Props {
  open: boolean;
}

export function Drawer({ open, children }: PropsWithChildren<Props>) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50">
      {children}
    </div>
  );
}
