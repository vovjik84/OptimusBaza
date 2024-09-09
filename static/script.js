const translations = {
  en: {
      "History": "History",
      "Math": "Math",
      "English": "English",
      "Geography": "Geography",
      "Send": "Send",
      "Clear Chat": "Clear Chat",
      "Back to Beginning": "Back to Beginning",
      "Type your message here...": "Type your message here...",
      "Photo Icon": "Photo Icon",
      "Failed to send image": "Failed to send image",
      "Send Image": "Send Image",
      "WelcomeHistory": "Hello. <b>I'm Optimus</b>. <br>I'll help you with your history assignments. I don't give ready answers, but I help you find the truth. Let's get started!",
      "WelcomeMath": "Hello. <b>I'm Optimus</b>. <br>I'll help you with your math assignments. I don't give ready solutions or answers, but I'll guide you and check if everything is correct. Let's get started!",
      "WelcomeEnglish": "Hello. <b>I'm Optimus</b>. <br>I'll help you with your English assignments. I don't give ready answers, but I help you find the truth. Let's get started!",
      "WelcomeGeography": "Hello. <b>I'm Optimus</b>. <br>I'll help you with your geography assignments. I don't give ready answers, but I help you find the truth. Let's get started!",
      "OptimusThinking": "...Optimus AI thinking..."
  },
  ru: {
      "History": "История",
      "Math": "Математика",
      "English": "Английский",
      "Geography": "География",
      "Send": "Отправить",
      "Clear Chat": "Очистить чат",
      "Back to Beginning": "Вернуться к началу",
      "Type your message here...": "Введите ваше сообщение здесь...",
      "Photo Icon": "Иконка фото",
      "Failed to send image": "Не удалось отправить изображение",
      "Send Image": "Отправить изображение",
      "WelcomeHistory": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по истории. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
      "WelcomeMath": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по математике. Я не даю готовых решений и ответов, но я подскажу тебе и проверю все ли у тебя верно получается. Давай начнем!",
      "WelcomeEnglish": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по английскому языку. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
      "WelcomeGeography": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по географии. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
      "OptimusThinking": "...Optimus AI думает..."
  },
  kz: {
      "History": "Тарих",
      "Math": "Математика",
      "English": "Ағылшын тілі",
      "Geography": "География",
      "Send": "Жіберу",
      "Clear Chat": "Чатты тазарту",
      "Back to Beginning": "Бастауға қайту",
      "Type your message here...": "Мұнда хабарламаңызды жазыңыз...",
      "Photo Icon": "Фото белгішесі",
      "Failed to send image": "Суретті жіберу сәтсіз аяқталды",
      "Send Image": "Суретті жіберу",
      "WelcomeHistory": "Сәлем. <b>Мен Оптимус</b>. <br>Мен сізге тарих бойынша тапсырмалармен көмектесемін. Мен дайын жауаптар бермеймін, бірақ шындықты табуға көмектесемін. Қане, бастайық!",
      "WelcomeMath": "Сәлем. <b>Мен Оптимус</b>. <br>Мен сізге математика бойынша тапсырмалармен көмектесемін. Мен дайын шешімдер немесе жауаптар бермеймін, бірақ мен сізге көмек көрсетемін және бәрі дұрыс екенін тексеремін. Қане, бастайық!",
      "WelcomeEnglish": "Сәлем. <b>Мен Оптимус</b>. <br>Мен сізге ағылшын тілі бойынша тапсырмалармен көмектесемін. Мен дайын жауаптар бермеймін, бірақ шындықты табуға көмектесемін. Қане, бастайық!",
      "WelcomeGeography": "Сәлем. <b>Мен Оптимус</b>. <br>Мен сізге география бойынша тапсырмалармен көмектесемін. Мен дайын жауаптар бермеймін, бірақ шындықты табуға көмектесемін. Қане, бастайық!",
      "OptimusThinking": "...Optimus AI ойланып жатыр..."
  }
};

let currentSubject = 'History'; // Initialize current subject
let currentLanguage = 'ru'; // Initialize current language
let cropper = null;
let userId = localStorage.getItem('user_id');
if (!userId) {
    userId = generateUUID();
    localStorage.setItem('user_id', userId);
}

let sessionId = getSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
if (!sessionId) {
    sessionId = setSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
}

function initializePage() {
    updateLanguage(currentLanguage); // Update interface on startup
    highlightSelectedLanguageButton(currentLanguage); // Highlight the selected language button
    }
    

