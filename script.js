// 🌍 MANY LANGUAGES
const languages = {
"en":"English",
"hi":"Hindi",
"kn":"Kannada",
"ta":"Tamil",
"te":"Telugu",
"ml":"Malayalam",
"mr":"Marathi",
"bn":"Bengali",
"gu":"Gujarati",
"pa":"Punjabi",
"ur":"Urdu",
"fr":"French",
"es":"Spanish",
"de":"German",
"it":"Italian",
"ja":"Japanese",
"ko":"Korean",
"zh":"Chinese",
"ar":"Arabic",
"ru":"Russian"
};

// Language codes for speech recognition
const speechRecognitionLang = {
"en": "en-US",
"hi": "hi-IN",
"kn": "kn-IN",
"ta": "ta-IN",
"te": "te-IN",
"ml": "ml-IN",
"mr": "mr-IN",
"bn": "bn-IN",
"gu": "gu-IN",
"pa": "pa-IN",
"ur": "ur-PK",
"fr": "fr-FR",
"es": "es-ES",
"de": "de-DE",
"it": "it-IT",
"ja": "ja-JP",
"ko": "ko-KR",
"zh": "zh-CN",
"ar": "ar-SA",
"ru": "ru-RU"
};

// populate datalist
const list = document.getElementById("languages");

for(let code in languages){
    let option = document.createElement("option");
    option.value = code;
    option.textContent = languages[code];
    list.appendChild(option);
}

// Set default values
document.getElementById("fromLang").value = "en";
document.getElementById("toLang").value = "hi";

// 🎤 BUTTON
const btn = document.getElementById("speakBtn");
let isListening = false;

