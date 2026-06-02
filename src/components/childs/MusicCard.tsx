import React, { useMemo } from 'react'
import { MusicPlayer } from './MusicPlayer'

type MusicCardProps = {
  person: any
  childItems: any[]
}

function resolveAudioUrl(item: any) {
  if (typeof item.url === 'string' && item.url.trim()) return item.url
  if (item.audio) {
    try {
      const parsed = typeof item.audio === 'string' ? JSON.parse(item.audio) : item.audio
      if (parsed?.url) return parsed.url
    } catch {
      // ignore
    }
  }
  return item.path || item.file || ''
}

function resolveTitle(item: any) {
  return item.title || item.name || item.label || 'Untitled track'
}

export function MusicCard({ childItems }: MusicCardProps) {
  const audioFiles = useMemo(() => {
    return childItems
      .flatMap((child) => Array.isArray(child.data) ? child.data : [])
      .filter((item: any) => item?.type === 'audio' || Boolean(resolveAudioUrl(item)))
      .map((item: any, index: number) => ({
        id: item.id ?? item._id ?? `music-${index}`,
        url: resolveAudioUrl(item),
        title: resolveTitle(item),
        thumbnailUrl: item.thumbnailUrl || item.image?.url || '/default-music.jpeg',
      }))
      .filter((item) => item.url)
  }, [childItems])

  if (audioFiles.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/70 text-white">
        <div className="text-center px-6">
          <p className="text-lg font-semibold">No music available</p>
          <p className="text-sm text-white/70">Add audio files to the MUSIC category to see them here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden bg-black/80">
      <MusicPlayer audioFiles={audioFiles} />
    </div>
  )
}
