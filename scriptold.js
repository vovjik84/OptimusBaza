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
      "Send Image": "Суретті жіберу",
      "WelcomeHistory": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по истории. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
      "WelcomeMath": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по математике. Я не даю готовых решений и ответов, но я подскажу тебе и проверю все ли у тебя верно получается. Давай начнем!",
      "WelcomeEnglish": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по английскому языку. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
      "WelcomeGeography": "Привет. <b>Я Оптимус</b>. <br>Я помогу тебе с заданиями по географии. Я не даю готовых ответов, но помогаю с нахождением истины. Давай начнем!",
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
  }
};

let currentSubject = 'History'; // Инициализация текущего предмета
let currentLanguage = 'en'; // Инициализация текущего языка

function initializePage() {
  updateLanguage(currentLanguage); // Обновить интерфейс при запуске
  highlightSelectedLanguageButton(currentLanguage); // Highlight the selected language button
}

function selectSubject(subject) {
  console.log('Subject selected:', subject); // Debugging line
  currentSubject = subject;  // Ensure currentSubject is set
  updateSubjectInChat();  // Update the subject name based on the selected language
  document.getElementById('startPage').classList.add('hidden');
  document.getElementById('chatPage').classList.remove('hidden');
  loadChatHistory(subject); // Load chat history for the selected subject
}

function updateLanguage(lang) {
  currentLanguage = lang;

  // Обновление текста кнопок предметов
  document.getElementById('subjectHistory').textContent = translations[lang]['History'];
  document.getElementById('subjectMath').textContent = translations[lang]['Math'];
  document.getElementById('subjectEnglish').textContent = translations[lang]['English'];
  document.getElementById('subjectGeography').textContent = translations[lang]['Geography'];

  // Обновление текста кнопок и placeholder
  document.getElementById('clearChatButton').textContent = translations[lang]['Clear Chat'];
  document.getElementById('backButton').textContent = translations[lang]['Back to Beginning'];
  document.getElementById('userInput').placeholder = translations[lang]['Type your message here...'];

  // Обновление текста заголовка предмета в чате
  updateSubjectInChat();
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

let userId = localStorage.getItem('user_id');
if (!userId) {
  userId = generateUUID();
  localStorage.setItem('user_id', userId);
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

document.getElementById('userImage').addEventListener('change', function() {
  sendImage();
});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function goBack() {
  document.getElementById('startPage').classList.remove('hidden');
  document.getElementById('chatPage').classList.add('hidden');
  document.getElementById('sendMessageButton').classList.remove('disabled'); // Re-enable for when returning
}

async function sendImage() {
  const userImage = document.getElementById('userImage').files[0];
  if (!userImage) return;

  const formData = new FormData();
  formData.append('image', userImage);
  formData.append('user_id', userId);

  const response = await fetch('/upload', {
      method: 'POST',
      body: formData
  });

  const data = await response.json();
  if (data.success) {
      const imageURL = `${window.location.origin}/mainproject/${data.filename}`;
      addMessage('user', imageURL, true);
      saveMessage('user', imageURL, true); // Save the image message

      // Trigger the second request to get the OpenAI response
      const openaiResponse = await fetch('/process_image', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              filename: data.filename,
              user_id: userId,
              subject: currentSubject // Add current subject
          })
      });
      const openaiData = await openaiResponse.json();
      addTypingMessage('bot', openaiData.response);
      saveMessage('bot', openaiData.response);
  } else {
      addMessage('user', `Failed to send image: ${data.error}`);
  }

  // Reset the file input so the same file can be selected again if needed
  document.getElementById('userImage').value = '';
}

let isUserScrolling = false; // Флаг для отслеживания ручного скроллинга