btn.addEventListener("click", () => {
    if(isListening) return;
    
    let fromLang = document.getElementById("fromLang").value.trim();
    let toLang = document.getElementById("toLang").value.trim();
    
    if(!languages[fromLang]) {
        alert("Please select a valid source language");
        return;
    }
    if(!languages[toLang]) {
        alert("Please select a valid target language");
        return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.lang = speechRecognitionLang[fromLang] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    document.getElementById("output").innerText = "Listening...";
    document.getElementById("emotion").innerText = "Detecting...";
    document.getElementById("translated").innerText = "Translating...";
    
    recognition.start();
    isListening = true;
    
    recognition.onresult = function(event){
        const text = event.results[0][0].transcript;
        document.getElementById("output").innerText = text;
        
        const emotion = detectEmotion(text);
        document.getElementById("emotion").innerText = emotion;
        
        translate(text, fromLang, toLang);
        isListening = false;
    };
    
    recognition.onerror = function(e){
        console.log("Error:", e.error);
        let errorMsg = "Speak again";
        if(e.error === "no-speech") errorMsg = "No speech detected. Please try again.";
        if(e.error === "not-allowed") errorMsg = "Microphone access denied.";
        document.getElementById("output").innerText = errorMsg;
        isListening = false;
    };
    
    recognition.onend = function() {
        isListening = false;
    };
});

// 😊 ENHANCED EMOTION FUNCTION
function detectEmotion(text){
    text = text.toLowerCase();
    
    // 😊 Happy emotions
    const happyWords = ["happy", "glad", "great", "love", "awesome", "wonderful", "excellent", "amazing", 
                        "fantastic", "beautiful", "good", "nice", "enjoy", "fun", "celebration", "joy", 
                        "excited", "smile", "laugh", "perfect", "brilliant", "delighted", "pleased"];
    
    // 😢 Sad emotions
    const sadWords = ["sad", "tired", "alone", "miss", "depressed", "unhappy", "cry", "crying", "tears", 
                      "lonely", "hurt", "pain", "sorrow", "grief", "miserable", "heartbroken", "down", 
                      "upset", "disappointed", "regret"];
    
    // 😡 Angry emotions
    const angryWords = ["angry", "hate", "annoyed", "mad", "furious", "rage", "irritated", "frustrated", 
                        "upset", "aggressive", "hostile", "bitter", "resent", "disgust", "outrage"];
    
    // 😨 Fearful emotions
    const fearWords = ["scared", "afraid", "fear", "terrified", "nervous", "anxious", "worried", "panic", 
                       "horror", "frightened", "alarmed", "dread", "uneasy", "threatened"];
    
    // 😲 Surprised emotions
    const surpriseWords = ["surprised", "shocked", "astonished", "amazed", "stunned", "unexpected", "wow", 
                           "whoa", "incredible", "unbelievable", "startled", "dumbfounded"];
    
    // 🥰 Affectionate emotions
    const affectionateWords = ["love", "like", "care", "affection", "fond", "adore", "cherish", "treasure", 
                               "sweet", "kind", "gentle", "warm", "hug", "kiss", "romantic"];
    
    // 🤔 Confused emotions
    const confusedWords = ["confused", "lost", "unsure", "uncertain", "puzzled", "perplexed", "baffled", 
                           "bewildered", "doubt", "mixed", "unclear"];
    
    // Count matches
    let happyCount = 0, sadCount = 0, angryCount = 0, fearCount = 0, surpriseCount = 0, affectionCount = 0, confusedCount = 0;
    
    happyWords.forEach(word => { if(text.includes(word)) happyCount++; });
    sadWords.forEach(word => { if(text.includes(word)) sadCount++; });
    angryWords.forEach(word => { if(text.includes(word)) angryCount++; });
    fearWords.forEach(word => { if(text.includes(word)) fearCount++; });
    surpriseWords.forEach(word => { if(text.includes(word)) surpriseCount++; });
    affectionateWords.forEach(word => { if(text.includes(word)) affectionCount++; });
    confusedWords.forEach(word => { if(text.includes(word)) confusedCount++; });
    
    // Determine the strongest emotion
    const emotions = [
        { name: "😊 Happy", count: happyCount },
        { name: "😢 Sad", count: sadCount },
        { name: "😡 Angry", count: angryCount },
        { name: "😨 Fearful", count: fearCount },
        { name: "😲 Surprised", count: surpriseCount },
        { name: "🥰 Loving", count: affectionCount },
        { name: "🤔 Confused", count: confusedCount }
    ];
    
    // Find the emotion with highest count
    let strongestEmotion = emotions.reduce((prev, current) => (prev.count > current.count) ? prev : current);
    
    // If no emotion words found, check for neutral/common phrases
    if(strongestEmotion.count === 0) {
        // Check for greetings (neutral)
        const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste"];
        if(greetings.some(greeting => text.includes(greeting))) {
            return "😐 Neutral (Greeting)";
        }
        
        // Check for questions (curious)
        if(text.includes("?") || text.includes("what") || text.includes("why") || text.includes("how") || text.includes("where")) {
            return "🤔 Curious";
        }
        
        return "😐 Neutral";
    }
    
    // Add intensity indicator for strong emotions
    if(strongestEmotion.count >= 2) {
        return strongestEmotion.name + " 🔥";
    }
    
    return strongestEmotion.name;
}

// 🌐 TRANSLATION - WORKING VERSION
async function translate(text, from, to) {
    // Common phrase translations (fallback)
    const commonPhrases = {
        "how are you": {
            "hi": "आप कैसे हैं",
            "kn": "ನೀವು ಹೇಗಿದ್ದೀರಾ",
            "ta": "நீங்கள் எப்படி இருக்கிறீர்கள்",
            "te": "మీరు ఎలా ఉన్నారు",
            "ml": "നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്",
            "mr": "तू कसा आहेस",
            "bn": "আপনি কেমন আছেন",
            "gu": "તમે કેમ છો",
            "pa": "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ",
            "es": "¿Cómo estás?",
            "fr": "Comment allez-vous?",
            "de": "Wie geht es dir?",
            "it": "Come stai?"
        },
        "good morning": {
            "hi": "सुप्रभात",
            "kn": "ಶುಭೋದಯ",
            "ta": "காலை வணக்கம்",
            "te": "శుభోదయం",
            "ml": "സുപ്രഭാതം",
            "mr": "सुप्रभात",
            "bn": "সুপ্রভাত",
            "gu": "સુપ્રભાત",
            "pa": "ਸ਼ੁਭ ਸਵੇਰ",
            "es": "Buenos días",
            "fr": "Bonjour",
            "de": "Guten Morgen",
            "it": "Buongiorno"
        },
        "thank you": {
            "hi": "धन्यवाद",
            "kn": "ಧನ್ಯವಾದಗಳು",
            "ta": "நன்றி",
            "te": "ధన్యవాదాలు",
            "ml": "നന്ദി",
            "mr": "धन्यवाद",
            "bn": "ধন্যবাদ",
            "gu": "આભાર",
            "pa": "ਧੰਨਵਾਦ",
            "es": "Gracias",
            "fr": "Merci",
            "de": "Danke",
            "it": "Grazie"
        },
        "hello": {
            "hi": "नमस्ते",
            "kn": "ನಮಸ್ಕಾರ",
            "ta": "வணக்கம்",
            "te": "నమస్కారం",
            "ml": "നമസ്കാരം",
            "mr": "नमस्कार",
            "bn": "হ্যালো",
            "gu": "નમસ્તે",
            "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
            "es": "Hola",
            "fr": "Bonjour",
            "de": "Hallo",
            "it": "Ciao"
        },
        "what is your name": {
            "hi": "आपका नाम क्या है",
            "kn": "ನಿಮ್ಮ ಹೆಸರೇನು",
            "ta": "உங்கள் பெயர் என்ன",
            "te": "మీ పేరు ఏమిటి",
            "es": "¿Cómo te llamas?",
            "fr": "Comment t'appelles-tu?"
        },
        "i love you": {
            "hi": "मैं तुमसे प्यार करता हूँ",
            "kn": "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ",
            "ta": "நான் உன்னை காதலிக்கிறேன்",
            "te": "నేను నిన్ను ప్రేమిస్తున్నాను",
            "es": "Te quiero",
            "fr": "Je t'aime",
            "it": "Ti amo"
        }
    };
    
    // Check if we have a common phrase translation
    const lowerText = text.toLowerCase().trim();
    if(commonPhrases[lowerText] && commonPhrases[lowerText][to]) {
        const translated = commonPhrases[lowerText][to];
        document.getElementById("translated").innerText = translated;
        speak(translated, to);
        return;
    }
    
    // Try Google Translate API (unofficial but works)
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if(data && data[0] && data[0][0] && data[0][0][0]) {
            let translated = data[0][0][0];
            document.getElementById("translated").innerText = translated;
            speak(translated, to);
            return;
        }
    } catch(e) {
        console.log("Google Translate error:", e);
    }
    
    // Try MyMemory as last resort
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        const response = await fetch(url);
        const data = await response.json();
        
        let translated = data?.responseData?.translatedText;
        if(translated && translated !== text) {
            translated = translated.replace(/&#39;/g, "'");
            document.getElementById("translated").innerText = translated;
            speak(translated, to);
            return;
        }
    } catch(e) {
        console.log("MyMemory error:", e);
    }
    
    // If all fail
    document.getElementById("translated").innerText = `Could not translate "${text}" to ${languages[to]}. Try a common phrase like "how are you" or "good morning".`;
}

