import { useState } from 'react';
import './App.css'
import MeetingLayout from './pages/MeetingLayout/MeetingLayout'
import SpeechRecognition from './test/SpeechRecognition/SpeechRecognition'

function App() {
  const [transcript, setTranscript] = useState('');

  return (
    <div>
      <h1>语音识别演示</h1>
      <SpeechRecognition onResult={(text) => setTranscript(text)} />
      <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 10 }}>
        <h3>识别结果：</h3>
        {transcript || '等待语音输入...'}
      </div>
    </div>
  );

}

export default App
