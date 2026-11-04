'use strict';

// AI tools are official external websites. No information is submitted from this guide.
const toolCatalog = {
  text: {
    introduction: 'Text tools help draft, explain, summarise and organise information. Start with the fictional consumer complaint demonstration.',
    tools: [
      {name: 'ChatGPT', description: 'Questions, explanations, first drafts, summaries and structured text.', url: 'https://chatgpt.com/'},
      {name: 'Microsoft Copilot', description: 'General AI chat; Microsoft workplace capabilities depend on your account and licence.', url: 'https://copilot.com/'},
      {name: 'Google Gemini', description: 'AI assistance for writing, questions and understanding information.', url: 'https://gemini.google.com/'}
    ],
    example: 'Summarise this fictional complaint into product, date and price, problem, evidence and missing information: “I bought a rice cooker for LKR 18,500 on 12 October. It stopped heating after three days. I have a receipt and a 12-month warranty.” Do not invent facts or make legal conclusions.'
  },
  image: {
    introduction: 'Image tools can make conceptual illustrations for learning or consumer awareness. Use imaginary examples, not real consumer photographs or official branding.',
    tools: [
      {name: 'Adobe Firefly', description: 'Generate and refine images using written creative instructions.', url: 'https://firefly.adobe.com/'},
      {name: 'Canva', description: 'Create awareness graphics with AI-assisted image and design features.', url: 'https://www.canva.com/ai-image-generator/'},
      {name: 'ChatGPT', description: 'Create concept images and visual ideas where image features are available.', url: 'https://chatgpt.com/'}
    ],
    example: 'Create a clean, professional illustration for an educational slide: a shopper checks a product receipt and the return terms before buying. Show a modern Sri Lankan retail setting. No text, company logos, official seals or identifiable real people.'
  },
  video: {
    introduction: 'Video tools can create short illustrative clips. Review every frame, caption and factual claim before sharing any awareness material.',
    tools: [
      {name: 'Runway', description: 'Generate or edit short AI video clips from text or images.', url: 'https://app.runwayml.com/'},
      {name: 'Pika', description: 'Create and edit short AI video scenes from prompts and references.', url: 'https://pika.art/'},
      {name: 'Canva', description: 'Produce educational video designs and short AI-assisted clips.', url: 'https://www.canva.com/features/ai-video-generator/'}
    ],
    example: 'Create a short, simple consumer education animation: a fictional online shopper compares the total price, checks seller details and keeps an order confirmation. Clear visuals, no voice-over, no official logos and no legal claims.'
  },
  audio: {
    introduction: 'Audio tools can support narration, transcription and sound cleanup. Check language accuracy and consent before using real voices or recordings.',
    tools: [
      {name: 'ElevenLabs', description: 'Convert written text into AI-generated speech using available voices.', url: 'https://elevenlabs.io/text-to-speech'},
      {name: 'Descript', description: 'Transcribe, edit and enhance recorded audio or video.', url: 'https://www.descript.com/'},
      {name: 'Adobe Podcast', description: 'Clean up and enhance recorded speech audio.', url: 'https://podcast.adobe.com/enhance'}
    ],
    example: 'Read this fictional consumer awareness message in a calm, clear and welcoming voice: “Before buying online, check the seller, review the full price and keep your order confirmation.” Do not add extra facts.'
  }
};

const toolResults = document.getElementById('tool-results');
const tabs = Array.from(document.querySelectorAll('.category-tab'));