function getSessionIdForLanguageAndSubject(lang, subject) {
  return localStorage.getItem('session_id_' + userId + '_' + lang + '_' + subject);
}

function setSessionIdForLanguageAndSubject(lang, subject) {
  sessionId = generateUUID();
  localStorage.setItem('session_id_' + userId + '_' + lang + '_' + subject, sessionId);
  return sessionId;
}


function selectSubject(subject) {
    console.log('Subject selected:', subject); // Debugging line
    currentSubject = subject;  // Ensure currentSubject is set

    // Generate or retrieve a session ID for the selected language and subject
    sessionId = getSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
    if (!sessionId) {
        sessionId = setSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
    }

    updateSubjectInChat();  // Update the subject name based on the selected language
    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('chatPage').classList.remove('hidden');
    loadChatHistory(subject); // Load chat history for the selected subject
}


function updateLanguage(lang) {
    currentLanguage = lang;

    // Generate or retrieve a session ID for the new language and subject
    sessionId = getSessionIdForLanguageAndSubject(lang, currentSubject);
    if (!sessionId) {
        sessionId = setSessionIdForLanguageAndSubject(lang, currentSubject);
    }

    // Update the rest of the language settings
    document.getElementById('subjectHistory').textContent = translations[lang]['History'];
    document.getElementById('subjectMath').textContent = translations[lang]['Math'];
    document.getElementById('subjectEnglish').textContent = translations[lang]['English'];
    document.getElementById('subjectGeography').textContent = translations[lang]['Geography'];
    document.getElementById('clearChatButton').textContent = translations[lang]['Clear Chat'];
    document.getElementById('backButton').textContent = translations[lang]['Back to Beginning'];
    document.getElementById('userInput').placeholder = translations[lang]['Type your message here...'];
    updateSubjectInChat();

    // Load chat history specific to the language and subject
    // loadChatHistory(currentSubject);
}


function updateSubjectInChat() {
    document.getElementById('selectedSubject').textContent = translations[currentLanguage][currentSubject];
}

function selectCountry(country) {
    let lang = 'en'; // Default language

    switch (country) {
        case 'Russia':
            lang = 'ru';
            break;
        case 'UK':
            lang = 'en';
            break;
        case 'Kazakhstan':
            lang = 'kz';
            break;
    }

    updateLanguage(lang);
    highlightSelectedLanguageButton(lang);
}



document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.getElementById('userImage').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('cropContainer').classList.remove('hidden');
            const cropImage = document.getElementById('cropImage');
            cropImage.src = event.target.result;
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(cropImage, {
                aspectRatio: NaN, // Allow free aspect ratio
                viewMode: 1,
                autoCropArea: 1,
                responsive: true,
            });
        };
        reader.readAsDataURL(file);
    }

    // Clear the file input value to ensure change event triggers for the same file
    this.value = '';
});


function cropImage() {
    const canvas = cropper.getCroppedCanvas();
    let maxDimension = Math.max(canvas.width, canvas.height);

    if (maxDimension > 1000) {
        const scale = 1000 / maxDimension;
        const scaledCanvas = document.createElement('canvas');
        const ctx = scaledCanvas.getContext('2d');

        // Set new dimensions
        scaledCanvas.width = canvas.width * scale;
        scaledCanvas.height = canvas.height * scale;

        // Draw the scaled image
        ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

        // Convert the scaled canvas to a blob and proceed with the form submission
        scaledCanvas.toBlob(function(blob) {
            uploadImage(blob);
        }, 'image/png');
    } else {
        // If no scaling is needed, use the original canvas
        canvas.toBlob(function(blob) {
            uploadImage(blob);
        }, 'image/png');
    }

    function uploadImage(blob) {
        const formData = new FormData();
        formData.append('image', blob, 'cropped.png');
        formData.append('user_id', userId);
        formData.append('subject', currentSubject); // Use the correct subject
        formData.append('session_id', sessionId); // Add session ID
        formData.append('language', currentLanguage); // Add language

        fetch('/upload_img', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  handleUploadResponse(data);  // Handle the upload response and display the preview
                  scrollToBottom();

                  setTimeout(addThinkingMessage, 300);

                  return fetch('/process_image', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          filename: data.filename,
                          user_id: userId,
                          subject: currentSubject, // Use the correct subject
                          session_id: sessionId, // Add session ID
                          language: currentLanguage // Add language
                      })
                  });
              } else {
                  removeThinkingMessage();
                  addMessage('user', `Failed to send image: ${data.error}`);
                  scrollToBottom();
              }
          })
          .then(response => response.json())
          .then(data => {
              // Check if the response is for the current session, language, and subject
              if (data.session_id === sessionId && data.subject === currentSubject && data.language === currentLanguage) {
                  removeThinkingMessage();
                  addTypingMessage('bot', data.response);
                  saveMessage('bot', data.response, false, data.session_id, data.subject);
                  scrollToBottom();
              } else {
                  console.log('Response received for a different session, language, or subject.');
                // saveMessage('user', userInput, true, data.session_id, data.subject);
                saveMessage('bot', data.response, false, data.session_id, data.subject);
              }
          });

        document.getElementById('cropContainer').classList.add('hidden');
        resetCropper(); // Ensure cropper is reset
    }
}