// 🔊 VOICE OUTPUT
function speak(text, lang){
    speechSynthesis.cancel();
    
    setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(text);
        
        const langMap = {
            "en":"en-US", "hi":"hi-IN", "kn":"kn-IN", "ta":"ta-IN",
            "te":"te-IN", "ml":"ml-IN", "mr":"mr-IN", "bn":"bn-IN",
            "gu":"gu-IN", "pa":"pa-IN", "ur":"ur-PK", "fr":"fr-FR",
            "es":"es-ES", "de":"de-DE", "it":"it-IT", "ja":"ja-JP",
            "ko":"ko-KR", "zh":"zh-CN", "ar":"ar-SA", "ru":"ru-RU"
        };
        
        speech.lang = langMap[lang] || "en-US";
        speech.rate = 0.9;
        
        function speakWithVoice() {
            let voices = speechSynthesis.getVoices();
            let selectedVoice = voices.find(v => v.lang === speech.lang);
            if(!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith(lang));
            if(selectedVoice) speech.voice = selectedVoice;
            speechSynthesis.speak(speech);
        }
        
        if(speechSynthesis.getVoices().length > 0) {
            speakWithVoice();
        } else {
            speechSynthesis.onvoiceschanged = speakWithVoice;
        }
    }, 100);
}

console.log("Voice Translator Ready! Try saying: 'how are you', 'good morning', 'thank you', or 'hello'");