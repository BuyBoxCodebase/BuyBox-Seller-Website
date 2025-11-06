 'lucide-react';
import { Videos } from '../data/schema';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Trash2, Edit } from 'lucide-react';



interface VideoShowcaseProps {
  videos: Videos[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (video: Videos) => void;
}

export function VideoShowcase({ videos, isLoading = false, onDelete, onEdit }: VideoShowcaseProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause other videos
      Object.entries(videoRefs.current).forEach(([key, vid]) => {
        if (key !== id && vid) {
          vid.pause();
        }
      });
      video.play();
      setPlayingId(id);
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        video.muted = false;
      } else {
        newSet.add(id);
        video.muted = true;
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Initialize all videos as muted
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = true;
      }
    });
    setMutedVideos(new Set(videos.map(v => v.id)));
  }, [videos]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-6xl">📹</div>
        <h3 className="text-xl font-semibold">No videos yet</h3>
        <p className="text-muted-foreground">Start creating your first video showcase</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
      {videos.map((video) => {
        const isPlaying = playingId === video.id;
        const isMuted = mutedVideos.has(video.id);

        return (
          <div
            key={video.id}
            className="relative group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[9/16]"
          >
            {/* Video Container */}
            <div className="relative w-full h-full bg-black">
              <video
                ref={(el) => {
                  videoRefs.current[video.id] = el;
                }}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                preload="metadata"
                onClick={() => togglePlay(video.id)}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Play/Pause Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity ${
                  isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
                onClick={() => togglePlay(video.id)}
              >
                <div className="bg-black/60 rounded-full p-4 backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-2 mb-1">
                    {video.caption}
                  </p>
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                      Size {video.size}
                    </span>
                    {/* <span>{formatDate(video.createdAt)}</span> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => toggleMute(video.id, e)}
                className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(video);
                  }}
                  className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(video.id);
                  }}
                  className="bg-black/60 hover:bg-red-500/80 p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Product ID Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                ID: {video.id.substring(0, 8)}...
              </span>
            </div>

            {/* Playing Indicator */}
            {isPlaying && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs">Playing</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}