// Обновленная функция scrollToBottom с учетом флага isUserScrolling
function scrollToBottom() {
  const chatBox = document.getElementById('chatBox');
  if (!isUserScrolling) {
      chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Обработчик события скролла для обновления флага isUserScrolling
function handleUserScroll() {
  const chatBox = document.getElementById('chatBox');
  const atBottom = chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
  isUserScrolling = !atBottom; // Если не внизу, то скроллинг ручной
}

// Добавление прослушивателя события скролла
document.getElementById('chatBox').addEventListener('scroll', handleUserScroll);

// Функция отправки сообщения
async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (userInput.trim() === '') return;

  addMessage('user', userInput);
  document.getElementById('userInput').value = '';

  // Прокрутка чата до самого низа при отправке сообщения
  const chatBox = document.getElementById('chatBox');
  chatBox.scrollTop = chatBox.scrollHeight;

  const response = await fetch('/chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          message: userInput,
          user_id: userId,
          subject: currentSubject // Add current subject
      })
  });
  const data = await response.json();
  addTypingMessage('bot', data.response);
  saveMessage('user', userInput);
  saveMessage('bot', data.response);
}

// Функция очистки чата
async function clearChat() {
  const chatHistory = JSON.parse(localStorage.getItem('chat_history')) || {};
  if (chatHistory[userId]) {
      // Filter out messages for the current subject
      chatHistory[userId] = chatHistory[userId].filter(msg => msg.subject !== currentSubject);
      localStorage.setItem('chat_history', JSON.stringify(chatHistory));
      loadChatHistory(currentSubject);
  }

  // Send request to delete chat history from the database
  await fetch('/clear_chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user_id: userId,
          subject: currentSubject // Add current subject
      })
  });
}

// Функция добавления сообщения
function addMessage(role, content, isImage = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);

  if (isImage) {
      messageDiv.innerHTML = `<br><img src="${content}" alt="Uploaded Image" style="max-width: 70%; height: auto;">`;
  } else {
      messageDiv.innerHTML = marked.parse(content);
  }

  document.getElementById('chatBox').appendChild(messageDiv);
  scrollToBottom(); // Прокрутка до низа чата

  // Apply MathJax only to bot messages
  if (role === 'bot') {
      // Defer MathJax processing to the next event loop tick
      setImmediate(() => {
          MathJax.typesetPromise([messageDiv]).then(() => {
              console.log('MathJax typeset complete');
          }).catch(err => {
              console.error('MathJax typeset error:', err);
          });
      });
  }
}

// Функция добавления печатающего сообщения
function addTypingMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);
  const span = document.createElement('span');
  span.classList.add('typewriter');
  messageDiv.appendChild(span);
  document.getElementById('chatBox').appendChild(messageDiv);
  scrollToBottom(); // Прокрутка до низа чата

  let i = 0;

  function typeWriter() {
      if (i < content.length) {
          span.innerHTML = marked.parse(content.substring(0, i + 1));
          i++;
          scrollToBottom(); // Прокрутка до низа чата

          // Process MathJax incrementally
          if (role === 'bot') {
              MathJax.typesetPromise([messageDiv]).then(() => {
                  console.log('MathJax typeset complete');
              }).catch(err => {
                  console.error('MathJax typeset error:', err);
              });
          }
          setImmediate(typeWriter);
      }
  }

  typeWriter();
}

// Функция для выполнения задачи после текущего выполнения
function setImmediate(callback) {
  return setTimeout(callback, 0);
}

function saveMessage(role, content, isImage = false) {
  const chatHistory = JSON.parse(localStorage.getItem('chat_history')) || {};
  if (!chatHistory[userId]) {
      chatHistory[userId] = [];
  }
  chatHistory[userId].push({ role, content, subject: currentSubject, isImage });
  console.log('Saving message:', { role, content, subject: currentSubject, isImage }); // Debugging line
  localStorage.setItem('chat_history', JSON.stringify(chatHistory));
}

function loadChatHistory(subject) {
  console.log('Loading chat history for subject:', subject); // Debugging line
  const chatHistory = JSON.parse(localStorage.getItem('chat_history')) || {};
  const messages = (chatHistory[userId] || []).filter(msg => msg.subject === subject);
  document.getElementById('chatBox').innerHTML = '';
  messages.forEach(msg => addMessage(msg.role, msg.content, msg.isImage));

  // Add a welcome message if the chat is being initialized
  if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessageForSubject(subject);
      if (welcomeMessage) {
          addMessage('bot', welcomeMessage);
          saveMessage('bot', welcomeMessage); // Save the welcome message to history
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
