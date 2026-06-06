// utils.ts
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getImageUrl(url: string, image?: string) {
  if (!image) return null;

  const cleanBase = url.replace(/\/$/, '');

  // If image contains a public path (e.g. "public/IFATHS/filename.jpg"),
  // prefer the segment after "public/" so we preserve directory like "IFATHS/filename.jpg".
  if (image.includes('public/')) {
    const afterPublic = image.split('public/').pop();
    return afterPublic ? `${cleanBase}/${afterPublic.replace(/^\/+/, '')}` : null;
  }

  // If image already includes a directory (e.g. "IFATHS/filename.jpg"), keep it.
  if (image.includes('/')) {
    return `${cleanBase}/${image.replace(/^\/+/, '')}`;
  }

  // Fallback: plain filename
  const filename = image.split('/').pop();
  return filename ? `${cleanBase}/${filename}` : null;
}
