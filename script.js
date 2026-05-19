let chatHistory = [];

function renderChat() {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML = "";

  chatHistory.forEach(m => {
    chatbox.innerHTML += `<div class="msg ${m.role}">${m.text}</div>`;
  });

  chatbox.scrollTop = chatbox.scrollHeight;
}

function saveChat() {
  localStorage.setItem("chat", JSON.stringify(chatHistory));
}

function loadChat() {
  const saved = localStorage.getItem("chat");
  if (saved) {
    chatHistory = JSON.parse(saved);
    renderChat();
  }
}

async function sendMessage() {
  const input = document.getElementById("input");
  const typing = document.getElementById("typing");

  const text = input.value;
  if (!text) return;

  chatHistory.push({ role: "user", text });
  renderChat();
  saveChat();

  input.value = "";

  typing.style.display = "block";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: text }]
    })
  });

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || "Error";

  typing.style.display = "none";

  chatHistory.push({ role: "ai", text: reply });
  renderChat();
  saveChat();
}

function newChat() {
  chatHistory = [];
  saveChat();
  renderChat();
}

loadChat();