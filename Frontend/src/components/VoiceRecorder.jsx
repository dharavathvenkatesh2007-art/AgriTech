import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VoiceRecorder({ onTranscript, placeholder = "Speak..." }) {
  const { token, API_BASE } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToSTT(audioBlob);
        
        // Stop all audio track streams to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToSTT = async (audioBlob) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_query.webm');

      const response = await fetch(`${API_BASE}/voice/stt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Speech recognition failed');
      }

      if (data.transcript) {
        onTranscript(data.transcript);
      } else {
        setError('No speech recognized. Please speak again.');
      }
    } catch (err) {
      console.error('STT API error:', err);
      setError('Failed to transcribe speech. Please try typing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <div className="flex items-center space-x-3 w-full max-w-md bg-farm-darkCard p-2 rounded-2xl border border-farm-green/10 shadow-inner">
        <div className="flex-1 px-3 text-sm text-slate-400 truncate italic">
          {isRecording ? "Listening..." : loading ? "Transcribing..." : placeholder}
        </div>
        
        {loading ? (
          <button 
            disabled 
            className="p-3 bg-farm-green/10 text-farm-gold rounded-full"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 shadow-lg shadow-red-600/30 animate-pulse"
            title="Stop Recording"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="p-3 bg-farm-green hover:bg-farm-green-dark text-white rounded-full transition-all duration-300 hover:scale-105 shadow-md shadow-farm-green/20"
            title="Speak"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {error && (
        <span className="text-xs text-red-400 px-2 text-center bg-red-500/10 py-1 rounded-lg border border-red-500/20">
          {error}
        </span>
      )}
    </div>
  );
}
