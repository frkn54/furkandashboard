# Voice-to-Text Visual Description Feature

## Overview
The Product Upload Page now includes advanced voice-to-text functionality that allows users to describe their desired photos and videos using both text input and voice recording.

## Important Clarification: No Product Creation Limits

**There are NO limits on:**
- Creating products
- Uploading product images
- Number of products you can manage
- Number of times you can generate content

**The ONLY limitation is:**
- The number of visuals/videos generated from a SINGLE IMAGE in ONE BATCH
- This is controlled by the "Görsel Sayısı" (Visual Numbers) and "Video Sayısı" (Video Numbers) selectors
- You can select 1-10 images or 1-3 videos per generation batch
- You can generate content as many times as you want for each product
- There are no daily limits or restrictions on product creation

## Features Implemented

### 1. **Photo Visual Description Section**
Located in the image generation area, this section provides:

- **Text Area Input**: Large text field for typing detailed descriptions
  - Placeholder text with examples of what to describe (style, mood, colors, subjects, composition)
  - Full editing capabilities

- **Voice Recording Button**: Microphone icon button positioned at the top-right of the text area
  - **Start Recording**: Click to begin voice recording
  - **Real-time Transcription**: Speech is automatically converted to text as you speak
  - **Stop Recording**: Click again to stop recording
  - **Audio Playback**: Review your recorded audio
  - **Retry Option**: Re-record if needed

### 2. **Video Description Section**
Available in both Promotional and Story video types:

- **Promotional Videos**:
  - Voice input for describing product showcase requirements
  - Examples: "Show product features in dynamic 15-second format"

- **Story Videos**:
  - Voice input for narrative descriptions
  - Examples: "Tell an inspirational story about customer transformation"

### 3. **Visual Indicators**

#### Recording Status
- **Not Recording**: Purple/Red microphone button (depending on context)
- **Recording**: Pulsing red microphone-off button with animated recording indicator
- **Processing**: Status text shows "Recording and converting to text..."
- **Completed**: Green checkmark with success message

#### Available Actions
- **Mic Button**: Start/Stop recording
- **Volume Button**: Play recorded audio
- **Refresh Button**: Retry recording (clears current text and audio)

## How to Use

### Text Input Method
1. Navigate to the Product Upload page
2. Scroll to "Görsel Oluşturma" (Image Generation) section
3. Find the "Görsel Açıklaması" (Visual Description) field
4. Type your description directly into the text area
5. Include details about style, mood, colors, subjects, and composition

### Voice Recording Method
1. Click the microphone button (top-right of text area)
2. Allow microphone permissions if prompted
3. Speak your description clearly in Turkish
4. The text will appear in real-time as you speak
5. Click the red microphone-off button to stop recording
6. Review the transcribed text and edit if needed
7. Optional: Click the volume button to play back your recording
8. Optional: Click refresh to re-record

## Technical Implementation

### Speech Recognition
- Uses Web Speech API (SpeechRecognition)
- Language set to Turkish (tr-TR)
- Continuous recognition for uninterrupted speaking
- Interim results for real-time feedback

### Audio Recording
- MediaRecorder API for audio capture
- Audio stored as WebM format
- Playback functionality via HTML5 Audio API
- Audio URL management with URL.createObjectURL

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Partial support (may require flags)
- Safari: Limited support
- Mobile browsers: Works on supported devices

### Error Handling
- Microphone permission denial alerts
- Speech recognition error messages
- Graceful fallback to text-only input

## Example Usage Scenarios

### Photo Description Examples
**Text Input:**
```
Modern ve minimal stil, parlak renkler, ürün merkezli, beyaz arka plan,
profesyonel aydınlatma, yukarıdan çekilmiş görünüm
```

**Voice Input:**
*Speak naturally:* "Lütfen modern ve minimal bir stil kullanın. Parlak renkler
olsun. Ürün merkezde olacak şekilde beyaz arka plan üzerinde. Profesyonel
aydınlatma ve yukarıdan çekilmiş görünüm istiyorum."

### Video Description Examples
**Promotional Video:**
```
Ürünün özelliklerini vurgulayan dinamik bir video, hızlı geçişler,
enerjik müzik, 30 saniye sürecek
```

**Story Video:**
```
Ürünün müşteri hayatındaki dönüşümü, duygusal bağlantı, ilham verici
müzik, günlük hayattan sahneler
```

## Best Practices

1. **Speak Clearly**: Enunciate words for better transcription accuracy
2. **Pause Between Sentences**: Helps with punctuation and clarity
3. **Review and Edit**: Always check transcribed text for accuracy
4. **Use Descriptive Language**: Be specific about what you want
5. **Save Audio**: Use playback to verify your recording before proceeding

## Accessibility Features

- Keyboard navigation support
- Clear visual feedback for all states
- Alternative text input always available
- Audio playback for verification
- Retry functionality for corrections

## Future Enhancements

Potential improvements for future versions:
- Multi-language support (English, German, etc.)
- Offline speech recognition
- Audio file upload option
- Voice command shortcuts
- AI-powered description suggestions based on voice input
- Real-time translation
- Custom vocabulary for industry-specific terms

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure microphone is connected and working
- Try a different browser
- Check system audio settings

### Transcription Inaccurate
- Speak more clearly
- Reduce background noise
- Check microphone quality
- Use text editing to correct errors

### Browser Not Supported
- Use Chrome or Edge for best experience
- Update browser to latest version
- Fall back to text-only input

## Privacy & Security

- Voice recordings are processed locally in the browser
- Audio data is not sent to external servers
- Users can delete recordings at any time
- No permanent storage of voice data
- Transcribed text can be edited or cleared before submission