let robotCount = 0;
let thinkingMessageDiv = null;
let robotInterval = null;

function addThinkingMessage() {
    if (!thinkingMessageDiv) {
        thinkingMessageDiv = document.createElement('div');
        thinkingMessageDiv.classList.add('message', 'bot', 'thinking-message');
        thinkingMessageDiv.innerHTML = `<div class="robot-line"></div><span class="thinking-text"><i>${translations[currentLanguage]['OptimusThinking']}</i></span>`;
        document.getElementById('chatBox').appendChild(thinkingMessageDiv);
        scrollToBottom();
        robotInterval = setInterval(updateRobots, 1000);
    }
}

function updateRobots() {
    robotCount = (robotCount % 7) + 1;
    const robotLine = thinkingMessageDiv.querySelector('.robot-line');
    robotLine.textContent = '🤖'.repeat(robotCount);
}

function removeThinkingMessage() {
    if (thinkingMessageDiv) {
        thinkingMessageDiv.remove();
        thinkingMessageDiv = null;
        clearInterval(robotInterval);
    }
}

function cancelCrop() {
    document.getElementById('cropContainer').classList.add('hidden');
    if (cropper) {
        cropper.destroy();
        cropper = null; // Ensure cropper is set to null
    }
    document.getElementById('userImage').value = ''; // Reset the file input
    resetCropper(); // Ensure cropper is reset
}

function resetCropper() {
    const cropImage = document.getElementById('cropImage');
    cropImage.src = ''; // Clear the image source
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function goBack() {
    removeThinkingMessage();
    document.getElementById('startPage').classList.remove('hidden');
    document.getElementById('chatPage').classList.add('hidden');
    document.getElementById('sendMessageButton').classList.remove('disabled'); // Re-enable for when returning
}

document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) { // Allow Enter with Shift for new lines
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById('userInput').addEventListener('input', function() {
    this.style.height = 'auto'; // Reset the height to auto
    this.style.height = (this.scrollHeight > 90 ? 90 : this.scrollHeight) + 'px'; // Set the height to the scroll height or max height
});

let isUserScrolling = false; // Флаг для отслеживания ручной прокрутки

function scrollToBottom(forceScroll = false) {
    const chatBox = document.getElementById('chatBox');

    if (forceScroll || !isUserScrolling) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function handleUserScroll() {
    const chatBox = document.getElementById('chatBox');
    const atBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 1;
    isUserScrolling = !atBottom; // Если не внизу, то прокрутка ручная
}

document.getElementById('chatBox').addEventListener('scroll', handleUserScroll);

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    addMessage('user', userInput);
    document.getElementById('userInput').value = '';

    scrollToBottom(true); // Прокрутить вниз после отправки сообщения

    setTimeout(addThinkingMessage, 300);

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userInput,
            user_id: userId,
            subject: currentSubject,
            session_id: sessionId,
            language: currentLanguage
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.session_id === sessionId && data.subject === currentSubject && data.language === currentLanguage) {
            removeThinkingMessage();
            addTypingMessage('bot', data.response);
            saveMessage('user', userInput, false, data.session_id, data.subject);
            saveMessage('bot', data.response, false, data.session_id, data.subject);
        } else {
            console.log('Ответ получен для другой сессии, языка или темы.');
            saveMessage('user', userInput, false, data.session_id, data.subject);
            saveMessage('bot', data.response, false, data.session_id, data.subject);
        }
    });
}




