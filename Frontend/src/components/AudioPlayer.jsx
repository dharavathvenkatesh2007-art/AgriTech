import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AudioPlayer({ audioUrl, autoPlay = false, onFinished }) {
  const { API_BASE } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  // Prepend backend host if URL is relative
  const getFullAudioUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Strip '/api' from BASE_URL to get host (e.g. http://localhost:5000)
    const host = API_BASE.replace('/api', '');
    return `${host}${url}`;
  };

  const fullUrl = getFullAudioUrl(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !fullUrl) return;

    audio.src = fullUrl;
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onFinished) onFinished();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      // Browsers restrict autoplay without user interaction, so we catch errors gracefully
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay blocked by browser. User interaction required.'));
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [fullUrl, autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Audio playback failed:', err));
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsPlaying(true));
    }
  };

  const toggleSpeed = () => {
    if (playbackRate === 1.0) setPlaybackRate(0.8); // slower
    else if (playbackRate === 0.8) setPlaybackRate(1.2); // faster
    else setPlaybackRate(1.0); // normal
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full glass-card-green p-4 rounded-2xl border border-farm-green/20 flex flex-col space-y-3">
      <audio ref={audioRef} />
      
      {/* Waveform and current status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-farm-gold px-2 py-0.5 bg-farm-gold/10 rounded border border-farm-gold/20">
            Advisory Voice
          </span>
          <span className="text-xs text-slate-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Visualizer Waves */}
        {isPlaying ? (
          <div className="flex items-end space-x-0.5 h-6">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </div>
        ) : (
          <div className="flex items-end space-x-0.5 h-6 opacity-30">
            <span className="w-[3px] h-[4px] bg-slate-400 rounded-full"></span>
            <span className="w-[3px] h-[4px] bg-slate-400 rounded-full"></span>
            <span className="w-[3px] h-[4px] bg-slate-400 rounded-full"></span>
            <span className="w-[3px] h-[4px] bg-slate-400 rounded-full"></span>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between pt-1">
        {/* Playback rate */}
        <button
          onClick={toggleSpeed}
          className="flex items-center space-x-1 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 transition-all duration-200"
          title="Toggle Speech Speed"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>{playbackRate === 1.0 ? '1.0x (Normal)' : playbackRate === 0.8 ? '0.8x (Slower)' : '1.2x (Faster)'}</span>
        </button>

        {/* Core playback controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={restartAudio}
            className="p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 border border-white/5"
            title="Restart Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-4 bg-farm-gold hover:bg-yellow-500 text-farm-darkBg rounded-full transition-all duration-300 transform hover:scale-105 shadow-md shadow-farm-gold/15"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 border border-white/5"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Empty space for alignment */}
        <div className="w-20 hidden md:block"></div>
      </div>
    </div>
  );
}
