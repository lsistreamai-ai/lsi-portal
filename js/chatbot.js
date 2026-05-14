// LSI Chatbot - Self-invoking to ensure it runs
(function() {
  const chatQuestions = {
    en: [
      { q: "What AI tools do you offer?", a: "We offer 7 AI-powered tools:\n\n• AI School Platform - Student management\n• Learning Buddy - AI tutoring\n• Meta School - VR learning\n• LLM Wiki - Bilingual knowledge base\n• AI Grading Scanner - Scan & grade papers\n• DSE Learn - DSE exam prep\n• Cypress AI - Full learning platform" },
      { q: "How much does it cost?", a: "Pricing varies by school size:\n\n• Basic: HK$5,000/year (up to 500 students)\n• Standard: HK$12,000/year (up to 2,000 students)\n• Premium: HK$25,000/year (unlimited students)\n\nContact us for custom quotes!" },
      { q: "Do you offer teacher training?", a: "Yes! We provide:\n\n• AI tools workshops (2-4 hours)\n• Integration training for existing systems\n• Ongoing support and consultation\n\nTraining sessions can be customized for your school's needs." },
      { q: "How to get started?", a: "Getting started is easy:\n\n1. Contact us via email or phone\n2. Free demo session (30 min)\n3. Pilot program (1-2 weeks)\n4. Full implementation\n\nEmail: lsistreamai@gmail.com\nPhone: +852 9828 2172" },
      { q: "Is there bilingual support?", a: "Yes! All our tools support:\n\n• English\n• Traditional Chinese (香港)\n• We use Hong Kong EDB curriculum terminology\n\nPerfect for local and international schools." },
      { q: "Do you work with primary schools?", a: "Absolutely! Our tools work for:\n\n• Primary schools (P1-P6)\n• Secondary schools (S1-S6)\n• DSE preparation\n• STEAM programs\n\nOver 11 partner teachers across Hong Kong." }
    ],
    cn: [
      { q: "你們提供哪些AI工具？", a: "我們提供7種AI工具：\n\n• AI學校平台 - 學生管理\n• 學習夥伴 - AI輔導\n• 元學校 - VR學習\n• LLM百科 - 雙語知識庫\n• AI評分掃描器 - 掃描評分試卷\n• DSE學習 - DSE考試準備\n• Cypress AI - 完整學習平台" },
      { q: "費用是多少？", a: "按學校規模定價：\n\n• 基礎版：HK$5,000/年（最多500學生）\n• 標準版：HK$12,000/年（最多2,000學生）\n• 專業版：HK$25,000/年（無限學生）\n\n聯絡我們獲取定制報價！" },
      { q: "有教師培訓嗎？", a: "有的！我們提供：\n\n• AI工具工作坊（2-4小時）\n• 系統整合培訓\n• 持續支援和諮詢\n\n培訓可按學校需求定制。" },
      { q: "如何開始使用？", a: "開始很簡單：\n\n1. 電郵或電話聯絡我們\n2. 免費示範（30分鐘）\n3. 試用計劃（1-2週）\n4. 全面實施\n\n電郵：lsistreamai@gmail.com\n電話：+852 9828 2172" },
      { q: "支援雙語嗎？", a: "是的！所有工具支援：\n\n• 英文\n• 繁體中文（香港）\n• 使用香港教育局課程術語\n\n適合本地和國際學校。" },
      { q: "有小學版本嗎？", a: "當然！我們的工具適用於：\n\n• 小學（小一至小六）\n• 中學（中一至中六）\n• DSE準備\n• STEAM課程\n\n超過11位合作教師遍佈香港。" }
    ]
  };

  let currentLang = 'en';
  let isOpen = false;
  let conversationHistory = [];

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #lsi-chat-toggle {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        background: linear-gradient(135deg, #1e3a5f, #2563eb) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 28px !important;
        cursor: pointer !important;
        box-shadow: 0 4px 20px rgba(30, 58, 95, 0.4) !important;
        z-index: 999999 !important;
        transition: transform 0.3s, box-shadow 0.3s !important;
        border: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      #lsi-chat-toggle:hover, #lsi-chat-toggle:active {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 30px rgba(30, 58, 95, 0.5) !important;
      }
      #lsi-chat-window {
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        width: 360px !important;
        max-width: calc(100vw - 40px) !important;
        height: 500px !important;
        max-height: 70vh !important;
        background: white !important;
        border-radius: 16px !important;
        box-shadow: 0 10px 50px rgba(0,0,0,0.25) !important;
        display: none !important;
        flex-direction: column !important;
        z-index: 999998 !important;
        overflow: hidden !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
      #lsi-chat-window.open {
        display: flex !important;
      }
      #lsi-chat-header {
        background: linear-gradient(135deg, #1e3a5f, #2563eb) !important;
        color: white !important;
        padding: 14px 16px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      #lsi-chat-title {
        font-weight: 600 !important;
        font-size: 1rem !important;
      }
      #lsi-chat-close {
        background: rgba(255,255,255,0.2) !important;
        border: none !important;
        color: white !important;
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 16px !important;
      }
      #lsi-chat-messages {
        flex: 1 !important;
        padding: 16px !important;
        overflow-y: auto !important;
        background: #f8fafc !important;
      }
      .lsi-chat-msg {
        margin-bottom: 12px !important;
        padding: 10px 14px !important;
        border-radius: 12px !important;
        max-width: 85% !important;
        line-height: 1.5 !important;
        font-size: 0.9rem !important;
      }
      .lsi-chat-msg.user {
        background: linear-gradient(135deg, #1e3a5f, #2563eb) !important;
        color: white !important;
        margin-left: auto !important;
      }
      .lsi-chat-msg.bot {
        background: white !important;
        color: #1e293b !important;
        border: 1px solid #e2e8f0 !important;
      }
      #lsi-chat-questions {
        padding: 10px 12px !important;
        background: #f1f5f9 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        max-height: 100px !important;
        overflow-y: auto !important;
      }
      .lsi-q-btn {
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 16px !important;
        padding: 6px 12px !important;
        font-size: 0.75rem !important;
        cursor: pointer !important;
        color: #475569 !important;
        font-family: inherit !important;
      }
      .lsi-q-btn:hover, .lsi-q-btn:active {
        background: #e0e7ff !important;
        border-color: #2563eb !important;
        color: #1e3a5f !important;
      }
      #lsi-chat-input-area {
        padding: 12px !important;
        display: flex !important;
        gap: 8px !important;
        border-top: 1px solid #e2e8f0 !important;
        background: white !important;
      }
      #lsi-chat-input {
        flex: 1 !important;
        padding: 10px 14px !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 20px !important;
        outline: none !important;
        font-size: 0.9rem !important;
        font-family: inherit !important;
      }
      #lsi-chat-input:focus {
        border-color: #2563eb !important;
      }
      #lsi-chat-send {
        background: linear-gradient(135deg, #1e3a5f, #2563eb) !important;
        color: white !important;
        border: none !important;
        border-radius: 20px !important;
        padding: 10px 16px !important;
        cursor: pointer !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);
  }

  function createChatButton() {
    const btn = document.createElement('div');
    btn.id = 'lsi-chat-toggle';
    btn.innerHTML = '💬';
    document.body.appendChild(btn);
    return btn;
  }

  function createChatWindow() {
    const chat = document.createElement('div');
    chat.id = 'lsi-chat-window';
    chat.innerHTML = `
      <div id="lsi-chat-header">
        <span id="lsi-chat-title">LSI Assistant</span>
        <button id="lsi-chat-close">✕</button>
      </div>
      <div id="lsi-chat-messages"></div>
      <div id="lsi-chat-questions"></div>
      <div id="lsi-chat-input-area">
        <input type="text" id="lsi-chat-input" placeholder="Type your question...">
        <button id="lsi-chat-send">Send</button>
      </div>
    `;
    document.body.appendChild(chat);
    return chat;
  }

  function showQuestions() {
    const container = document.getElementById('lsi-chat-questions');
    container.innerHTML = '';
    
    chatQuestions[currentLang].forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'lsi-q-btn';
      btn.textContent = item.q;
      btn.onclick = () => askQuestion(item);
      container.appendChild(btn);
    });
  }

  function addUserMessage(text) {
    const messagesDiv = document.getElementById('lsi-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'lsi-chat-msg user';
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    conversationHistory.push({ role: 'user', text });
  }

  function addBotMessage(text) {
    const messagesDiv = document.getElementById('lsi-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'lsi-chat-msg bot';
    msg.innerHTML = text.replace(/\n/g, '<br>');
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    conversationHistory.push({ role: 'bot', text });
  }

  function askQuestion(item) {
    addUserMessage(item.q);
    
    const messagesDiv = document.getElementById('lsi-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'lsi-chat-msg bot';
    typingDiv.textContent = '...';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    setTimeout(() => {
      typingDiv.remove();
      addBotMessage(item.a);
    }, 500);
  }

  function sendMessage() {
    const input = document.getElementById('lsi-chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    addUserMessage(text);
    input.value = '';
    
    const questions = chatQuestions[currentLang];
    let found = questions.find(item => 
      text.toLowerCase().includes(item.q.toLowerCase().split(' ')[0]) ||
      item.q.toLowerCase().includes(text.toLowerCase().split(' ')[0])
    );
    
    setTimeout(() => {
      if (found) {
        addBotMessage(found.a);
      } else {
        addBotMessage(currentLang === 'en' 
          ? "Thanks for your question! For detailed assistance, please contact us:\n\n📧 lsistreamai@gmail.com\n📞 +852 9828 2172\n\nOr click one of the suggested questions above."
          : "謝謝你的問題！如需詳細協助，請聯絡我們：\n\n📧 lsistreamai@gmail.com\n📞 +852 9828 2172\n\n或點擊上方的建議問題。");
      }
    }, 600);
  }

  function toggleChat() {
    const chat = document.getElementById('lsi-chat-window');
    isOpen = !isOpen;
    
    if (isOpen) {
      chat.classList.add('open');
      if (conversationHistory.length === 0) {
        addBotMessage(currentLang === 'en' 
          ? "Hello! 👋 How can I help you today? Click a question below or type your own." 
          : "你好！👋 有什麼可以幫你？點擊下方問題或輸入你的問題。");
        showQuestions();
      }
    } else {
      chat.classList.remove('open');
    }
  }

  function init() {
    currentLang = window.location.pathname.includes('/cn/') ? 'cn' : 'en';
    
    addStyles();
    createChatButton();
    createChatWindow();

    document.getElementById('lsi-chat-toggle').addEventListener('click', toggleChat);
    document.getElementById('lsi-chat-close').addEventListener('click', toggleChat);
    document.getElementById('lsi-chat-send').addEventListener('click', sendMessage);
    document.getElementById('lsi-chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
