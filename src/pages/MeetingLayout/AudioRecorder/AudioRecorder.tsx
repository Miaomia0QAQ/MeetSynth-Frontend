import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './AudioRecorder.css';

interface AudioState {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

const AudioRecorder = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformContainerRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#6c63ff',
        progressColor: '#3f3d56',
        cursorColor: '#3f3d56',
        height: 80,
        normalize: true,
        barWidth: 2
      });

      waveSurferRef.current.on('finish', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioState(prev => ({ ...prev, audioBlob: blob }));
        
        const audioURL = URL.createObjectURL(blob);
        waveSurferRef.current?.load(audioURL);
      };

      mediaRecorderRef.current.start();
      setAudioState(prev => ({ ...prev, isRecording: true }));
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setAudioState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const togglePlayback = () => {
    if (audioState.isPlaying) {
      waveSurferRef.current?.pause();
    } else {
      waveSurferRef.current?.play();
    }
    setAudioState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const deleteRecording = () => {
    waveSurferRef.current?.stop();
    setAudioState({
      isRecording: false,
      audioBlob: null,
      duration: 0,
      currentTime: 0,
      isPlaying: false
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder-container">
      <div className="waveform" ref={waveformContainerRef} />
      
      <div className="controls">
        {!audioState.audioBlob ? (
          <button
            className={`record-button ${audioState.isRecording ? 'recording' : ''}`}
            onClick={audioState.isRecording ? stopRecording : startRecording}
          >
            <div className="mic-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
            </div>
          </button>
        ) : (
          <>
            <button className="control-button delete" onClick={deleteRecording}>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
            </button>
            <button className="control-button play" onClick={togglePlayback}>
              {audioState.isPlaying ? (
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,19H18V5H14V19M6,19H10V5H6V19Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;