(function () {
    if (window.__ViraScriptRunning) {
        console.log("Vira script already executing. Exiting to prevent duplication.");
        return;
    }
    window.__ViraScriptRunning = true;

    const script = document.currentScript;
    const userId = script?.dataset?.userId || "demo";
    const apiUrl = script?.dataset?.apiUrl || "";
    
    let farmerLanguage = "te"; 
    let assistantConfig = null;
    let sessionHistory = []; // In-memory session history
    let currentState = "idle"; // idle | listening | thinking | speaking | error | offline

    // Load Vira CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/vira.css";
    document.head.appendChild(link);

    // Create Widget Markup
    const popup = document.createElement("div");
    popup.className = `vira-popup theme-earth state-idle`;
    popup.innerHTML = `
    <div class="vira-overlay"></div>
    <div class="vira-content">
       <div class="vira-top">
            <div class="vira-orb-wrap">
                <div class="vira-orb-glow"></div>
                <div class="vira-orb"></div>
            </div>
            <h2 class="vira-title">Namaste! I'm Vira</h2>
            <p class="vira-sub">Your AI Farming Companion</p>
            <div class="vira-status">Tap microphone to talk</div>
            <div class="vira-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="vira-thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="vira-user-text"></div>
            <div class="vira-ai-text"></div>
        </div>
        <div class="vira-bottom">
            <button class="vira-mic">
               <img src="/mic.svg" alt="mic" class="vira-mic-icon"/>
            </button>
        </div>
    </div>
    `;
    document.body.appendChild(popup);

    // Floating launcher button
    const button = document.createElement("button");
    button.className = `vira-btn theme-earth`;
    button.innerHTML = `<img src="/logo.png" alt="logo"/>`;
    document.body.appendChild(button);

    let open = false;
    let hasGreetedOnOpen = false;

    // Transition widget states
    const setWidgetState = (state) => {
      currentState = state;
      // Strip old state classes and apply new one
      popup.className = popup.className
        .replace(/state-\w+/g, "")
        .trim() + ` state-${state}`;
    };

    const getWelcomeText = () => {
        if (farmerLanguage === "te") {
            return "నమస్తే! నేను వీరా. మీ వ్యవసాయ సహాయకురాలిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?";
        } else if (farmerLanguage === "hi") {
            return "नमस्ते! मैं वीरा हूँ। मैं आपकी कृषि सहायक हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?";
        } else {
            return "Hello! I'm Vira. I'm your AI farming assistant. How can I help you today?";
        }
    };

    const triggerWelcomeSpeech = () => {
        console.log("triggerWelcomeSpeech triggered. hasGreetedOnOpen:", hasGreetedOnOpen);
        if (hasGreetedOnOpen) return;
        hasGreetedOnOpen = true;

        console.log("Removing document click/keydown interaction listeners.");
        document.removeEventListener("click", triggerWelcomeSpeech);
        document.removeEventListener("keydown", triggerWelcomeSpeech);

        const welcomeText = getWelcomeText();
        console.log("GREETING EXECUTED: ", welcomeText);
        speak(welcomeText);
    };

    button.onclick = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log("Launcher button clicked. Popup open state toggled.");
        open = !open;
        popup.style.display = open ? "flex" : "none";
        
        if (open && !hasGreetedOnOpen) {
            triggerWelcomeSpeech();
        }
    };

    const autoGreet = () => {
        console.log("autoGreet called. hasGreetedOnOpen:", hasGreetedOnOpen);
        if (!hasGreetedOnOpen) {
            open = true;
            popup.style.display = "flex";
            
            const welcomeText = getWelcomeText();
            aiText.innerText = welcomeText;
            setWidgetState("speaking");
            
            if (farmerLanguage === "te") {
              statusText.innerText = "సమాధానం ఇస్తోంది...";
            } else if (farmerLanguage === "hi") {
              statusText.innerText = "जवाब दे रही हूँ...";
            } else {
              statusText.innerText = "Vira Speaking...";
            }

            console.log("Registering document interaction click listeners.");
            document.addEventListener("click", triggerWelcomeSpeech);
            document.addEventListener("keydown", triggerWelcomeSpeech);
        }
    };

    // Load config
    const loadAssistant = async () => {
        try {
            const token = localStorage.getItem("krishiva_token");
            const headers = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const res = await fetch(`${apiUrl}/assistant/config/${userId}`, { headers });
            const data = await res.json();
            if (data && data.user) {
                assistantConfig = data.user;
                applyConfig();
            }
        } catch (error) {
            console.warn("Vira Offline Config Initialized");
            assistantConfig = {
                assistantName: "Vira",
                theme: "earth",
                farmer: { language: "te", location: "Visakhapatnam", name: "Ramesh" }
            };
            applyConfig();
        }
        autoGreet();
    };

    const applyConfig = () => {
        if (!assistantConfig) return;
        const farmer = window.KrishivaFarmer || assistantConfig.farmer || {};
        farmerLanguage = farmer.language || "te";

        popup.className = `vira-popup theme-${assistantConfig.theme || "earth"} state-${currentState}`;
        button.className = `vira-btn theme-${assistantConfig.theme || "earth"}`;

        const title = popup.querySelector(".vira-title");
        if (farmerLanguage === "te") {
          title.innerHTML = "నమస్తే! నేను వీరా";
        } else if (farmerLanguage === "hi") {
          title.innerHTML = "नमस्ते! मैं वीरा हूँ";
        } else {
          title.innerHTML = "Hello! I'm Vira";
        }

        const subTitle = popup.querySelector(".vira-sub");
        if (farmerLanguage === "te") {
          subTitle.innerHTML = "మీ వ్యవసాయ సహాయకురాలిని.";
        } else if (farmerLanguage === "hi") {
          subTitle.innerHTML = "मैं आपकी कृषि सहायक हूँ।";
        } else {
          subTitle.innerHTML = "I'm your AI farming assistant.";
        }
    };

    loadAssistant();

    // DOM selectors
    const statusText = popup.querySelector(".vira-status");
    const wave = popup.querySelector(".vira-wave");
    const userText = popup.querySelector(".vira-user-text");
    const aiText = popup.querySelector(".vira-ai-text");
    const mic = popup.querySelector(".vira-mic");

    // Text to Speech (TTS)
    let retryAttempted = false;

    const speak = (text) => {
        if (!window.speechSynthesis) {
            console.error("[Vira Pipeline Audit] Stage 8 Failed: Speech synthesis not supported.");
            statusText.innerText = "Voice unavailable. Displaying text response.";
            return;
        }

        console.log("[Vira Pipeline Audit] Stage 8: Speech synthesis (TTS) requested. Text:", text);
        
        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            console.warn("speechSynthesis.cancel failed", e);
        }

        aiText.innerText = text;
        setWidgetState("speaking");

        if (farmerLanguage === "te") {
          statusText.innerText = "సమాధానం ఇస్తోంది...";
        } else if (farmerLanguage === "hi") {
          statusText.innerText = "जवाब दे रही हूँ...";
        } else {
          statusText.innerText = "Vira Speaking...";
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; 
        utterance.pitch = 1.0;

        // Callback Event Listeners
        utterance.onstart = (event) => {
            console.log("TTS Event: Speech started successfully.", event);
        };

        utterance.onend = (event) => {
            console.log("TTS Event: Speech finished.", event);
            setWidgetState("idle");
            if (farmerLanguage === "te") {
              statusText.innerText = "మాట్లాడటానికి బటన్ నొక్కండి";
            } else if (farmerLanguage === "hi") {
              statusText.innerText = "बोलने के लिए बटन दबाएं";
            } else {
              statusText.innerText = "Tap microphone to speak";
            }
            wave.classList.remove("active");
        };

        utterance.onerror = (event) => {
            console.error("TTS Event Error: Speech synthesis encountered an error:", event);
            setWidgetState("idle");
            if (event.error !== "interrupted") {
                statusText.innerText = "Voice unavailable. Displaying text response.";
                setTimeout(() => {
                    statusText.innerText = (farmerLanguage === "te" ? "మాట్లాడటానికి బటన్ నొక్కండి" : farmerLanguage === "hi" ? "बोलने के लिए बटन दबाएं" : "Tap microphone to speak");
                }, 3000);
            }
        };

        const configureVoiceAndRun = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log(`TTS System: ${voices.length} voices loaded in browser.`);
            
            if (voices.length === 0 && !retryAttempted) {
                retryAttempted = true;
                console.log("No voices loaded yet. Retrying fetch in 500ms...");
                setTimeout(configureVoiceAndRun, 500);
                return;
            }

            if (voices.length === 0) {
                console.warn("Voices still unavailable after retry. Displaying text.");
                statusText.innerText = "Voice unavailable. Displaying text response.";
                setWidgetState("idle");
                return;
            }

            let targetLang = farmerLanguage === "te" ? "te-IN" : farmerLanguage === "hi" ? "hi-IN" : "en-IN";
            let selectedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLang.toLowerCase()));
            
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(farmerLanguage.toLowerCase()));
            }

            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang.toLowerCase().includes("en-"));
            }

            if (!selectedVoice && voices.length > 0) {
                selectedVoice = voices[0];
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
                console.log(`Setting Utterance voice to: ${selectedVoice.name} (${selectedVoice.lang})`);
            } else {
                utterance.lang = targetLang;
            }

            try {
                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.error("speechSynthesis.speak execution failed:", err);
                statusText.innerText = "Voice unavailable. Displaying text response.";
                setWidgetState("idle");
            }
        };

        // Handle async voice loading
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                configureVoiceAndRun();
                window.speechSynthesis.onvoiceschanged = null;
            };
            setTimeout(() => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    configureVoiceAndRun();
                }
            }, 250);
        } else {
            configureVoiceAndRun();
        }

        // Fire local speaking events for playground logs
        const speakEvent = new CustomEvent("vira-action", {
          detail: {
            action: "speak",
            response: text,
            pipeline: {
              language: farmerLanguage,
              intent: "synthesize_speech",
              selectedTool: "speechSynthesis",
              pluginCalled: "TTS",
              executionTimeMs: 40,
              confidence: 100
            }
          }
        });
        window.dispatchEvent(speakEvent);
    };

    // Speech Recognition (STT)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        mic.onclick = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            console.log("[Vira Pipeline Audit] Stage 1: Microphone triggered.");
            if (currentState === "speaking") {
              try {
                window.speechSynthesis.cancel();
              } catch (err) {}
            }

            applyConfig();

            if (!navigator.onLine) {
              setWidgetState("offline");
              const offlineText = farmerLanguage === "te"
                ? "ఇంటర్నెట్ లేదు. నేను ప్రస్తుతం సమాచారాన్ని సేకరించలేను."
                : farmerLanguage === "hi"
                  ? "इंटरनेट कनेक्शन उपलब्ध नहीं है। मैं जानकारी प्राप्त नहीं कर सकती।"
                  : "Internet is unavailable. I cannot consult the database right now.";
              speak(offlineText);
              return;
            }

            setWidgetState("listening");
            
            if (farmerLanguage === "te") {
              recognition.lang = "te-IN";
              statusText.innerText = "వింటున్నాను...";
            } else if (farmerLanguage === "hi") {
              recognition.lang = "hi-IN";
              statusText.innerText = "सुन रही हूँ...";
            } else {
              recognition.lang = "en-IN";
              statusText.innerText = "Listening...";
            }

            wave.classList.add("active");
            userText.innerText = "";
            aiText.innerText = "";
            
            try {
              recognition.start();
              console.log(`[Vira Pipeline Audit] Speech recognition started. Target Language: ${recognition.lang}`);
            } catch (err) {
              console.warn("STT already running");
            }
        };

        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            console.log(`[Vira Pipeline Audit] Stage 2: Speech recognition complete. Transcript: "${text}"`);
            
            userText.innerText = (farmerLanguage === "te" ? "మీరు: " : farmerLanguage === "hi" ? "आप: " : "You: ") + text;
            recognition.stop();
            setWidgetState("thinking");

            let cycle = 0;
            const progressMsgs = farmerLanguage === "te"
              ? ["ఆలోచిస్తోంది...", "సమాచారం సేకరిస్తోంది...", "వివరాలు విశ్లేషిస్తోంది..."]
              : farmerLanguage === "hi"
                ? ["सोच रही हूँ...", "जानकारी जुटा रही हूँ...", "विवरण जाँच रही हूँ..."]
                : ["Vira is thinking...", "Retrieving records...", "Analyzing context..."];
            
            const timer = setInterval(() => {
              if (currentState === "thinking") {
                statusText.innerText = progressMsgs[cycle % progressMsgs.length];
                cycle++;
              } else {
                clearInterval(timer);
              }
            }, 600);

            // Fire STT log event for the playground
            const sttEvent = new CustomEvent("vira-action", {
              detail: {
                action: "stt",
                response: text,
                pipeline: {
                  language: farmerLanguage,
                  intent: "speech_to_text",
                  selectedTool: "SpeechRecognition",
                  pluginCalled: "STT",
                  executionTimeMs: 150,
                  confidence: 95
                }
              }
            });
            window.dispatchEvent(sttEvent);

            setTimeout(async () => {
                const token = localStorage.getItem("krishiva_token");
                const headers = { "Content-Type": "application/json" };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const url = `${apiUrl}/assistant/ask`;
                const requestBody = {
                    message: text,
                    history: sessionHistory,
                    farmer: window.KrishivaFarmer || assistantConfig?.farmer,
                    geminiApiKey: localStorage.getItem("krishiva_gemini_api_key") || ""
                };

                let res;
                try {
                    res = await fetch(url, {
                        method: "POST",
                        headers,
                        body: JSON.stringify(requestBody)
                    });
                } catch (netErr) {
                    console.error("[Vira Pipeline Audit] Network connection error:", netErr);
                    clearInterval(timer);
                    setWidgetState("error");
                    speak("Server connection issue. Please check network.");
                    return;
                }

                clearInterval(timer);

                let responseBodyText = "";
                try {
                    responseBodyText = await res.text();
                } catch (readErr) {}

                if (!res.ok) {
                    setWidgetState("error");
                    let errDetail = "Server returned an error status.";
                    try {
                        const errObj = JSON.parse(responseBodyText);
                        errDetail = errObj.detail || errDetail;
                    } catch (e) {}
                    speak(`Backend error: ${errDetail}`);
                    return;
                }

                let data = {};
                try {
                    data = JSON.parse(responseBodyText);
                } catch (jsonErr) {
                    setWidgetState("error");
                    speak("Server returned invalid response format.");
                    return;
                }

                if (data.success) {
                    speak(data.speech || data.aiResponse);

                    sessionHistory.push({ role: "user", text: text });
                    sessionHistory.push({ role: "model", text: data.speech || data.aiResponse });
                    if (sessionHistory.length > 10) sessionHistory.shift();

                    const actionEvent = new CustomEvent("vira-action", {
                        detail: {
                            action: data.action,
                            page: data.page,
                            response: data.speech || data.aiResponse,
                            pipeline: data.pipeline
                        }
                    });
                    window.dispatchEvent(actionEvent);

                    if (data.route) {
                        const cleanRoute = data.route.replace(/^\//, "");
                        const navEvent = new CustomEvent("vira-action", {
                            detail: {
                                action: "navigate",
                                page: cleanRoute
                            }
                        });
                        window.dispatchEvent(navEvent);
                    }
                } else {
                    setWidgetState("error");
                    speak(data.reasoning || data.speech || "I encountered an issue processing the request.");
                }
            }, 800);
        };

        recognition.onerror = () => {
            setWidgetState("idle");
            statusText.innerText = farmerLanguage === "te" ? "మాట్లాడటానికి బటన్ నొక్కండి" : farmerLanguage === "hi" ? "बोलने के लिए बटन दबाएं" : "Tap microphone to speak";
            wave.classList.remove("active");
        };
    } else {
        statusText.innerText = "Voice input unsupported in browser";
    }
})();
