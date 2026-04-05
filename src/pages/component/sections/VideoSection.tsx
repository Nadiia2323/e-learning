import React from "react";

export default function VideoSection({ video, lyric }) {
  return (
    <div>
      {video ? (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <iframe
            src={video}
            title={lyric}
            className="h-[240px] w-full md:h-[420px]"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-zinc-400">No video available.</p>
      )}
    </div>
  );
}
