(function () {
    if (window.__ViraScriptRunning) {
        console.log("Vira script already executing. Exiting to prevent duplication.");
        return;
    }
    window.__ViraScriptRunning = true;

    const script = document.currentScript;
    const userId = script?.dataset?.userId || "demo";
    const apiUrl = script?.dataset?.apiUrl || "http://127.0.0.1:8001/api/v1";
    
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

    const triggerWelcomeSpeech = () => {
        console.log("triggerWelcomeSpeech triggered. hasGreetedOnOpen:", hasGreetedOnOpen);
        if (hasGreetedOnOpen) return;
        hasGreetedOnOpen = true;

        console.log("Removing document click/keydown interaction listeners.");
        document.removeEventListener("click", triggerWelcomeSpeech);
        document.removeEventListener("keydown", triggerWelcomeSpeech);

        const welcomeText = farmerLanguage === "te" 
          ? "నమస్తే! నేను వీరాని. మీ వ్యవసాయ సహాయకుడిని. మీకు ఈరోజు నేను ఎలా సహాయం చేయగలను?" 
          : farmerLanguage === "hi" 
            ? "नमस्ते! मैं वीरा हूँ। आपकी कृषि सलाहकार। आज मैं आपकी क्या मदद कर सकती हूँ?" 
            : "Namaste. I'm Vira. Welcome to Krishiva. I'm here to help you make smarter decisions. How can I help you today?";
        
        console.log("GREETING EXECUTED");
        console.log("Text to speak:", welcomeText);
        speak(welcomeText);
    };

    button.onclick = () => {
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
            
            const welcomeText = farmerLanguage === "te" 
              ? "నమస్తే! నేను వీరాని. మీ వ్యవసాయ సహాయకుడిని. మీకు ఈరోజు నేను ఎలా సహాయం చేయగలను?" 
              : farmerLanguage === "hi" 
                ? "नमस्ते! मैं वीरा हूँ। आपकी कृषि सलाहकार। आज मैं आपकी क्या मदद कर सकती हूँ?" 
                : "Namaste. I'm Vira. Welcome to Krishiva. I'm here to help you make smarter decisions. How can I help you today?";
            
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
        title.innerHTML = `Namaste! I'm ${assistantConfig.assistantName}`;

        const subTitle = popup.querySelector(".vira-sub");
        const farmerName = farmer.name ? `, ${farmer.name}` : "";
        if (farmerLanguage === "te") {
          subTitle.innerHTML = `స్వాగతం ${farmerName}.<br/>మీ వ్యవసాయ సహాయకుడిని.`;
        } else if (farmerLanguage === "hi") {
          subTitle.innerHTML = `स्वागत है ${farmerName}।<br/>आपकी कृषि सहायिका।`;
        } else {
          subTitle.innerHTML = `Welcome ${farmerName}.<br/>Your AI Farming Companion.`;
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
    const speak = (text) => {
        if (!window.speechSynthesis) {
            console.error("[Vira Pipeline Audit] Stage 8 Failed: Speech synthesis not supported.");
            return;
        }

        console.log("[Vira Pipeline Audit] Stage 8: Speech synthesis (TTS) requested. Text to speak:", text);
        console.log("speechSynthesis state - speaking:", window.speechSynthesis.speaking);
        console.log("speechSynthesis state - pending:", window.speechSynthesis.pending);
        console.log("speechSynthesis state - paused:", window.speechSynthesis.paused);

        console.log("Executing speechSynthesis.cancel() to clear the queue.");
        window.speechSynthesis.cancel();

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
        console.log("SpeechSynthesisUtterance successfully created. Text:", text);
        
        utterance.rate = 0.95; // Soft natural speed
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
        };

        const configureVoiceAndRun = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log(`TTS System: ${voices.length} voices loaded in browser.`);
            if (voices.length > 0) {
                // Log all system voices for debugging
                console.log("Available Voices:");
                voices.forEach((v, index) => console.log(`  [${index}] ${v.name} (${v.lang}) - local:${v.localService}`));
            }

            let targetLang = farmerLanguage === "te" ? "te-IN" : farmerLanguage === "hi" ? "hi-IN" : "en-IN";
            let selectedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLang.toLowerCase()));
            
            if (!selectedVoice) {
                console.warn(`Preferred language voice (${targetLang}) not available.`);
                // Search for generic lang match
                selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(farmerLanguage.toLowerCase()));
            }

            if (!selectedVoice) {
                console.warn("Preferred generic language voice not available. Falling back to English voice.");
                // Fallback to English
                selectedVoice = voices.find(v => v.lang.toLowerCase().includes("en-"));
            }

            if (!selectedVoice && voices.length > 0) {
                console.warn("English voice fallback not found. Falling back to first system voice.");
                selectedVoice = voices[0];
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
                console.log(`Setting Utterance voice to: ${selectedVoice.name} (${selectedVoice.lang})`);
            } else {
                console.warn("No voices loaded/found. Relying on default system voice.");
                utterance.lang = targetLang;
            }

            console.log("Executing window.speechSynthesis.speak(utterance)");
            window.speechSynthesis.speak(utterance);
        };

        // If voices are empty, Chrome is loading them asynchronously. Wait for event.
        if (window.speechSynthesis.getVoices().length === 0) {
            console.log("Voices not loaded yet. Registering onvoiceschanged listener.");
            window.speechSynthesis.onvoiceschanged = () => {
                console.log("onvoiceschanged event fired.");
                configureVoiceAndRun();
                window.speechSynthesis.onvoiceschanged = null; // Unregister listener
            };
            // Fallback trigger if event never fires in 250ms
            setTimeout(() => {
                if (!utterance.voice && window.speechSynthesis.getVoices().length > 0) {
                    console.log("onvoiceschanged timeout fallback triggered.");
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

        mic.onclick = () => {
            console.log("[Vira Pipeline Audit] Stage 1: Microphone triggered.");
            // Interrupt active TTS if clicked during speaking
            if (currentState === "speaking") {
              window.speechSynthesis.cancel();
            }

            applyConfig(); // Sync on-the-fly config updates

            // Check if Offline
            if (!navigator.onLine) {
              console.error("[Vira Pipeline Audit] Stage 1 Failed: Device is offline.");
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
              recognition.lang = "en-US";
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
            console.log(`[Vira Pipeline Audit] Stage 3: Language preference: "${farmerLanguage}"`);
            
            userText.innerText = (farmerLanguage === "te" ? "మీరు: " : farmerLanguage === "hi" ? "आप: " : "You: ") + text;
            recognition.stop();
            setWidgetState("thinking");

            // Dynamic progress indicators to feel like a premium copilot
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

                console.log(`[Vira Pipeline Audit] Stage 4: Dispatched HTTP payload to Backend API: "${url}"`);
                console.log("Headers:", headers);
                console.log("Request Payload:", JSON.stringify(requestBody));

                let res;
                try {
                    res = await fetch(url, {
                        method: "POST",
                        headers,
                        body: JSON.stringify(requestBody)
                    });
                } catch (netErr) {
                    console.error("[Vira Pipeline Audit] Stage 4 Failed: Network connection error:", netErr);
                    clearInterval(timer);
                    setWidgetState("error");
                    speak("Server connection issue. Please check network.");
                    return;
                }

                console.log(`[Vira Pipeline Audit] Stage 5: Received response. Status: ${res.status}`);

                let responseBodyText = "";
                try {
                    responseBodyText = await res.text();
                } catch (readErr) {
                    console.error("[Vira Pipeline Audit] Failed to read response stream:", readErr);
                }

                clearInterval(timer);

                if (!res.ok) {
                    setWidgetState("error");
                    let errDetail = "Server returned an error status.";
                    try {
                        const errObj = JSON.parse(responseBodyText);
                        errDetail = errObj.detail || errDetail;
                    } catch (e) {}
                    console.error(`[Vira Pipeline Audit] Stage 5 Failed: Backend API error (${res.status}): ${errDetail}`);
                    speak(`Backend error: ${errDetail}`);
                    return;
                }

                let data = {};
                try {
                    data = JSON.parse(responseBodyText);
                } catch (jsonErr) {
                    console.error("[Vira Pipeline Audit] Stage 5 Failed: Invalid JSON response:", jsonErr);
                    setWidgetState("error");
                    speak("Server returned invalid response format.");
                    return;
                }

                if (data.success) {
                    console.log(`[Vira Pipeline Audit] Stage 6 & 7: Vira Agent execution and translation success. Action: "${data.action}". Route: "${data.route}"`);
                    speak(data.speech || data.aiResponse);

                    // Save dialog context state in session memory
                    sessionHistory.push({ role: "user", text: text });
                    sessionHistory.push({ role: "model", text: data.speech || data.aiResponse });
                    if (sessionHistory.length > 10) sessionHistory.shift(); // Cap history to last 5 turns

                    // Dispatch structured event to host app
                    const actionEvent = new CustomEvent("vira-action", {
                        detail: {
                            action: data.action,
                            page: data.page,
                            response: data.speech || data.aiResponse,
                            pipeline: data.pipeline
                        }
                    });
                    window.dispatchEvent(actionEvent);

                    // Handle page navigation routing directly
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
            statusText.innerText = farmerLanguage === "te" ? "నొక్కండి" : farmerLanguage === "hi" ? "दबाएं" : "Tap microphone to speak";
            wave.classList.remove("active");
        };
    } else {
        statusText.innerText = "Voice input unsupported in browser";
    }
})();
