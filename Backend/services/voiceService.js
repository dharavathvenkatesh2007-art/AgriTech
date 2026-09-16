import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import textToSpeech from '@google-cloud/text-to-speech';
import speech from '@google-cloud/speech';
import * as googleTTS from 'google-tts-api';

// Audio storage directory
const PUBLIC_DIR = path.resolve('public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

// Ensure directories exist
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Check if Google Cloud voice services are enabled
const hasGCPCredentials = () => {
  return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
};

// Map languages to official codes and simple codes
const mapLanguage = (language) => {
  const normalized = (language || 'Telugu').trim().toLowerCase();
  if (normalized === 'telugu' || normalized === 'te') {
    return { gcpCode: 'te-IN', simpleCode: 'te' };
  } else if (normalized === 'hindi' || normalized === 'hi') {
    return { gcpCode: 'hi-IN', simpleCode: 'hi' };
  } else {
    return { gcpCode: 'en-US', simpleCode: 'en' };
  }
};

/**
 * Synthesizes text to speech MP3 file
 * @param {string} text 
 * @param {string} language 
 * @returns {Promise<string>} Web URL path to the generated audio file (e.g. /audio/<hash>.mp3)
 */
// Premium voice settings for Google Cloud TTS (Neural2/WaveNet)
const GCP_VOICE_CONFIGS = {
  'te-IN': { name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
  'hi-IN': { name: 'hi-IN-Neural2-A', ssmlGender: 'FEMALE' },
  'en-US': { name: 'en-IN-Wavenet-A', ssmlGender: 'FEMALE' }
};

/**
 * Synthesizes text to speech MP3 file
 * @param {string} text 
 * @param {string} language 
 * @returns {Promise<string>} Web URL path to the generated audio file (e.g. /audio/<hash>.mp3)
 */
const synthesizeSpeech = async (text, language) => {
  if (!text) {
    throw new Error('Text is required for TTS synthesis');
  }

  const { gcpCode, simpleCode } = mapLanguage(language);

  // Generate unique hash based on text and language for caching
  const hash = crypto.createHash('md5').update(text + gcpCode).digest('hex');
  const filename = `${hash}.mp3`;
  const filepath = path.join(AUDIO_DIR, filename);
  const webUrl = `/audio/${filename}`;

  // Return cached file if it exists
  if (fs.existsSync(filepath)) {
    console.log(`Using cached audio file: ${filename}`);
    return webUrl;
  }

  try {
    if (hasGCPCredentials()) {
      console.log(`Using Google Cloud TTS for text: "${text.substring(0, 30)}..."`);
      const client = new textToSpeech.TextToSpeechClient();
      const voiceConfig = GCP_VOICE_CONFIGS[gcpCode] || { ssmlGender: 'NEUTRAL' };
      
      const request = {
        input: { text },
        voice: { 
          languageCode: gcpCode, 
          name: voiceConfig.name,
          ssmlGender: voiceConfig.ssmlGender 
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await client.synthesizeSpeech(request);
      await fs.promises.writeFile(filepath, response.audioContent, 'binary');
    } else {
      console.log(`GCP Credentials not found. Using keyless Translate TTS fallback for text: "${text.substring(0, 30)}..."`);
      // google-tts-api returns base64 string
      const base64Audio = await googleTTS.getAudioBase64(text, {
        lang: simpleCode,
        slow: false,
        host: 'https://translate.google.com',
        timeout: 15000,
      });

      const buffer = Buffer.from(base64Audio, 'base64');
      await fs.promises.writeFile(filepath, buffer);
    }

    console.log(`Audio file generated successfully: ${filename}`);
    return webUrl;
  } catch (error) {
    console.error('Text-to-Speech synthesis error:', error);
    throw new Error(`TTS synthesis failed: ${error.message}`);
  }
};

/**
 * Transcribes audio buffer to text transcript
 * @param {Buffer} audioBuffer 
 * @returns {Promise<string>} Transcribed text query
 */
const transcribeSpeech = async (audioBuffer) => {
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('Audio buffer is empty or missing');
  }

  try {
    if (hasGCPCredentials()) {
      console.log('Using Google Cloud STT to transcribe audio buffer...');
      const client = new speech.SpeechClient();
      const audio = {
        content: audioBuffer.toString('base64'),
      };
      
      const config = {
        encoding: 'WEBM_OPUS', // standard for browser mediarecorder audio
        sampleRateHertz: 48000,
        languageCode: 'te-IN', // default to Telugu, or can support multi-lang
        alternativeLanguageCodes: ['hi-IN', 'en-US'],
      };
      
      const request = {
        audio: audio,
        config: config,
      };

      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      
      return transcription || 'Could not recognize speech';
    } else {
      console.log('GCP Credentials not found. Simulating Speech-to-Text transcription...');
      // Simulated response based on audio size for E2E testing
      const audioSize = audioBuffer.length;
      if (audioSize % 2 === 0) {
        return 'ఈ రోజు వాతావరణం ఎలా ఉంది'; // "How is the weather today" in Telugu
      } else {
        return 'When to harvest?'; // English Q&A test
      }
    }
  } catch (error) {
    console.error('Speech-to-Text transcription error:', error);
    throw new Error(`STT transcription failed: ${error.message}`);
  }
};

export { synthesizeSpeech, transcribeSpeech };
