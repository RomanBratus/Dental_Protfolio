/**
 * Interactive Before / After Split Comparison Slider & Case Showcase
 */

const casesDatabase = [
  {
    id: 'case-1',
    category: 'aligners',
    title: 'Виправлення скупченості зубів елайнерами Invisalign',
    diagnosis: 'Скупченість різців верхньої та нижньої щелеп, дефіцит місця 4 мм',
    duration: '11 місяців',
    apparatus: 'Invisalign Full (24 капи)',
    patientAge: '28 років',
    imageBefore: 'assets/images/1.jpg',
    imageAfter: 'assets/images/2.jpg',
    fallbackBefore: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    fallbackAfter: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    summary: 'Повне вирівнювання зубних дуг без видалення премолярів. Створено ідеальну естетичну лінію посмішки.'
  },
  {
    id: 'case-2',
    category: 'braces-ceramic',
    title: 'Корекція глибокого прикусу керамічною брекет-системою',
    diagnosis: 'Глибокий дистальний прикус II клас 1 підклас, протрузія верхніх різців',
    duration: '16 місяців',
    apparatus: 'Damon Clear (сапфірово-керамічна система)',
    patientAge: '22 роки',
    imageBefore: 'assets/images/3.jpg',
    imageAfter: 'assets/images/4.jpg',
    fallbackBefore: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80',
    fallbackAfter: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=1200&q=80',
    summary: 'Нормалізовано перекриття різців, досягнуто стабільного контакту молярів та виразного підборіддя.'
  },
  {
    id: 'case-3',
    category: 'braces-metal',
    title: 'Самолігуючі металеві брекети Damon Q2',
    diagnosis: 'Ротація іклів, звуження верхньої щелепи, асиметрія оклюзії',
    duration: '14 місяців',
    apparatus: 'Damon Q2 (Ormco, США)',
    patientAge: '19 років',
    imageBefore: 'assets/images/5.jpg',
    imageAfter: 'assets/images/6.jpg',
    fallbackBefore: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    fallbackAfter: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    summary: 'Швидке розширення зубних дуг за рахунок біологічно адаптованих слабких сил. Візити раз на 8 тижнів.'
  },
  {
    id: 'case-4',
    category: 'complex',
    title: 'Комплексний гнатологічний випадок та корекція СНЩС',
    diagnosis: 'Дисфункція скронево-нижньощелепного суглоба, хронічний спазм жувальних м’язів',
    duration: '18 місяців',
    apparatus: 'Сплінт-терапія (оклюзійна шина) + комбіновані брекети',
    patientAge: '34 роки',
    imageBefore: 'assets/images/7.jpg',
    imageAfter: 'assets/images/8.jpg',
    fallbackBefore: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    fallbackAfter: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    summary: 'Повне зникнення больового синдрому та клацання в суглобі. Ідеальна функціональна оклюзія.'
  }
];

class ComparisonSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.beforeWrapper = this.container.querySelector('.comparison-image-before-wrapper');
    this.beforeImg = this.container.querySelector('.comparison-image-before');
    this.afterImg = this.container.querySelector('.comparison-image-after');
    this.handle = this.container.querySelector('.comparison-handle');

    this.infoTitle = document.getElementById('case-active-title');
    this.infoDiagnosis = document.getElementById('case-active-diagnosis');
    this.infoDuration = document.getElementById('case-active-duration');
    this.infoApparatus = document.getElementById('case-active-apparatus');
    this.infoAge = document.getElementById('case-active-age');
    this.infoSummary = document.getElementById('case-active-summary');

    this.isDragging = false;
    this.currentCaseIndex = 0;

    this.init();
    this.bindEvents();
  }

  init() {
    this.updateSlider(50);
    this.loadCase(0);
  }

  updateSlider(percent) {
    percent = Math.max(0, Math.min(100, percent));
    if (this.beforeWrapper) this.beforeWrapper.style.width = `${percent}%`;
    if (this.handle) this.handle.style.left = `${percent}%`;

    // Ensure image retains proper container width for seamless pixel alignment
    if (this.beforeImg && this.container) {
      this.beforeImg.style.width = `${this.container.offsetWidth}px`;
    }
  }

  loadCase(index) {
    const caseData = casesDatabase[index];
    if (!caseData) return;

    this.currentCaseIndex = index;

    if (this.beforeImg) {
      this.beforeImg.onerror = () => {
        this.beforeImg.src = caseData.fallbackBefore;
      };
      this.beforeImg.src = caseData.imageBefore;
    }

    if (this.afterImg) {
      this.afterImg.onerror = () => {
        this.afterImg.src = caseData.fallbackAfter;
      };
      this.afterImg.src = caseData.imageAfter;
    }

    if (this.infoTitle) this.infoTitle.textContent = caseData.title;
    if (this.infoDiagnosis) this.infoDiagnosis.textContent = caseData.diagnosis;
    if (this.infoDuration) this.infoDuration.textContent = caseData.duration;
    if (this.infoApparatus) this.infoApparatus.textContent = caseData.apparatus;
    if (this.infoAge) this.infoAge.textContent = caseData.patientAge;
    if (this.infoSummary) this.infoSummary.textContent = caseData.summary;

    // Reset slider to center
    this.updateSlider(50);
  }

  bindEvents() {
    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const rect = this.container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      this.updateSlider(percent);
    };

    // Mouse Events
    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      onMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Events
    this.container.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      if (e.touches[0]) onMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('resize', () => {
      if (this.beforeImg && this.container) {
        this.beforeImg.style.width = `${this.container.offsetWidth}px`;
      }
    });

    // Filter Buttons
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        if (filter === 'all') {
          this.loadCase(0);
        } else {
          const matchIndex = casesDatabase.findIndex(c => c.category === filter);
          if (matchIndex !== -1) {
            this.loadCase(matchIndex);
          }
        }
      });
    });

    // Thumbnail Cards Click
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.loadCase(index % casesDatabase.length);
        this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ComparisonSlider('comparison-slider-stage');
});
