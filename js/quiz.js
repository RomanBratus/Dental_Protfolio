/**
 * Interactive Treatment Selector Quiz
 * Recommends optimal orthodontic system based on patient preferences
 */

const quizData = [
  {
    step: 1,
    indicator: 'Крок 1 з 3',
    question: 'Яка ваша головна мета лікування?',
    options: [
      { id: 'crowding', icon: 'fa-solid fa-tooth', label: 'Вирівняти скупчені зуби' },
      { id: 'bite', icon: 'fa-solid fa-arrows-to-dot', label: 'Виправити прикус та профіль' },
      { id: 'prosthetics', icon: 'fa-solid fa-wand-magic-sparkles', label: 'Підготовка до вінірів / імплантів' },
      { id: 'child', icon: 'fa-solid fa-child-reaching', label: 'Огляд дитини (6-12 років)' }
    ]
  },
  {
    step: 2,
    indicator: 'Крок 2 з 3',
    question: 'Що для вас є найважливішим фактором?',
    options: [
      { id: 'invisible', icon: 'fa-solid fa-eye-slash', label: 'Максимальна непомітність' },
      { id: 'fast', icon: 'fa-solid fa-bolt', label: 'Найшвидший результат' },
      { id: 'budget', icon: 'fa-solid fa-shield-halved', label: 'Баланс ціни та надійності' },
      { id: 'comfort', icon: 'fa-solid fa-heart', label: 'Зручність без обмежень у їжі' }
    ]
  },
  {
    step: 3,
    indicator: 'Крок 3 з 3',
    question: 'Вік пацієнта, для якого планується лікування:',
    options: [
      { id: 'age-child', icon: 'fa-solid fa-baby', label: '6 – 12 років' },
      { id: 'age-teen', icon: 'fa-solid fa-user-graduate', label: '13 – 17 років' },
      { id: 'age-adult', icon: 'fa-solid fa-user', label: '18 – 35 років' },
      { id: 'age-mature', icon: 'fa-solid fa-user-tie', label: '36+ років' }
    ]
  }
];

class TreatmentQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentStep = 0;
    this.answers = {};

    this.progressFill = this.container.querySelector('.quiz-progress-fill');
    this.stepIndicator = this.container.querySelector('.quiz-step-indicator');
    this.questionTitle = this.container.querySelector('.quiz-question-title');
    this.optionsGrid = this.container.querySelector('.quiz-options-grid');
    this.prevBtn = this.container.querySelector('.quiz-prev-btn');
    this.nextBtn = this.container.querySelector('.quiz-next-btn');
    this.quizCard = this.container.querySelector('.quiz-card-interactive');
    this.resultBox = this.container.querySelector('.quiz-result-box');

    this.resultTitle = document.getElementById('quiz-result-title');
    this.resultDesc = document.getElementById('quiz-result-desc');
    this.resultBadge = document.getElementById('quiz-result-badge');

    this.init();
    this.bindEvents();
  }

  init() {
    this.renderStep(0);
  }

  renderStep(stepIndex) {
    const step = quizData[stepIndex];
    if (!step) return;

    this.currentStep = stepIndex;

    // Update Progress
    const scale = (stepIndex + 1) / quizData.length;
    if (this.progressFill) this.progressFill.style.transform = `scaleX(${scale})`;
    if (this.stepIndicator) this.stepIndicator.textContent = step.indicator;
    if (this.questionTitle) this.questionTitle.textContent = step.question;

    // Render Options
    if (this.optionsGrid) {
      this.optionsGrid.innerHTML = '';
      step.options.forEach((opt) => {
        const isSelected = this.answers[stepIndex] === opt.id;
        const optCard = document.createElement('div');
        optCard.className = `quiz-option-card ${isSelected ? 'selected' : ''}`;
        optCard.innerHTML = `
          <div class="quiz-option-icon"><i class="${opt.icon}"></i></div>
          <span class="quiz-option-text">${opt.label}</span>
        `;
        optCard.addEventListener('click', () => {
          this.answers[stepIndex] = opt.id;
          this.optionsGrid.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
          optCard.classList.add('selected');
          if (this.nextBtn) this.nextBtn.removeAttribute('disabled');
        });
        this.optionsGrid.appendChild(optCard);
      });
    }

    // Toggle Back button
    if (this.prevBtn) {
      this.prevBtn.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
    }

    // Update Next button label
    if (this.nextBtn) {
      this.nextBtn.textContent = stepIndex === quizData.length - 1 ? 'Отримати розрахунок' : 'Далі';
      if (!this.answers[stepIndex]) {
        this.nextBtn.setAttribute('disabled', 'true');
      } else {
        this.nextBtn.removeAttribute('disabled');
      }
    }
  }

  calculateResult() {
    const goal = this.answers[0];
    const priority = this.answers[1];
    const age = this.answers[2];

    let system = {
      badge: 'Преміальні Елайнери Invisalign',
      title: 'Прозорі елайнери Invisalign (США)',
      desc: 'Ідеальне рішення для вашого запиту: 100% непомітні прозорі капи з надточним 3D-моделюванням результату ще до початку лікування. Знімаються під час їжі та чищення зубів.'
    };

    if (age === 'age-child') {
      system = {
        badge: 'Раннє дитяче лікування',
        title: 'Апарати Marco Rosa & функціональні пластинки',
        desc: 'Спеціально розроблено для м’якої корекції росту щелеп, усунення шкідливих звичок та створення простору для постійних зубів без дискомфорту.'
      };
    } else if (priority === 'fast' || goal === 'bite') {
      system = {
        badge: 'Швидкість та точність',
        title: 'Самолігуючі брекети Damon Q2 (Ormco, США)',
        desc: 'Високотехнологічні пасивні замки зменшують тертя, скорочують термін лікування на 4-6 місяців і вимагають візитів до лікаря лише 1 раз на 8 тижнів.'
      };
    } else if (priority === 'invisible' && goal !== 'child') {
      system = {
        badge: 'Естетичний фаворит',
        title: 'Сапфірово-керамічні брекети Damon Clear',
        desc: 'Повністю зливаються з кольором власної емалі, не фарбуються кавою чи їжею та забезпечують бездоганну естетику посмішки протягом усього лікування.'
      };
    }

    // Show Result
    if (this.quizCard) this.quizCard.style.display = 'none';
    if (this.resultBox) {
      this.resultBox.style.display = 'block';
      if (this.resultBadge) this.resultBadge.textContent = system.badge;
      if (this.resultTitle) this.resultTitle.textContent = system.title;
      if (this.resultDesc) this.resultDesc.textContent = system.desc;
    }
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (!this.answers[this.currentStep]) return;
        if (this.currentStep < quizData.length - 1) {
          this.renderStep(this.currentStep + 1);
        } else {
          this.calculateResult();
        }
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.currentStep > 0) {
          this.renderStep(this.currentStep - 1);
        }
      });
    }

    // Book with recommendation button
    const bookWithQuizBtn = document.getElementById('quiz-book-cta');
    if (bookWithQuizBtn) {
      bookWithQuizBtn.addEventListener('click', () => {
        const select = document.getElementById('service-select');
        if (select && this.resultTitle) {
          select.value = 'consultation';
        }
        const comment = document.getElementById('booking-comment');
        if (comment && this.resultTitle) {
          comment.value = `Результат онлайн-тесту: ${this.resultTitle.textContent}`;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TreatmentQuiz('quiz-container');
});
