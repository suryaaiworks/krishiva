(function () {
    if (window.__ViraScriptRunning) {
        console.log("[Vira] Script already running. Skipping duplicate init.");
        return;
    }
    window.__ViraScriptRunning = true;

    const script = document.currentScript;
    const userId   = script?.dataset?.userId  || "demo";
    const apiUrl   = script?.dataset?.apiUrl  || "";

    // Language resolution — always live from localStorage
    const getLang = () => {
        const saved = (typeof localStorage !== "undefined")
            ? localStorage.getItem("krishiva_language") : null;
        return (saved && ["en", "te", "hi"].includes(saved)) ? saved : "te";
    };

    // BCP-47 locale codes for STT / TTS
    const LANG_BCP47 = { en: "en-IN", te: "te-IN", hi: "hi-IN" };

    // UI strings keyed by language
    const UI = {
        title:    { en: "Hello! I'm Vira",          hi: "नमस्ते! मैं वीरा हूँ",         te: "నమస్తే! నేను వీరా" },
        sub:      { en: "Your AI farming companion", hi: "आपकी कृषि सहायक",            te: "మీ వ్యవసాయ సహాయకురాలు" },
        tapMic:   { en: "Tap microphone to speak",   hi: "बोलने के लिए बटन दबाएं",      te: "మాట్లాడటానికి బటన్ నొక్కండి" },
        listening:{ en: "Listening…",               hi: "सुन रही हूँ…",                te: "వింటున్నాను…" },
        speaking: { en: "Vira is speaking…",         hi: "जवाब दे रही हूँ…",            te: "సమాధానం ఇస్తోంది…" },
        you:      { en: "You: ",  hi: "आप: ",  te: "మీరు: " },
        noVoice:  { en: "Voice unavailable. Displaying text response.",
                    hi: "आवाज उपलब्ध नहीं। टेक्स्ट प्रतिक्रिया दिखाई जा रही है।",
                    te: "వాయిస్ అందుబాటులో లేదు. టెక్స్ట్ ప్రతిస్పందన చూపుతోంది." },
        offline:  { en: "Internet is unavailable. I cannot reach the server right now.",
                    hi: "इंटरनेट उपलब्ध नहीं है। मैं अभी सर्वर तक पहुँच नहीं सकती।",
                    te: "ఇంటర్నెట్ లేదు. నేను ప్రస్తుతం సర్వర్‌ను యాక్సెస్ చేయలేను." },
        greeting: { en: "Hello! I am Vira, your AI farming assistant. How can I help you today?",
                    hi: "नमस्ते! मैं वीरा हूँ, आपकी कृषि सहायक। आज मैं आपकी क्या मदद कर सकती हूँ?",
                    te: "నమస్తే! నేను వీరా, మీ వ్యవసాయ సహాయకురాలిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?" },
        netError: { en: "Server connection issue. Please check your network.",
                    hi: "सर्वर से कनेक्शन नहीं हो सका। कृपया नेटवर्क जाँचें।",
                    te: "సర్వర్ కనెక్షన్ సమస్య. దయచేసి నెట్‌వర్క్ తనిఖీ చేయండి." },
        thinking: [
            { en: "Vira is thinking…",   hi: "सोच रही हूँ…",          te: "ఆలోచిస్తోంది…"           },
            { en: "Retrieving records…", hi: "जानकारी जुटा रही हूँ…",  te: "సమాచారం సేకరిస్తోంది…"  },
            { en: "Analysing context…",  hi: "विवरण जाँच रही हूँ…",    te: "వివరాలు విశ్లేషిస్తోంది…" }
        ]
    };
    const u = (key, lang) => {
        const obj = UI[key];
        if (!obj) return "";
        if (Array.isArray(obj)) return obj.map(o => o[lang] || o.en);
        return obj[lang] || obj.en;
    };

    // State
    let assistantConfig = null;
    let sessionHistory  = [];
    let currentState    = "idle";
    let hasGreeted      = false;

    // Load CSS
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "/vira.css";
    document.head.appendChild(link);

    // Widget HTML
    const popup = document.createElement("div");
    popup.className = "vira-popup theme-earth state-idle";
    popup.innerHTML = `
      <div class="vira-overlay"></div>
      <div class="vira-content">
        <div class="vira-top">
          <div class="vira-orb-wrap">
            <div class="vira-orb-glow"></div>
            <div class="vira-orb"></div>
          </div>
          <h2 class="vira-title"></h2>
          <p  class="vira-sub"></p>
          <div class="vira-status"></div>
          <div class="vira-wave">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
          <div class="vira-thinking-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="vira-user-text"></div>
          <div class="vira-ai-text"></div>
        </div>
        <div class="vira-bottom">
          <button class="vira-mic">
            <img src="/mic.svg" alt="mic" class="vira-mic-icon"/>
          </button>
        </div>
      </div>`;
    document.body.appendChild(popup);

    // Launcher button
    const button = document.createElement("button");
    button.className = "vira-btn theme-earth";
    
    // Custom leaf/wheat SVG + sparkle inline
    button.innerHTML = `
      <svg class="vira-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1.5 4-2 5.5-3.1 11.2A7 7 0 0 1 11 20z" fill="rgba(255,255,255,0.18)"></path>
        <path d="M9 22L11 20"></path>
        <path d="M11 20c2.5-2.5 5-3.5 7-7"></path>
      </svg>
      <span style="position: absolute; top: 4px; right: 4px; display: block; width: 14px; height: 14px; background: #fbbf24; border-radius: 50%; border: 1.5px solid #16a34a; box-shadow: 0 1px 3px rgba(0,0,0,0.15); animation: viraPulse 1.8s infinite ease-in-out;"></span>
    `;
    document.body.appendChild(button);

    // Periodic ambient pulse class trigger
    setInterval(() => {
        button.classList.add("vira-pulse");
        setTimeout(() => {
            button.classList.remove("vira-pulse");
        }, 2200);
    }, 4500);


    // DOM refs
    const domTitle  = popup.querySelector(".vira-title");
    const domSub    = popup.querySelector(".vira-sub");
    const domStatus = popup.querySelector(".vira-status");
    const domWave   = popup.querySelector(".vira-wave");
    const domUser   = popup.querySelector(".vira-user-text");
    const domAi     = popup.querySelector(".vira-ai-text");
    const domMic    = popup.querySelector(".vira-mic");

    // State machine
    const setState = (state) => {
        currentState = state;
        popup.className = popup.className.replace(/state-\w+/g, "").trim() + ` state-${state}`;
    };

    // Refresh UI labels to current language
    const applyLang = () => {
        const lang = getLang();
        domTitle.textContent  = u("title",  lang);
        domSub.textContent    = u("sub",    lang);
        if (currentState === "idle") domStatus.textContent = u("tapMic", lang);
    };

    // Apply config from backend (theme, etc.)
    const applyConfig = () => {
        if (!assistantConfig) return;
        const theme = assistantConfig.theme || "earth";
        popup.className  = popup.className.replace(/theme-\w+/, "").trim() + ` theme-${theme}`;
        button.className = button.className.replace(/theme-\w+/, "").trim() + ` theme-${theme}`;
        applyLang();
    };

    const loadAssistant = async () => {
        try {
            const token   = localStorage.getItem("krishiva_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res  = await fetch(`${apiUrl}/assistant/config/${userId}`, { headers });
            const data = await res.json();
            if (data?.user) { assistantConfig = data.user; applyConfig(); }
        } catch {
            assistantConfig = { assistantName: "Vira", theme: "earth" };
            applyConfig();
        }
    };

    applyLang();
    loadAssistant();

    // ───────────────────────────── TTS ───────────────────────────────────────
    // text arrives ALREADY translated by the backend — just speak it
    const speak = (text) => {
        if (!window.speechSynthesis) {
            domStatus.textContent = u("noVoice", getLang());
            domAi.textContent     = text;
            console.warn("[Vira TTS] speechSynthesis not available.");
            return;
        }

        const lang = getLang();
        const bcp  = LANG_BCP47[lang] || "en-IN";

        console.log(`[Vira TTS] lang=${lang} bcp47=${bcp} text="${text.substring(0,80)}…"`);

        try { window.speechSynthesis.cancel(); } catch (_) {}

        domAi.textContent     = text;
        domStatus.textContent = u("speaking", lang);
        setState("speaking");

        const utter    = new SpeechSynthesisUtterance(text);
        utter.lang     = bcp;
        utter.rate     = 0.92;
        utter.pitch    = 1.0;

        utter.onstart = () => console.log(`[Vira TTS] Speaking (${utter.lang}): "${utter.text.substring(0,50)}"`);

        utter.onend = () => {
            console.log("[Vira TTS] Done.");
            setState("idle");
            domStatus.textContent = u("tapMic", getLang());
            domWave.classList.remove("active");
        };

        utter.onerror = (ev) => {
            console.error("[Vira TTS] Error:", ev.error);
            setState("idle");
            if (ev.error !== "interrupted") {
                domStatus.textContent = u("noVoice", getLang());
                setTimeout(() => { domStatus.textContent = u("tapMic", getLang()); }, 3500);
            }
        };

        const pickVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log(`[Vira TTS] ${voices.length} voices available.`);

            if (voices.length === 0) return; // wait for voiceschanged

            // Voice priority: exact BCP-47 → lang prefix → en-IN → en-* → first
            let voice =
                voices.find(v => v.lang.toLowerCase() === bcp.toLowerCase()) ||
                voices.find(v => v.lang.toLowerCase().startsWith(lang + "-")) ||
                voices.find(v => v.lang.toLowerCase().startsWith(lang)) ||
                voices.find(v => v.lang.toLowerCase() === "en-in") ||
                voices.find(v => v.lang.toLowerCase().startsWith("en-")) ||
                voices[0];

            if (voice) {
                utter.voice = voice;
                utter.lang  = voice.lang;
                console.log(`[Vira TTS] Selected voice: "${voice.name}" (${voice.lang})`);
            } else {
                console.warn(`[Vira TTS] No suitable voice for ${bcp}. Using lang attr only.`);
            }

            try {
                window.speechSynthesis.speak(utter);
            } catch (err) {
                console.error("[Vira TTS] speak() threw:", err);
                domStatus.textContent = u("noVoice", getLang());
                setState("idle");
            }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            pickVoiceAndSpeak();
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.onvoiceschanged = null;
                pickVoiceAndSpeak();
            };
            // Chrome sometimes fires voiceschanged before we hook it
            setTimeout(() => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    window.speechSynthesis.onvoiceschanged = null;
                    pickVoiceAndSpeak();
                }
            }, 300);
        }

        window.dispatchEvent(new CustomEvent("vira-action", {
            detail: { action: "speak", response: text,
                      pipeline: { language: lang, bcp47: bcp, selectedTool: "speechSynthesis" } }
        }));
    };

    // ─── Greeting ─────────────────────────────────────────────────────────────
    const doGreet = () => {
        if (hasGreeted) return;
        hasGreeted = true;
        document.removeEventListener("click",   doGreet);
        document.removeEventListener("keydown", doGreet);
        applyLang();
        const lang = getLang();
        console.log(`[Vira] Greeting in ${lang}`);
        speak(u("greeting", lang));
    };

    // ─── Launcher toggle ──────────────────────────────────────────────────────
    let popupOpen = false;
    button.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        popupOpen = !popupOpen;
        popup.style.display = popupOpen ? "flex" : "none";
        if (popupOpen) {
            applyLang();
            if (!hasGreeted) {
                const lang = getLang();
                domAi.textContent     = u("greeting", lang);
                domStatus.textContent = u("speaking", lang);
                setState("speaking");
                // Try immediate speech; also listen for next gesture in case autoplay is blocked
                doGreet();
                document.addEventListener("click",   doGreet, { once: true });
                document.addEventListener("keydown", doGreet, { once: true });
            }
        }
    };

    // ─── STT + Backend call ───────────────────────────────────────────────────
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        domStatus.textContent = "Voice input is not supported in this browser.";
    } else {
        const recognition          = new SpeechRecognition();
        recognition.continuous     = false;
        recognition.interimResults = false;

        domMic.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();

            try { window.speechSynthesis.cancel(); } catch (_) {}

            const lang = getLang();
            applyLang();

            if (!navigator.onLine) {
                setState("offline");
                speak(u("offline", lang));
                return;
            }

            recognition.lang = LANG_BCP47[lang] || "en-IN";
            setState("listening");
            domStatus.textContent = u("listening", lang);
            domWave.classList.add("active");
            domUser.textContent = "";
            domAi.textContent   = "";

            console.log(`[Vira STT] Starting. lang=${recognition.lang}`);
            try { recognition.start(); } catch (err) {
                console.warn("[Vira STT] Start error (may already be running):", err);
            }
        };

        recognition.onresult = async (e) => {
            const transcript = e.results[0][0].transcript;
            console.log(`[Vira STT] Transcript: "${transcript}"`);

            const lang = getLang();
            domUser.textContent = u("you", lang) + transcript;
            recognition.stop();
            setState("thinking");

            let cycle = 0;
            const thinkMsgs = u("thinking", lang);
            const timer = setInterval(() => {
                if (currentState === "thinking") {
                    domStatus.textContent = thinkMsgs[cycle % thinkMsgs.length];
                    cycle++;
                } else { clearInterval(timer); }
            }, 650);

            window.dispatchEvent(new CustomEvent("vira-action", {
                detail: { action: "stt", response: transcript,
                          pipeline: { language: lang, intent: "speech_to_text" } }
            }));

            // ── API request ──────────────────────────────────────────────────
            const token   = localStorage.getItem("krishiva_token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            // CRITICAL: merge farmer context and override language from localStorage
            // This tells the backend which language to translate the response into.
            const farmerCtx = Object.assign({}, window.KrishivaFarmer || {}, { language: lang });

            console.log(`[Vira API] POST /assistant/ask — farmer.language="${farmerCtx.language}"`);

            let res;
            try {
                res = await fetch(`${apiUrl}/assistant/ask`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        message:      transcript,
                        history:      sessionHistory,
                        farmer:       farmerCtx,
                        geminiApiKey: localStorage.getItem("krishiva_gemini_api_key") || ""
                    })
                });
            } catch (netErr) {
                clearInterval(timer);
                console.error("[Vira API] Network error:", netErr);
                setState("error");
                speak(u("netError", getLang()));
                return;
            }

            clearInterval(timer);

            let bodyText = "";
            try { bodyText = await res.text(); } catch (_) {}

            if (!res.ok) {
                setState("error");
                let detail = "Server returned an error.";
                try { detail = JSON.parse(bodyText).detail || detail; } catch (_) {}
                speak(detail);
                return;
            }

            let data = {};
            try { data = JSON.parse(bodyText); } catch (_) {
                setState("error");
                speak("Server returned an invalid response format.");
                return;
            }

            if (data.success) {
                // data.speech is ALREADY translated by the backend into farmer.language
                const responseText = data.speech || data.aiResponse || "";
                console.log(`[Vira API] Response (${lang}): "${responseText.substring(0,80)}"`);

                speak(responseText);

                sessionHistory.push({ role: "user",  text: transcript   });
                sessionHistory.push({ role: "model", text: responseText });
                if (sessionHistory.length > 10) sessionHistory.shift();

                window.dispatchEvent(new CustomEvent("vira-action", {
                    detail: { action: data.action, page: data.page,
                              response: responseText, pipeline: data.pipeline }
                }));

                if (data.route) {
                    window.dispatchEvent(new CustomEvent("vira-action", {
                        detail: { action: "navigate", page: data.route.replace(/^\//, "") }
                    }));
                }
            } else {
                setState("error");
                speak(data.reasoning || data.speech || "I encountered an issue. Please try again.");
            }
        };

        recognition.onerror = (ev) => {
            console.error("[Vira STT] Error:", ev.error);
            setState("idle");
            domStatus.textContent = u("tapMic", getLang());
            domWave.classList.remove("active");
        };
    }
})();