function makeElement(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function renderTools(category) {
  const catalog = toolCatalog[category];
  if (!catalog || !toolResults) return;
  toolResults.replaceChildren();
  toolResults.setAttribute('aria-labelledby', `tab-${category}`);

  const intro = makeElement('p', 'tools-subtitle', catalog.introduction);
  toolResults.appendChild(intro);
  const grid = makeElement('div', 'tool-grid');
  catalog.tools.forEach(tool => {
    const article = makeElement('article', 'tool-card');
    const title = makeElement('h3', '', tool.name);
    const description = makeElement('p', '', tool.description);
    const link = makeElement('a', '', 'Open official site ↗');
    link.href = tool.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Open ${tool.name} official website in a new tab`);
    article.append(title, description, link);
    grid.appendChild(article);
  });
  toolResults.appendChild(grid);
  const example = makeElement('div', 'tool-example');
  const head = makeElement('div', 'tool-example-head');
  head.appendChild(makeElement('span', '', 'SAFE PRACTICE PROMPT'));
  const copyButton = makeElement('button', 'copy-button', 'Copy prompt');
  copyButton.type = 'button';
  copyButton.dataset.copyText = catalog.example;
  head.appendChild(copyButton);
  example.appendChild(head);
  example.appendChild(makeElement('p', '', catalog.example));
  toolResults.appendChild(example);
}
function switchCategory(category, focusTab = false) {
  tabs.forEach(tab => {
    const chosen = tab.dataset.category === category;
    tab.classList.toggle('active', chosen);
    tab.setAttribute('aria-selected', String(chosen));
    tab.tabIndex = chosen ? 0 : -1;
    if (chosen && focusTab) tab.focus();
  });
  renderTools(category);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => switchCategory(tab.dataset.category));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    switchCategory(tabs[next].dataset.category, true);
  });
});
switchCategory('text');

let toastTimeout;
const toast = document.getElementById('copy-toast');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2100);
}
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* local fallback below */ }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.readOnly = true;
  area.style.position = 'fixed';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  let success = false;
  try { success = document.execCommand('copy'); } catch (_) { success = false; }
  area.remove();
  return success;
}
document.addEventListener('click', async event => {
  const btn = event.target.closest('.copy-button');
  if (!btn) return;
  const target = btn.dataset.copyTarget ? document.getElementById(btn.dataset.copyTarget) : null;
  const text = target ? target.textContent.trim() : btn.dataset.copyText;
  if (!text) return;
  const copied = await copyToClipboard(text);
  if (copied) {
    btn.classList.add('copied');
    btn.textContent = 'Copied ✓';
    window.setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy prompt'; }, 1800);
    showToast('Prompt copied. Paste it into your chosen AI tool.');
  } else {
    showToast('Copy unavailable here. Select the prompt text and copy it manually.');
  }
});

const quizAnswers = [
  {
    explanation: 'This is usually a predefined required-field check, not an AI task.'
  },
  {
    explanation: 'It might use a trained classifier, or simple keyword rules. The description alone does not tell us.'
  },
  {
    explanation: 'Displaying a total is ordinary calculation or analytics; it does not require AI.'
  },
  {
    explanation: 'An unusual trend could be found using a simple threshold or an AI model. We need details.'
  }
];
const quiz = document.getElementById('ai-quiz');
const checkQuiz = document.getElementById('check-quiz');
const resetQuiz = document.getElementById('reset-quiz');
const quizResult = document.getElementById('quiz-result');
if (quiz && checkQuiz && resetQuiz) {
  checkQuiz.addEventListener('click', () => {
    let correct = 0;
    const questions = Array.from(quiz.querySelectorAll('fieldset'));
    let answered = 0;
    questions.forEach((fieldset, index) => {
      const chosen = fieldset.querySelector('input:checked');
      const feedback = fieldset.querySelector('.quiz-feedback');
      const expected = fieldset.dataset.answer;
      if (!chosen) {
        feedback.textContent = 'Choose an answer to check this question.';
        feedback.className = 'quiz-feedback bad';
        return;
      }
      answered++;
      if (chosen.value === expected) {
        correct++;
        feedback.textContent = `Correct. ${quizAnswers[index].explanation}`;
        feedback.className = 'quiz-feedback good';
      } else {
        feedback.textContent = `Consider this: ${quizAnswers[index].explanation}`;
        feedback.className = 'quiz-feedback bad';
      }
    });
    quizResult.textContent = `${correct} of ${questions.length} correct · ${answered} answered`;
  });
  resetQuiz.addEventListener('click', () => {
    quiz.querySelectorAll('input').forEach(input => input.checked = false);
    quiz.querySelectorAll('.quiz-feedback').forEach(el => { el.textContent = ''; el.className = 'quiz-feedback'; });
    quizResult.textContent = '';
  });
}

const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const sectionLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main > section[id]'));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const active = `#${entry.target.id}`;
      sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === active));
    });
  }, {rootMargin: '-100px 0px -60% 0px', threshold: 0});
  sections.forEach(section => sectionObserver.observe(section));
}