// Функция очистки чата
function clearChat() {
    removeThinkingMessage();

    // Retrieve the chat history for the current session_id
    const chatHistory = JSON.parse(localStorage.getItem('chat_history_' + sessionId)) || [];

    // Clear the chat history from localStorage for the current session_id
    localStorage.removeItem('chat_history_' + sessionId);

    // Clear the chat box visually
    document.getElementById('chatBox').innerHTML = '';

    // Reload the chat history (this will now show an empty chat box)
    loadChatHistory(currentSubject);

    // // Send request to delete chat history from the database
    // await fetch('/clear_chat', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         user_id: userId,
    //         subject: currentSubject, // Include the current subject
    //         session_id: sessionId // Include the session ID for accurate deletion
    //     })
    // });

    // Generate a new session ID after clearing chat history
    sessionId = setSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
}

function addMessage(role, content, isImage = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    if (isImage) {
        const imageElement = new Image();
        imageElement.src = content; // This is the preview image
        imageElement.style.maxWidth = '70%';
        imageElement.style.height = 'auto';
        messageDiv.appendChild(imageElement);
    } else {
        messageDiv.innerHTML = marked.parse(content);
    }

    document.getElementById('chatBox').appendChild(messageDiv);
    scrollToBottom(); // Прокрутить вниз после добавления сообщения
}



function handleUploadResponse(response) {
    if (response.success) {
        const preview = response.preview;
        const session_id = response.session_id;
        const subject = response.subject;
        addMessage('user', preview, true);  // Display the preview image in chat
        saveMessage('user', preview, true, session_id, subject); // Save only the preview in the chat history
    } else {
        console.error('Upload failed:', response.error);
    }
}


function addTypingMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    const span = document.createElement('span');
    span.classList.add('typewriter');
    messageDiv.appendChild(span);
    document.getElementById('chatBox').appendChild(messageDiv);

    let i = 0;

    function typeWriter() {
        if (i < content.length) {
            span.innerHTML = marked.parse(content.substring(0, i + 1));
            i++;

            // Process MathJax incrementally
            if (role === 'bot') {
                MathJax.typesetPromise([messageDiv]).then(() => {
                    scrollToBottom(); // Прокрутить вниз после обработки MathJax
                }).catch(err => {
                    console.error('MathJax typeset error:', err);
                });
            }

            setImmediate(typeWriter);
        } else {
            scrollToBottom(); // Прокрутить вниз после завершения ввода текста
        }
    }

    typeWriter();
}

function setImmediate(callback) {
    return setTimeout(callback, 0);
}

function saveMessage(role, content, isImage = false, session_id, subject) {

    const chatHistoryKey = 'chat_history_' + session_id;
    let chatHistory = JSON.parse(localStorage.getItem(chatHistoryKey)) || { userId: userId, messages: [] };

    const message = {
        type: isImage ? 'image' : 'text',
        content: content, // Store the full content unless you intend to preview only a portion
        role: role,
        subject: subject
    };

    chatHistory.messages.push(message);
    localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
}


function loadChatHistory(subject) {
    // sessionId = getSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
    // if (!sessionId) {
    //     sessionId = setSessionIdForLanguageAndSubject(currentLanguage, currentSubject);
    // }
    const chatHistoryKey = 'chat_history_' + sessionId;
    const chatHistory = JSON.parse(localStorage.getItem(chatHistoryKey)) || { userId: userId, messages: [] };
    const messages = chatHistory.messages.filter(msg => msg.subject === subject);

    document.getElementById('chatBox').innerHTML = '';
    messages.forEach(msg => {
        if (msg.type === 'image') {
            addMessage(msg.role, msg.content, true); // Display the preview
        } else {
            addMessage(msg.role, msg.content, false);
        }
    });

    // Add a welcome message if the chat is being initialized
    if (messages.length === 0) {
        const welcomeMessage = getWelcomeMessageForSubject(subject);
        if (welcomeMessage) {
            addMessage('bot', welcomeMessage);
            saveMessage('bot', welcomeMessage, false, sessionId, subject); // Save the welcome message to history
        }
    }
}




function getWelcomeMessageForSubject(subject) {
    const subjectKey = `Welcome${subject}`;
    return translations[currentLanguage][subjectKey] || "";
}

function highlightSelectedLanguageButton(lang) {
    const flagButtons = document.querySelectorAll('.flag-button');
    flagButtons.forEach(button => {
        button.classList.remove('selected');
    });

    switch (lang) {
        case 'ru':
            document.querySelector('.flag-button[style*="Flag_of_Russia.svg"]').classList.add('selected');
            break;
        case 'en':
            document.querySelector('.flag-button[style*="union-jack"]').classList.add('selected');
            break;
        case 'kz':
            document.querySelector('.flag-button[style*="kazakhstan-flag"]').classList.add('selected');
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('MathJax:', MathJax);
});
