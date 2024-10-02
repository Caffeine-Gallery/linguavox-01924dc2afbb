import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const speakBtn = document.getElementById('speakBtn');

const API_URL = 'https://libretranslate.de/translate';

async function translateText() {
    const text = inputText.value;
    const target = targetLanguage.value;

    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        const translation = data.translatedText;
        outputText.textContent = translation;

        // Save the translation to the backend
        await backend.saveTranslation(translation);
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation failed. Please try again.';
    }
}

function speakText() {
    const text = outputText.textContent;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage.value;
    speechSynthesis.speak(utterance);
}

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakText);

// Load the last translation from the backend
async function loadLastTranslation() {
    try {
        const lastTranslation = await backend.getLastTranslation();
        if (lastTranslation) {
            outputText.textContent = lastTranslation;
        }
    } catch (error) {
        console.error('Error loading last translation:', error);
    }
}

loadLastTranslation();
