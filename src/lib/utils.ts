// utils.ts
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getImageUrl(url: string, image?: string) {
  if (!image) return null;

  const cleanBase = url.replace(/\/$/, '');
  const filename = image.split('/').pop();

  return filename
    ? `${cleanBase}/${filename}`
    : null;
}
