'use strict';

const APP_VERSION = '0.1.0';
const MAX_SHARED_TASKS = 30;
const STUDENT_PAGE_SIZE = 18;
const TEACHER_PAGE_SIZE = 45;

const TOPICS = {
  komputer: {
    name: 'Komputer i pliki',
    icon: '🗂️',
    color: '#5b4bdb',
    description: 'Urządzenia, foldery, formaty plików, kopie i porządek cyfrowy.'
  },
  internet: {
    name: 'Internet i wyszukiwanie',
    icon: '🔎',
    color: '#1677c8',
    description: 'Przeglądarka, wyszukiwarki, adresy stron i wiarygodność źródeł.'
  },
  bezpieczenstwo: {
    name: 'Cyberbezpieczeństwo',
    icon: '🛡️',
    color: '#c34862',
    description: 'Hasła, phishing, prywatność, aktualizacje i reagowanie na incydenty.'
  },
  algorytmy: {
    name: 'Logika i algorytmy',
    icon: '🧩',
    color: '#8d5bbf',
    description: 'Sekwencje, warunki, pętle, błędy i rozwiązywanie problemów.'
  },
  dane: {
    name: 'Dane i arkusz',
    icon: '📊',
    color: '#138b70',
    description: 'Tabele, formuły, wykresy, sortowanie, filtrowanie i interpretacja.'
  },
  tworzenie: {
    name: 'Tworzenie cyfrowe',
    icon: '🎨',
    color: '#d36b29',
    description: 'Dokumenty, grafika, prezentacje, multimedia i proste strony WWW.'
  },
  ai: {
    name: 'AI z głową',
    icon: '🤖',
    color: '#7b50c7',
    description: 'Dobre pytania, weryfikacja odpowiedzi, prywatność i odpowiedzialność.'
  },
  sieci: {
    name: 'Sieci i WWW',
    icon: '🌐',
    color: '#0086a8',
    description: 'Wi-Fi, router, serwer, DNS, adresy IP i droga danych w sieci.'
  },
  prawo: {
    name: 'Prawo i kultura cyfrowa',
    icon: '⚖️',
    color: '#9b6a19',
    description: 'Prawa autorskie, licencje, netykieta, współpraca i cyfrowy ślad.'
  }
};

const TASK_TYPES = {
  choice: { name: 'Jedna odpowiedź', icon: '◉' },
  multi: { name: 'Kilka odpowiedzi', icon: '☑' },
  order: { name: 'Ułóż kolejność', icon: '↕' },
  match: { name: 'Połącz pary', icon: '🔗' },
  sort: { name: 'Przyporządkuj', icon: '🧺' },
  input: { name: 'Wpisz odpowiedź', icon: '⌨️' }
};

const DIFFICULTY = {
  1: { name: 'Rozgrzewka', icon: '●○○' },
  2: { name: 'Wyzwanie', icon: '●●○' },
  3: { name: 'Misja specjalna', icon: '●●●' }
};

const PRESETS = {
  safe34: {
    title: 'Bezpieczny internet, klasy 3–4',
    grades: [3, 4],
    topics: ['bezpieczenstwo', 'internet', 'prawo'],
    count: 10
  },
  ai78: {
    title: 'AI i wiarygodne źródła, klasy 7–8',
    grades: [7, 8],
    topics: ['ai', 'internet', 'prawo'],
    count: 12
  },
  logic56: {
    title: 'Algorytmiczna rozgrzewka, klasy 5–6',
    grades: [5, 6],
    topics: ['algorytmy', 'dane'],
    count: 10
  },
  digital46: {
    title: 'Cyfrowy warsztat, klasy 4–6',
    grades: [4, 5, 6],
    topics: ['komputer', 'tworzenie', 'sieci'],
    count: 12
  }
};

const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const confettiLayer = document.querySelector('#confetti-layer');
const themeSelect = document.querySelector('#theme-select');

const state = {
  tasks: [],
  taskMap: new Map(),
  view: 'home',
  student: {
    grade: 3,
    topic: 'all',
    difficulty: 'all',
    search: '',
    count: 10,
    limit: STUDENT_PAGE_SIZE
  },
  teacher: {
    grades: new Set([3, 4]),
    topics: new Set(Object.keys(TOPICS)),
    difficulty: 'all',
    type: 'all',
    search: '',
    selected: new Set(),
    title: 'Cyfrowe misje',
    limit: TEACHER_PAGE_SIZE
  },
  shared: null,
  session: null,
  toastTimer: null
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  themeSelect.value = document.documentElement.dataset.theme || 'system';
  themeSelect.addEventListener('change', onThemeChange);
  document.addEventListener('click', onGlobalClick);
  app.addEventListener('click', onAppClick);
  app.addEventListener('change', onAppChange);
  app.addEventListener('input', onAppInput);
  window.addEventListener('popstate', () => {
    const shared = parseSharedLink();
    if (shared) {
      state.shared = shared;
      navigate('shared', { scroll: false });
    }
  });

  try {
    const response = await fetch('./data/tasks.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const tasks = await response.json();
    if (!Array.isArray(tasks) || tasks.length === 0) throw new Error('Brak zadań');

    state.tasks = tasks;
    state.taskMap = new Map(tasks.map((task) => [task.id, task]));
    const shared = parseSharedLink();
    if (shared) {
      state.shared = shared;
      state.view = 'shared';
    }
    render();
    registerServiceWorker();
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="error-screen">
        <div class="shared-icon" aria-hidden="true">🔌</div>
        <h1>Nie udało się wczytać zadań</h1>
        <p>Uruchom aplikację przez serwer WWW lub odśwież stronę. Szczegóły są dostępne w instrukcji repozytorium.</p>
        <button class="btn btn-primary" type="button" onclick="location.reload()">Spróbuj ponownie</button>
      </section>`;
  }
}

function onThemeChange(event) {
  const theme = event.target.value;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('misja-informatyka-theme', theme);
  } catch {
    // Zmiana motywu nadal działa, nawet gdy przeglądarka blokuje zapis lokalny.
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#191e2b' : '#5b4bdb';
}

function onGlobalClick(event) {
  const viewButton = event.target.closest('[data-view]');
  if (!viewButton) return;
  const targetView = viewButton.dataset.view;
  if (!targetView) return;
  event.preventDefault();

  if (state.view === 'quiz' && state.session && targetView !== 'quiz') {
    const confirmed = window.confirm('Trwa zestaw zadań. Czy na pewno chcesz go opuścić? Wynik tej sesji nie zostanie zapisany.');
    if (!confirmed) return;
  }
  navigate(targetView);
}

function onAppClick(event) {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  const action = actionElement.dataset.action;

  switch (action) {
    case 'student-grade':
      state.student.grade = Number(actionElement.dataset.grade);
      state.student.limit = STUDENT_PAGE_SIZE;
      renderStudent();
      break;
    case 'student-topic':
      state.student.topic = actionElement.dataset.topic;
      state.student.limit = STUDENT_PAGE_SIZE;
      renderStudent();
      break;
    case 'home-topic':
      state.student.topic = actionElement.dataset.topic;
      state.student.limit = STUDENT_PAGE_SIZE;
      navigate('student');
      break;
    case 'start-student-random':
      startStudentRandom();
      break;
    case 'start-single-task':
      startSingleTask(actionElement.dataset.taskId);
      break;
    case 'student-more':
      state.student.limit += STUDENT_PAGE_SIZE;
      updateStudentCatalog();
      break;
    case 'teacher-random':
      teacherRandomSelection(Number(actionElement.dataset.count || 10));
      break;
    case 'teacher-select-visible':
      teacherSelectVisible();
      break;
    case 'teacher-clear':
      state.teacher.selected.clear();
      renderTeacher();
      break;
    case 'teacher-remove':
      state.teacher.selected.delete(actionElement.dataset.taskId);
      updateTeacherSelectionUI();
      updateTeacherTaskRow(actionElement.dataset.taskId, false);
      break;
    case 'teacher-more':
      state.teacher.limit += TEACHER_PAGE_SIZE;
      updateTeacherTaskList();
      break;
    case 'teacher-preset':
      applyTeacherPreset(actionElement.dataset.preset);
      break;
    case 'teacher-shuffle':
      shuffleTeacherSelection();
      break;
    case 'copy-set-link':
      copyTeacherLink();
      break;
    case 'share-set-link':
      shareTeacherLink();
      break;
    case 'open-set-link':
      openTeacherLink();
      break;
    case 'download-set':
      downloadTeacherSet();
      break;
    case 'start-shared':
      startSharedSet();
      break;
    case 'check-answer':
      checkCurrentAnswer();
      break;
    case 'next-task':
      goToNextTask();
      break;
    case 'skip-task':
      skipCurrentTask();
      break;
    case 'move-order':
      moveOrderItem(Number(actionElement.dataset.index), Number(actionElement.dataset.direction));
      break;
    case 'exit-quiz':
      exitQuiz();
      break;
    case 'repeat-all':
      repeatAllTasks();
      break;
    case 'repeat-missed':
      repeatMissedTasks();
      break;
    case 'print-certificate':
      window.print();
      break;
    case 'copy-result':
      copyResult();
      break;
    default:
      break;
  }
}

function onAppChange(event) {
  const target = event.target;

  if (target.id === 'student-difficulty') {
    state.student.difficulty = target.value;
    state.student.limit = STUDENT_PAGE_SIZE;
    updateStudentCatalog();
  }
  if (target.id === 'student-count') {
    state.student.count = Number(target.value);
  }
  if (target.matches('[data-teacher-grade]')) {
    toggleSetValue(state.teacher.grades, Number(target.value), target.checked);
    state.teacher.limit = TEACHER_PAGE_SIZE;
    renderTeacher();
  }
  if (target.matches('[data-teacher-topic]')) {
    toggleSetValue(state.teacher.topics, target.value, target.checked);
    state.teacher.limit = TEACHER_PAGE_SIZE;
    renderTeacher();
  }
  if (target.id === 'teacher-difficulty') {
    state.teacher.difficulty = target.value;
    state.teacher.limit = TEACHER_PAGE_SIZE;
    renderTeacher();
  }
  if (target.id === 'teacher-type') {
    state.teacher.type = target.value;
    state.teacher.limit = TEACHER_PAGE_SIZE;
    renderTeacher();
  }
  if (target.matches('[data-task-select]')) {
    const id = target.dataset.taskSelect;
    if (target.checked && state.teacher.selected.size >= MAX_SHARED_TASKS) {
      target.checked = false;
      showToast(`Jeden zestaw może zawierać maksymalnie ${MAX_SHARED_TASKS} zadań.`);
      return;
    }
    if (target.checked) state.teacher.selected.add(id);
    else state.teacher.selected.delete(id);
    updateTeacherTaskRow(id, target.checked);
    updateTeacherSelectionUI();
  }
}

let inputTimer = null;
function onAppInput(event) {
  const target = event.target;

  if (target.id === 'student-search') {
    state.student.search = target.value;
    state.student.limit = STUDENT_PAGE_SIZE;
    clearTimeout(inputTimer);
    inputTimer = setTimeout(updateStudentCatalog, 120);
  }
  if (target.id === 'teacher-search') {
    state.teacher.search = target.value;
    state.teacher.limit = TEACHER_PAGE_SIZE;
    clearTimeout(inputTimer);
    inputTimer = setTimeout(updateTeacherTaskList, 120);
  }
  if (target.id === 'teacher-title') {
    state.teacher.title = target.value.slice(0, 80);
    updateTeacherShareBox();
  }
}

function toggleSetValue(set, value, enabled) {
  if (enabled) set.add(value);
  else set.delete(value);
}

function navigate(view, options = {}) {
  state.view = view;
  render();
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
  requestAnimationFrame(() => app.focus({ preventScroll: true }));
}

function render() {
  updateNavigation();
  switch (state.view) {
    case 'student':
      renderStudent();
      break;
    case 'teacher':
      renderTeacher();
      break;
    case 'shared':
      renderShared();
      break;
    case 'quiz':
      renderQuiz();
      break;
    case 'result':
      renderResult();
      break;
    case 'about':
      renderAbout();
      break;
    case 'home':
    default:
      renderHome();
      break;
  }
}

function updateNavigation() {
  document.querySelectorAll('.main-nav [data-view]').forEach((button) => {
    const active = button.dataset.view === state.view;
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function renderHome() {
  const topicCards = Object.entries(TOPICS).map(([key, topic]) => {
    const count = state.tasks.filter((task) => task.topic === key).length;
    return `
      <article class="topic-card" style="--topic-color:${topic.color}">
        <div class="topic-icon" aria-hidden="true">${topic.icon}</div>
        <h3>${escapeHtml(topic.name)}</h3>
        <p>${escapeHtml(topic.description)}</p>
        <div class="card-meta">
          <button class="btn btn-small" type="button" data-action="home-topic" data-topic="${key}">${count} zadań</button>
        </div>
      </article>`;
  }).join('');

  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Nauka przez krótkie cyfrowe misje</p>
        <h1>Informatyka bez nudy i bez konta.</h1>
        <p>Uczeń wybiera klasę i temat albo otwiera zestaw przygotowany przez nauczyciela. Zadania uczą myślenia, bezpieczeństwa i świadomego korzystania z technologii.</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-large" type="button" data-view="student">🚀 Rozpocznij misję</button>
          <button class="btn btn-large" type="button" data-view="teacher">🧑‍🏫 Przygotuj zestaw</button>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="mission-console">
          <div class="console-top"><span class="console-dot"></span><span class="console-dot"></span><span class="console-dot"></span></div>
          <div class="console-screen">
            <small>MISJA 04 · BEZPIECZEŃSTWO</small>
            <strong>Która wiadomość wygląda podejrzanie?</strong>
            <div class="console-options">
              <div class="console-option">Plan lekcji został zaktualizowany</div>
              <div class="console-option active">Wygrałeś! Podaj hasło w 5 minut</div>
              <div class="console-option">Spotkanie koła o 14:00</div>
            </div>
          </div>
          <div class="console-footer"><span>⭐ 8</span><span>4 z 10</span></div>
        </div>
      </div>
    </section>

    <section class="stats-grid" aria-label="Informacje o aplikacji">
      ${statCard(state.tasks.length, 'gotowe zadania')}
      ${statCard('6', 'poziomów, klasy 3–8')}
      ${statCard(Object.keys(TOPICS).length, 'obszarów tematycznych')}
      ${statCard(Object.keys(TASK_TYPES).length, 'rodzajów interakcji')}
    </section>

    <section class="section-block">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Duży wybór, krótka forma</p>
          <h2>Wybierz kierunek wyprawy</h2>
          <p>Każdy temat zawiera zadania dla kilku klas i różnych poziomów trudności.</p>
        </div>
      </div>
      <div class="topic-grid">${topicCards}</div>
    </section>

    <section class="section-block panel">
      <div class="panel-title">
        <div>
          <h2>Dwa sposoby korzystania</h2>
          <p>Bez logowania, bazy danych i przechowywania wyników dzieci.</p>
        </div>
        <span class="badge badge-build">🚧 Wersja rozwojowa</span>
      </div>
      <div class="about-grid">
        <article class="about-card">
          <h3>🧭 Uczeń wybiera sam</h3>
          <p>Może wybrać klasę, temat, trudność i liczbę zadań albo otworzyć pojedynczą misję z katalogu.</p>
          <button class="btn btn-primary" type="button" data-view="student">Przejdź do zadań</button>
        </article>
        <article class="about-card">
          <h3>🧰 Nauczyciel układa zestaw</h3>
          <p>Może filtrować katalog, zaznaczyć konkretne zadania i wysłać uczniom gotowy link.</p>
          <button class="btn" type="button" data-view="teacher">Otwórz kreator</button>
        </article>
      </div>
    </section>`;
}

function statCard(value, label) {
  return `<div class="stat-card"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></div>`;
}

function renderStudent() {
  const filtered = getStudentFilteredTasks();
  const topicButtons = [
    `<button class="chip ${state.student.topic === 'all' ? 'active' : ''}" type="button" data-action="student-topic" data-topic="all">Wszystkie</button>`,
    ...Object.entries(TOPICS).map(([key, topic]) => `
      <button class="chip ${state.student.topic === key ? 'active' : ''}" type="button" data-action="student-topic" data-topic="${key}">${topic.icon} ${escapeHtml(topic.name)}</button>`)
  ].join('');

  app.innerHTML = `
    <header class="page-heading">
      <div>
        <p class="eyebrow">Tryb ucznia</p>
        <h1>Wybierz własną misję</h1>
        <p>Nie musisz przechodzić wszystkiego po kolei. Wybierz temat, który chcesz poćwiczyć dzisiaj.</p>
      </div>
      <div class="badge-row">
        <span class="badge badge-primary">${state.tasks.length} zadań</span>
        <span class="badge">Bez logowania</span>
      </div>
    </header>

    <div class="student-layout">
      <section class="panel">
        <div class="panel-title">
          <div><h2>1. Dopasuj poziom</h2><p>Zadania są przypisane do konkretnej klasy, ale możesz swobodnie eksperymentować.</p></div>
        </div>
        <div class="segmented" aria-label="Wybór klasy">
          ${[3,4,5,6,7,8].map((grade) => `<button type="button" class="${state.student.grade === grade ? 'active' : ''}" data-action="student-grade" data-grade="${grade}">Klasa ${grade}</button>`).join('')}
        </div>

        <div class="section-block" style="margin-top:28px">
          <div class="panel-title"><div><h2>2. Wybierz temat</h2><p>Możesz także pozostawić wszystkie tematy i zdać się na losowanie.</p></div></div>
          <div class="chip-group">${topicButtons}</div>
        </div>

        <div class="filter-grid" style="margin-top:24px">
          <label class="field">
            <span>Poziom trudności</span>
            <select id="student-difficulty">
              <option value="all" ${state.student.difficulty === 'all' ? 'selected' : ''}>Wszystkie poziomy</option>
              ${Object.entries(DIFFICULTY).map(([value, item]) => `<option value="${value}" ${String(state.student.difficulty) === value ? 'selected' : ''}>${item.name}</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Liczba zadań w zestawie</span>
            <select id="student-count">
              ${[5,10,15,20].map((count) => `<option value="${count}" ${state.student.count === count ? 'selected' : ''}>${count} zadań</option>`).join('')}
            </select>
          </label>
          <label class="field" style="grid-column:span 2">
            <span>Szukaj w katalogu</span>
            <input id="student-search" type="search" value="${escapeAttr(state.student.search)}" placeholder="Np. hasło, wykres, AI, router…">
          </label>
        </div>
      </section>

      <aside class="panel sticky-panel quick-start">
        <div>
          <p class="eyebrow">Szybki start</p>
          <h2 style="margin:0">Gotowy zestaw</h2>
          <p style="color:var(--muted)">${filtered.length} pasujących zadań w katalogu.</p>
        </div>
        <button class="btn btn-primary btn-large" type="button" data-action="start-student-random" ${filtered.length ? '' : 'disabled'}>🎲 Losuj ${Math.min(state.student.count, filtered.length || state.student.count)} zadań</button>
        <div class="mini-note">Wynik istnieje tylko podczas bieżącej sesji. Po zakończeniu zobaczysz fanfary, odznakę i podsumowanie.</div>
      </aside>
    </div>

    <section class="section-block panel">
      <div class="panel-title">
        <div><h2>Przeglądaj pojedyncze zadania</h2><p>Otwórz konkretną misję bez losowania całego zestawu.</p></div>
      </div>
      <div id="student-catalog">${studentCatalogMarkup(filtered)}</div>
    </section>`;
}

function getStudentFilteredTasks() {
  const query = normalizeText(state.student.search);
  return state.tasks.filter((task) => {
    if (!task.grades.includes(state.student.grade)) return false;
    if (state.student.topic !== 'all' && task.topic !== state.student.topic) return false;
    if (state.student.difficulty !== 'all' && task.difficulty !== Number(state.student.difficulty)) return false;
    if (query && !taskSearchText(task).includes(query)) return false;
    return true;
  });
}

function studentCatalogMarkup(filtered = getStudentFilteredTasks()) {
  const visible = filtered.slice(0, state.student.limit);
  if (filtered.length === 0) {
    return `<div class="empty-state"><span class="empty-icon">🛰️</span><strong>Brak zadań dla tych filtrów</strong><p>Zmień temat, trudność albo wyszukiwane słowo.</p></div>`;
  }

  return `
    <div class="catalog-toolbar">
      <span class="catalog-count">Pokazuję ${visible.length} z ${filtered.length} zadań</span>
    </div>
    <div class="task-grid">
      ${visible.map(studentTaskCard).join('')}
    </div>
    ${visible.length < filtered.length ? `<div class="action-row" style="justify-content:center;margin-top:18px"><button class="btn" type="button" data-action="student-more">Pokaż kolejne zadania</button></div>` : ''}`;
}

function studentTaskCard(task) {
  const topic = TOPICS[task.topic];
  const type = TASK_TYPES[task.type];
  return `
    <article class="task-card">
      <div class="meta-row">
        <span class="badge" style="border-color:${topic.color}55">${topic.icon} ${escapeHtml(topic.name)}</span>
        <span class="badge">${type.icon} ${escapeHtml(type.name)}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.story)}</p>
      <div class="task-card-actions">
        <span class="meta-pill">${DIFFICULTY[task.difficulty].icon} ${DIFFICULTY[task.difficulty].name}</span>
        <button class="btn btn-primary btn-small" type="button" data-action="start-single-task" data-task-id="${task.id}">Rozwiąż</button>
      </div>
    </article>`;
}

function updateStudentCatalog() {
  const region = document.querySelector('#student-catalog');
  if (!region) return;
  region.innerHTML = studentCatalogMarkup();
  const quickText = document.querySelector('.quick-start p[style]');
  if (quickText) quickText.textContent = `${getStudentFilteredTasks().length} pasujących zadań w katalogu.`;
}

function startStudentRandom() {
  const filtered = getStudentFilteredTasks();
  if (!filtered.length) {
    showToast('Brak zadań dla wybranych filtrów.');
    return;
  }
  const count = Math.min(state.student.count, filtered.length);
  const tasks = shuffle([...filtered]).slice(0, count);
  const topicName = state.student.topic === 'all' ? 'Różne tematy' : TOPICS[state.student.topic].name;
  startSession(tasks, `${topicName}, klasa ${state.student.grade}`, 'student');
}

function startSingleTask(id) {
  const task = state.taskMap.get(id);
  if (!task) return;
  startSession([task], task.title, 'student');
}

function renderTeacher() {
  const filtered = getTeacherFilteredTasks();
  app.innerHTML = `
    <header class="page-heading">
      <div>
        <p class="eyebrow">Kreator dla nauczyciela</p>
        <h1>Zbuduj zestaw i wyślij link</h1>
        <p>Wybierz konkretne zadania albo wylosuj zestaw z filtrów. Link działa na telefonie, tablecie i komputerze bez konta ucznia.</p>
      </div>
      <div class="badge-row">
        <span class="badge badge-build">🚧 Funkcja rozwijana</span>
        <span class="badge">Maks. ${MAX_SHARED_TASKS} zadań</span>
      </div>
    </header>

    <div class="teacher-layout">
      <div>
        <section class="panel">
          <div class="panel-title"><div><h2>Filtry katalogu</h2><p>Możesz łączyć klasy, tematy i rodzaje interakcji.</p></div></div>

          <div class="field">
            <span>Klasy</span>
            <div class="check-grid">
              ${[3,4,5,6,7,8].map((grade) => `
                <label class="check-chip"><input type="checkbox" value="${grade}" data-teacher-grade ${state.teacher.grades.has(grade) ? 'checked' : ''}>Klasa ${grade}</label>`).join('')}
            </div>
          </div>

          <div class="field" style="margin-top:18px">
            <span>Tematy</span>
            <div class="check-grid">
              ${Object.entries(TOPICS).map(([key, topic]) => `
                <label class="check-chip"><input type="checkbox" value="${key}" data-teacher-topic ${state.teacher.topics.has(key) ? 'checked' : ''}>${topic.icon} ${escapeHtml(topic.name)}</label>`).join('')}
            </div>
          </div>

          <div class="filter-grid" style="margin-top:20px">
            <label class="field"><span>Trudność</span><select id="teacher-difficulty">
              <option value="all" ${state.teacher.difficulty === 'all' ? 'selected' : ''}>Wszystkie</option>
              ${Object.entries(DIFFICULTY).map(([value, item]) => `<option value="${value}" ${String(state.teacher.difficulty) === value ? 'selected' : ''}>${item.name}</option>`).join('')}
            </select></label>
            <label class="field"><span>Rodzaj zadania</span><select id="teacher-type">
              <option value="all" ${state.teacher.type === 'all' ? 'selected' : ''}>Wszystkie</option>
              ${Object.entries(TASK_TYPES).map(([key, item]) => `<option value="${key}" ${state.teacher.type === key ? 'selected' : ''}>${item.name}</option>`).join('')}
            </select></label>
            <label class="field" style="grid-column:span 2"><span>Szukaj</span><input id="teacher-search" type="search" value="${escapeAttr(state.teacher.search)}" placeholder="Tytuł, temat albo słowo z zadania…"></label>
          </div>

          <div class="filter-actions" style="margin-top:17px">
            <button class="btn btn-primary" type="button" data-action="teacher-random" data-count="10">🎲 Losuj 10 z filtrów</button>
            <button class="btn" type="button" data-action="teacher-select-visible">Zaznacz widoczne</button>
            <button class="btn btn-ghost" type="button" data-action="teacher-clear">Wyczyść wybór</button>
          </div>
        </section>

        <section class="panel" style="margin-top:20px">
          <div class="panel-title">
            <div><h2>Katalog zadań</h2><p>${filtered.length} zadań pasuje do wybranych filtrów.</p></div>
          </div>
          <div id="teacher-task-list">${teacherTaskListMarkup(filtered)}</div>
        </section>
      </div>

      <aside class="panel sticky-panel">
        <div id="teacher-sidebar-body">${teacherSidebarMarkup()}</div>
      </aside>
    </div>

    <section class="section-block panel">
      <div class="panel-title"><div><h2>Gotowe pomysły na zestawy</h2><p>Każdy przycisk ustawia filtry i losuje przykładowy zestaw. Możesz go później zmienić.</p></div></div>
      <div class="preset-grid">
        <button class="preset-button" type="button" data-action="teacher-preset" data-preset="safe34">🛡️ Bezpieczny internet<small>Klasy 3–4, 10 zadań</small></button>
        <button class="preset-button" type="button" data-action="teacher-preset" data-preset="logic56">🧩 Algorytmiczna rozgrzewka<small>Klasy 5–6, 10 zadań</small></button>
        <button class="preset-button" type="button" data-action="teacher-preset" data-preset="ai78">🤖 AI i wiarygodne źródła<small>Klasy 7–8, 12 zadań</small></button>
        <button class="preset-button" type="button" data-action="teacher-preset" data-preset="digital46">🗂️ Cyfrowy warsztat<small>Klasy 4–6, 12 zadań</small></button>
      </div>
    </section>`;
}

function getTeacherFilteredTasks() {
  const query = normalizeText(state.teacher.search);
  return state.tasks.filter((task) => {
    if (!task.grades.some((grade) => state.teacher.grades.has(grade))) return false;
    if (!state.teacher.topics.has(task.topic)) return false;
    if (state.teacher.difficulty !== 'all' && task.difficulty !== Number(state.teacher.difficulty)) return false;
    if (state.teacher.type !== 'all' && task.type !== state.teacher.type) return false;
    if (query && !taskSearchText(task).includes(query)) return false;
    return true;
  });
}

function teacherTaskListMarkup(filtered = getTeacherFilteredTasks()) {
  const visible = filtered.slice(0, state.teacher.limit);
  if (!visible.length) {
    return `<div class="empty-state"><span class="empty-icon">🔍</span><strong>Brak zadań</strong><p>Zaznacz inną klasę lub temat.</p></div>`;
  }
  return `
    <div class="catalog-toolbar"><span class="catalog-count">Pokazuję ${visible.length} z ${filtered.length}</span></div>
    <div class="teacher-task-list">
      ${visible.map(teacherTaskRow).join('')}
    </div>
    ${visible.length < filtered.length ? `<div class="action-row" style="justify-content:center;margin-top:16px"><button class="btn" type="button" data-action="teacher-more">Pokaż kolejne</button></div>` : ''}`;
}

function teacherTaskRow(task) {
  const selected = state.teacher.selected.has(task.id);
  const topic = TOPICS[task.topic];
  return `
    <label class="teacher-task-row ${selected ? 'selected' : ''}" data-task-row="${task.id}">
      <input type="checkbox" data-task-select="${task.id}" ${selected ? 'checked' : ''} aria-label="Wybierz zadanie ${escapeAttr(task.title)}">
      <span class="teacher-task-copy">
        <strong>${escapeHtml(task.title)}</strong>
        <small>Klasa ${task.grades.join(', ')} · ${escapeHtml(topic.name)} · ${TASK_TYPES[task.type].name}</small>
      </span>
      <span class="meta-row"><span class="badge">${DIFFICULTY[task.difficulty].icon}</span></span>
    </label>`;
}

function teacherSidebarMarkup() {
  const selectedTasks = [...state.teacher.selected].map((id) => state.taskMap.get(id)).filter(Boolean);
  const link = teacherShareUrl();
  return `
    <div class="panel-title">
      <div><p class="eyebrow">Twój zestaw</p><h2>${selectedTasks.length} / ${MAX_SHARED_TASKS}</h2><p>Wybrane zadania pojawią się w linku w tej kolejności.</p></div>
    </div>

    <label class="field">
      <span>Nazwa zestawu</span>
      <input id="teacher-title" maxlength="80" value="${escapeAttr(state.teacher.title)}" placeholder="Np. Bezpieczny internet">
    </label>

    <div class="selected-list">
      ${selectedTasks.length ? selectedTasks.map((task, index) => `
        <div class="selected-item"><span><strong>${index + 1}.</strong> ${escapeHtml(task.title)}</span><button type="button" data-action="teacher-remove" data-task-id="${task.id}" aria-label="Usuń ${escapeAttr(task.title)}">×</button></div>`).join('') : `
        <div class="empty-state"><span class="empty-icon">📭</span>Wybierz zadania z katalogu.</div>`}
    </div>

    <div class="action-row">
      <button class="btn btn-small" type="button" data-action="teacher-shuffle" ${selectedTasks.length < 2 ? 'disabled' : ''}>Przetasuj</button>
      <button class="btn btn-small btn-ghost" type="button" data-action="teacher-clear" ${selectedTasks.length ? '' : 'disabled'}>Wyczyść</button>
    </div>

    <div class="share-box" id="teacher-share-box">
      <label class="field"><span>Link dla uczniów</span><input class="share-link-input" type="text" readonly value="${escapeAttr(link)}" placeholder="Wybierz przynajmniej jedno zadanie"></label>
      <div class="share-actions">
        <button class="btn btn-primary" type="button" data-action="copy-set-link" ${link ? '' : 'disabled'}>Kopiuj link</button>
        <button class="btn" type="button" data-action="share-set-link" ${link ? '' : 'disabled'}>Udostępnij</button>
        <button class="btn" type="button" data-action="open-set-link" ${link ? '' : 'disabled'}>Podgląd</button>
        <button class="btn btn-ghost" type="button" data-action="download-set" ${link ? '' : 'disabled'}>Pobierz JSON</button>
      </div>
      <div class="mini-note">Link zapisuje wyłącznie identyfikatory zadań i nazwę zestawu. Wyniki uczniów nie są przesyłane nauczycielowi ani na serwer.</div>
    </div>`;
}

function updateTeacherTaskList() {
  const list = document.querySelector('#teacher-task-list');
  if (list) list.innerHTML = teacherTaskListMarkup();
}

function updateTeacherSelectionUI() {
  const sidebar = document.querySelector('#teacher-sidebar-body');
  if (sidebar) sidebar.innerHTML = teacherSidebarMarkup();
}

function updateTeacherShareBox() {
  const shareBox = document.querySelector('#teacher-share-box');
  if (!shareBox) return;
  const link = teacherShareUrl();
  const input = shareBox.querySelector('.share-link-input');
  if (input) input.value = link;
  shareBox.querySelectorAll('button').forEach((button) => {
    button.disabled = !link;
  });
}

function updateTeacherTaskRow(id, selected) {
  const row = document.querySelector(`[data-task-row="${cssEscape(id)}"]`);
  if (row) row.classList.toggle('selected', selected);
}

function teacherRandomSelection(count) {
  const filtered = getTeacherFilteredTasks();
  if (!filtered.length) {
    showToast('Brak zadań dla wybranych filtrów.');
    return;
  }
  const picked = shuffle([...filtered]).slice(0, Math.min(count, filtered.length, MAX_SHARED_TASKS));
  state.teacher.selected = new Set(picked.map((task) => task.id));
  renderTeacher();
  showToast(`Wybrano ${picked.length} zadań.`);
}

function teacherSelectVisible() {
  const visible = getTeacherFilteredTasks().slice(0, state.teacher.limit);
  let added = 0;
  for (const task of visible) {
    if (state.teacher.selected.size >= MAX_SHARED_TASKS) break;
    if (!state.teacher.selected.has(task.id)) {
      state.teacher.selected.add(task.id);
      added += 1;
    }
  }
  renderTeacher();
  showToast(added ? `Dodano ${added} zadań.` : 'Nie dodano nowych zadań.');
}

function applyTeacherPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;
  state.teacher.grades = new Set(preset.grades);
  state.teacher.topics = new Set(preset.topics);
  state.teacher.difficulty = 'all';
  state.teacher.type = 'all';
  state.teacher.search = '';
  state.teacher.title = preset.title;
  const pool = state.tasks.filter((task) => task.grades.some((grade) => preset.grades.includes(grade)) && preset.topics.includes(task.topic));
  state.teacher.selected = new Set(shuffle(pool).slice(0, preset.count).map((task) => task.id));
  renderTeacher();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`Gotowy szkic: ${preset.title}`);
}

function shuffleTeacherSelection() {
  const shuffled = shuffle([...state.teacher.selected]);
  state.teacher.selected = new Set(shuffled);
  updateTeacherSelectionUI();
}

function teacherShareUrl() {
  const ids = [...state.teacher.selected];
  if (!ids.length) return '';
  const url = baseAppUrl();
  url.searchParams.set('zestaw', ids.join('.'));
  url.searchParams.set('nazwa', state.teacher.title.trim() || 'Zestaw zadań');
  url.searchParams.set('v', '1');
  return url.toString();
}

async function copyTeacherLink() {
  const link = teacherShareUrl();
  if (!link) return;
  const copied = await copyText(link);
  showToast(copied ? 'Link został skopiowany.' : 'Nie udało się skopiować linku.');
}

async function shareTeacherLink() {
  const link = teacherShareUrl();
  if (!link) return;
  if (navigator.share) {
    try {
      await navigator.share({
        title: state.teacher.title.trim() || 'Misja: Informatyka',
        text: 'Otwórz przygotowany zestaw zadań w aplikacji Misja: Informatyka.',
        url: link
      });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  await copyTeacherLink();
}

function openTeacherLink() {
  const link = teacherShareUrl();
  if (link) window.open(link, '_blank', 'noopener,noreferrer');
}

function downloadTeacherSet() {
  const tasks = [...state.teacher.selected];
  if (!tasks.length) return;
  const payload = {
    app: 'Misja: Informatyka',
    version: APP_VERSION,
    title: state.teacher.title.trim() || 'Zestaw zadań',
    createdAt: new Date().toISOString(),
    taskIds: tasks,
    link: teacherShareUrl()
  };
  downloadBlob(`${slugify(payload.title)}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

function parseSharedLink() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('zestaw');
  if (!raw || !state.taskMap.size) return null;
  const ids = [...new Set(raw.split('.').map((id) => id.trim()).filter(Boolean))].slice(0, MAX_SHARED_TASKS);
  const tasks = ids.map((id) => state.taskMap.get(id)).filter(Boolean);
  return {
    title: (params.get('nazwa') || 'Zestaw od nauczyciela').slice(0, 80),
    tasks,
    missing: ids.length - tasks.length
  };
}

function renderShared() {
  const shared = state.shared;
  if (!shared || !shared.tasks.length) {
    app.innerHTML = `
      <section class="shared-hero">
        <div class="shared-icon" aria-hidden="true">🧭</div>
        <h1>Ten zestaw jest pusty lub nieaktualny</h1>
        <p>Nie udało się odnaleźć zadań zapisanych w linku. Wybierz własne misje z katalogu.</p>
        <div class="result-actions" style="margin-top:24px"><button class="btn btn-primary" type="button" data-view="student">Otwórz katalog</button></div>
      </section>`;
    return;
  }

  const grades = [...new Set(shared.tasks.flatMap((task) => task.grades))].sort();
  const topics = [...new Set(shared.tasks.map((task) => task.topic))];
  app.innerHTML = `
    <section class="shared-hero">
      <div class="shared-icon" aria-hidden="true">📨</div>
      <p class="eyebrow" style="justify-content:center">Zestaw od nauczyciela</p>
      <h1>${escapeHtml(shared.title)}</h1>
      <p>Rozwiąż zadania po kolei. Za poprawne odpowiedzi zdobędziesz gwiazdki, a na końcu czeka podsumowanie i fanfary.</p>
      <div class="shared-summary">
        <span class="badge badge-primary">${shared.tasks.length} zadań</span>
        <span class="badge">Klasy ${grades.join(', ')}</span>
        <span class="badge">${topics.length} tematów</span>
      </div>
      ${shared.missing ? `<div class="warning-box" style="margin-bottom:18px">${shared.missing} zadań z linku nie znaleziono w tej wersji aplikacji.</div>` : ''}
      <button class="btn btn-primary btn-large" type="button" data-action="start-shared">🚀 Rozpocznij zestaw</button>
      <div class="mini-note" style="margin-top:18px">Aplikacja nie zapisuje imienia ani wyniku na serwerze. Po zakończeniu możesz pokazać podsumowanie nauczycielowi.</div>
    </section>`;
}

function startSharedSet() {
  if (!state.shared?.tasks.length) return;
  startSession(state.shared.tasks, state.shared.title, 'shared');
}

function startSession(tasks, title, source) {
  state.session = {
    title,
    source,
    tasks: tasks.map((task) => task),
    index: 0,
    results: [],
    stars: 0,
    current: null,
    startedAt: Date.now()
  };
  prepareCurrentTask();
  navigate('quiz');
}

function prepareCurrentTask() {
  const task = state.session.tasks[state.session.index];
  const current = {
    attempts: 0,
    finalized: false,
    optionOrder: task.options ? shuffle(task.options.map((_, index) => index)) : [],
    orderItems: task.type === 'order' ? shuffledDifferent(task.items) : [],
    matchOptions: task.type === 'match' ? shuffle(task.pairs.map((pair) => pair[1])) : [],
    sortItems: task.type === 'sort'
      ? shuffle(task.categories.flatMap((category) => category.items.map((item) => ({ item, category: category.name }))))
      : []
  };
  state.session.current = current;
}

function renderQuiz() {
  if (!state.session) {
    navigate('student');
    return;
  }
  const session = state.session;
  const task = session.tasks[session.index];
  const topic = TOPICS[task.topic];
  const progress = ((session.index + 1) / session.tasks.length) * 100;

  app.innerHTML = `
    <section class="quiz-shell">
      <div class="quiz-topbar">
        <button class="btn btn-small btn-ghost" type="button" data-action="exit-quiz">← Zakończ</button>
        <div class="quiz-title"><strong>${escapeHtml(session.title)}</strong><small>Zadanie ${session.index + 1} z ${session.tasks.length}</small></div>
        <span class="stars-counter" aria-label="Zdobyte gwiazdki">⭐ ${session.stars}</span>
      </div>
      <div class="progress-track" aria-label="Postęp zestawu"><div class="progress-bar" style="width:${progress}%"></div></div>

      <article class="quiz-card">
        <div class="quiz-meta">
          <div class="meta-row">
            <span class="badge" style="border-color:${topic.color}55">${topic.icon} ${escapeHtml(topic.name)}</span>
            <span class="badge">Klasa ${task.grades.join(', ')}</span>
          </div>
          <span class="badge">${DIFFICULTY[task.difficulty].icon} ${DIFFICULTY[task.difficulty].name}</span>
        </div>
        <h1>${escapeHtml(task.title)}</h1>
        <div class="story-box">${escapeHtml(task.story)}</div>
        <p class="task-prompt">${escapeHtml(task.prompt)}</p>

        <div id="answer-area" class="answer-area">${renderAnswer(task)}</div>
        <div id="feedback" class="feedback" aria-live="polite"></div>

        <div class="quiz-actions">
          <button class="btn btn-ghost" type="button" data-action="skip-task">Pomiń zadanie</button>
          <div class="quiz-actions-right">
            <button id="check-answer" class="btn btn-primary btn-large" type="button" data-action="check-answer">Sprawdź odpowiedź</button>
            <button id="next-task" class="btn btn-secondary btn-large" type="button" data-action="next-task" hidden>${session.index + 1 === session.tasks.length ? 'Zobacz wynik' : 'Następne zadanie'} →</button>
          </div>
        </div>
      </article>
    </section>`;

  const input = app.querySelector('input[type="text"], input[type="radio"], input[type="checkbox"], select');
  if (input) input.focus({ preventScroll: true });
}

function renderAnswer(task) {
  const current = state.session.current;
  switch (task.type) {
    case 'choice':
      return current.optionOrder.map((originalIndex) => `
        <label class="option-label" data-option-index="${originalIndex}">
          <input type="radio" name="answer" value="${originalIndex}">
          <span>${escapeHtml(task.options[originalIndex])}</span>
        </label>`).join('');
    case 'multi':
      return `<div class="mini-note">Może być więcej niż jedna poprawna odpowiedź.</div>` + current.optionOrder.map((originalIndex) => `
        <label class="option-label" data-option-index="${originalIndex}">
          <input type="checkbox" name="answer" value="${originalIndex}">
          <span>${escapeHtml(task.options[originalIndex])}</span>
        </label>`).join('');
    case 'order':
      return `<div class="mini-note">Użyj strzałek, aby ustawić kroki we właściwej kolejności.</div>
        <ol class="order-list" id="order-list">
          ${current.orderItems.map((item, index) => orderItemMarkup(item, index, current.orderItems.length)).join('')}
        </ol>`;
    case 'match':
      return `<div class="match-list">
        ${task.pairs.map(([left]) => `
          <label class="match-row" data-left="${escapeAttr(left)}">
            <strong>${escapeHtml(left)}</strong>
            <select aria-label="Dopasuj odpowiedź do ${escapeAttr(left)}">
              <option value="">Wybierz odpowiedź</option>
              ${current.matchOptions.map((right) => `<option value="${escapeAttr(right)}">${escapeHtml(right)}</option>`).join('')}
            </select>
          </label>`).join('')}
      </div>`;
    case 'sort':
      return `<div class="sort-list">
        ${current.sortItems.map(({ item }) => `
          <label class="sort-row" data-item="${escapeAttr(item)}">
            <strong>${escapeHtml(item)}</strong>
            <select aria-label="Wybierz kategorię dla ${escapeAttr(item)}">
              <option value="">Wybierz kategorię</option>
              ${task.categories.map((category) => `<option value="${escapeAttr(category.name)}">${escapeHtml(category.name)}</option>`).join('')}
            </select>
          </label>`).join('')}
      </div>`;
    case 'input':
      return `<label class="input-wrap"><span class="field-label">Twoja odpowiedź</span><input class="answer-input" type="text" autocomplete="off" placeholder="${escapeAttr(task.placeholder || 'Wpisz odpowiedź')}"></label>`;
    default:
      return '<p>Nieobsługiwany typ zadania.</p>';
  }
}

function orderItemMarkup(item, index, total) {
  return `
    <li class="order-item" data-item="${escapeAttr(item)}">
      <span class="order-number">${index + 1}</span>
      <span>${escapeHtml(item)}</span>
      <span class="order-controls">
        <button type="button" data-action="move-order" data-index="${index}" data-direction="-1" ${index === 0 ? 'disabled' : ''} aria-label="Przesuń w górę">↑</button>
        <button type="button" data-action="move-order" data-index="${index}" data-direction="1" ${index === total - 1 ? 'disabled' : ''} aria-label="Przesuń w dół">↓</button>
      </span>
    </li>`;
}

function moveOrderItem(index, direction) {
  const current = state.session?.current;
  if (!current || current.finalized) return;
  const next = index + direction;
  if (next < 0 || next >= current.orderItems.length) return;
  [current.orderItems[index], current.orderItems[next]] = [current.orderItems[next], current.orderItems[index]];
  const list = document.querySelector('#order-list');
  if (list) list.innerHTML = current.orderItems.map((item, i) => orderItemMarkup(item, i, current.orderItems.length)).join('');
}

function checkCurrentAnswer() {
  const session = state.session;
  if (!session || session.current.finalized) return;
  const task = session.tasks[session.index];
  const response = collectAnswer(task);
  if (response.empty) {
    showToast('Najpierw wybierz lub wpisz odpowiedź.');
    return;
  }

  const correct = validateAnswer(task, response.value);
  session.current.attempts += 1;

  if (correct) {
    const earnedStars = session.current.attempts === 1 ? 2 : 1;
    finalizeCurrentTask(true, earnedStars, task, 'correct');
    return;
  }

  if (session.current.attempts === 1) {
    showFeedback('warning', 'Jeszcze nie tym razem', `${task.hint} Możesz poprawić odpowiedź i sprawdzić ją ponownie.`);
    const button = document.querySelector('#check-answer');
    if (button) button.textContent = 'Sprawdź ponownie';
    return;
  }

  finalizeCurrentTask(false, 0, task, 'incorrect');
}

function collectAnswer(task) {
  switch (task.type) {
    case 'choice': {
      const checked = document.querySelector('input[name="answer"]:checked');
      return { empty: !checked, value: checked ? Number(checked.value) : null };
    }
    case 'multi': {
      const checked = [...document.querySelectorAll('input[name="answer"]:checked')].map((input) => Number(input.value)).sort((a, b) => a - b);
      return { empty: checked.length === 0, value: checked };
    }
    case 'order': {
      const items = [...document.querySelectorAll('#order-list [data-item]')].map((item) => item.dataset.item);
      return { empty: items.length === 0, value: items };
    }
    case 'match': {
      const rows = [...document.querySelectorAll('.match-row')];
      const mapping = Object.fromEntries(rows.map((row) => [row.dataset.left, row.querySelector('select').value]));
      return { empty: Object.values(mapping).some((value) => !value), value: mapping };
    }
    case 'sort': {
      const rows = [...document.querySelectorAll('.sort-row')];
      const mapping = Object.fromEntries(rows.map((row) => [row.dataset.item, row.querySelector('select').value]));
      return { empty: Object.values(mapping).some((value) => !value), value: mapping };
    }
    case 'input': {
      const value = document.querySelector('.answer-input')?.value || '';
      return { empty: !value.trim(), value };
    }
    default:
      return { empty: true, value: null };
  }
}

function validateAnswer(task, response) {
  switch (task.type) {
    case 'choice':
      return response === task.answer;
    case 'multi':
      return arraysEqual(response, [...task.answer].sort((a, b) => a - b));
    case 'order':
      return arraysEqual(response, task.answer);
    case 'match':
      return task.pairs.every(([left, right]) => response[left] === right);
    case 'sort':
      return task.categories.every((category) => category.items.every((item) => response[item] === category.name));
    case 'input':
      return task.answers.some((answer) => normalizeText(answer) === normalizeText(response));
    default:
      return false;
  }
}

function finalizeCurrentTask(correct, stars, task, feedbackType) {
  const session = state.session;
  session.current.finalized = true;
  session.stars += stars;
  session.results.push({
    id: task.id,
    correct,
    stars,
    attempts: session.current.attempts,
    skipped: false
  });

  disableCurrentInputs();
  markChoiceAnswers(task);
  const title = correct ? (stars === 2 ? 'Świetnie, od razu poprawnie!' : 'Brawo, poprawiona odpowiedź!') : 'Sprawdź rozwiązanie';
  const body = correct
    ? task.explanation
    : `${task.explanation}<div class="correct-answer">Poprawna odpowiedź: ${escapeHtml(correctAnswerText(task))}</div>`;
  showFeedback(feedbackType, title, body, true);
  showNextButton();
}

function disableCurrentInputs() {
  document.querySelectorAll('#answer-area input, #answer-area select, #answer-area button').forEach((element) => {
    element.disabled = true;
  });
}

function markChoiceAnswers(task) {
  if (!['choice', 'multi'].includes(task.type)) return;
  const correct = task.type === 'choice' ? [task.answer] : task.answer;
  document.querySelectorAll('.option-label').forEach((label) => {
    const index = Number(label.dataset.optionIndex);
    const input = label.querySelector('input');
    if (correct.includes(index)) label.classList.add('correct');
    else if (input?.checked) label.classList.add('incorrect');
  });
}

function showFeedback(type, title, content, contentIsHtml = false) {
  const box = document.querySelector('#feedback');
  if (!box) return;
  box.className = `feedback visible ${type}`;
  box.innerHTML = `<strong>${escapeHtml(title)}</strong>${contentIsHtml ? `<div>${content}</div>` : `<p>${escapeHtml(content)}</p>`}`;
}

function showNextButton() {
  const check = document.querySelector('#check-answer');
  const next = document.querySelector('#next-task');
  const skip = document.querySelector('[data-action="skip-task"]');
  if (check) check.hidden = true;
  if (skip) skip.hidden = true;
  if (next) {
    next.hidden = false;
    next.focus();
  }
}

function skipCurrentTask() {
  const session = state.session;
  if (!session || session.current.finalized) return;
  const task = session.tasks[session.index];
  const confirmed = window.confirm('Pominąć to zadanie? W podsumowaniu pojawi się jako niewykonane.');
  if (!confirmed) return;
  session.current.finalized = true;
  session.results.push({ id: task.id, correct: false, stars: 0, attempts: session.current.attempts, skipped: true });
  disableCurrentInputs();
  showFeedback('incorrect', 'Zadanie pominięte', `${task.explanation} Poprawna odpowiedź: ${correctAnswerText(task)}`);
  showNextButton();
}

function goToNextTask() {
  const session = state.session;
  if (!session?.current.finalized) return;
  if (session.index + 1 >= session.tasks.length) {
    finishSession();
    return;
  }
  session.index += 1;
  prepareCurrentTask();
  renderQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exitQuiz() {
  const confirmed = window.confirm('Zakończyć zestaw? Wynik tej sesji nie zostanie zapisany.');
  if (!confirmed) return;
  state.session = null;
  navigate('student');
}

function finishSession() {
  state.session.finishedAt = Date.now();
  state.view = 'result';
  render();
  launchCelebration();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderResult() {
  const session = state.session;
  if (!session) {
    navigate('student');
    return;
  }
  const correct = session.results.filter((result) => result.correct).length;
  const total = session.tasks.length;
  const percent = Math.round((correct / total) * 100);
  const missed = session.results.filter((result) => !result.correct).map((result) => state.taskMap.get(result.id)).filter(Boolean);
  const reward = rewardForScore(percent);
  const durationSeconds = Math.max(1, Math.round(((session.finishedAt || Date.now()) - session.startedAt) / 1000));

  app.innerHTML = `
    <section class="result-card">
      <div class="result-top">
        <div class="trophy" aria-hidden="true">${reward.icon}</div>
        <p class="eyebrow" style="justify-content:center;color:#fff">Misja zakończona</p>
        <h1>${escapeHtml(reward.title)}</h1>
        <p>${escapeHtml(reward.message)}</p>
      </div>
      <div class="result-body">
        <div class="result-stats">
          <div class="result-stat"><strong>${correct}/${total}</strong><span>poprawnych zadań</span></div>
          <div class="result-stat"><strong>⭐ ${session.stars}</strong><span>zdobytych gwiazdek</span></div>
          <div class="result-stat"><strong>${formatDuration(durationSeconds)}</strong><span>czas misji</span></div>
        </div>
        <div class="reward-badge">🏅 Odznaka: ${escapeHtml(reward.badge)}</div>
        <div class="result-actions">
          <button class="btn btn-primary" type="button" data-action="repeat-all">Jeszcze raz</button>
          ${missed.length ? `<button class="btn" type="button" data-action="repeat-missed">Powtórz ${missed.length} trudnych zadań</button>` : ''}
          <button class="btn" type="button" data-view="student">Nowe misje</button>
          <button class="btn btn-ghost" type="button" data-action="copy-result">Kopiuj wynik</button>
          <button class="btn btn-ghost" type="button" data-action="print-certificate">Drukuj dyplom</button>
        </div>
        ${missed.length ? `
          <div class="missed-list"><h2>Warto jeszcze przećwiczyć</h2><ul>${missed.map((task) => `<li>${escapeHtml(task.title)}</li>`).join('')}</ul></div>` : `
          <div class="success-box" style="margin-top:22px">Wszystkie zadania zostały rozwiązane poprawnie. Świetna robota!</div>`}
      </div>
    </section>

    <section class="certificate-only">
      <p>Misja: Informatyka</p>
      <h1>Dyplom ukończenia</h1>
      <h2>${escapeHtml(session.title)}</h2>
      <p>Wynik: ${correct} z ${total} zadań, ${session.stars} gwiazdek</p>
      <p>Odznaka: ${escapeHtml(reward.badge)}</p>
      <p>${new Date().toLocaleDateString('pl-PL')}</p>
    </section>`;
}

function rewardForScore(percent) {
  if (percent === 100) return { icon: '🏆', title: 'Perfekcyjna misja!', badge: 'Cyfrowa Gwiazda', message: 'Każde zadanie rozwiązane poprawnie. To wynik godny cyfrowego laboratorium.' };
  if (percent >= 80) return { icon: '🚀', title: 'Świetny wynik!', badge: 'Dowódca Misji', message: 'Bardzo dobra praca. Trudniejsze zadania nie zatrzymały tej wyprawy.' };
  if (percent >= 60) return { icon: '🧠', title: 'Misja wykonana!', badge: 'Łowca Rozwiązań', message: 'Dużo dobrych odpowiedzi i kilka nowych rzeczy do przećwiczenia.' };
  return { icon: '🧭', title: 'Pierwszy krok za tobą!', badge: 'Odkrywca Technologii', message: 'Najważniejsze, że zadania zostały sprawdzone. Powtórka szybko poprawi wynik.' };
}

function repeatAllTasks() {
  const { tasks, title, source } = state.session;
  startSession(tasks, title, source);
}

function repeatMissedTasks() {
  const missedIds = state.session.results.filter((result) => !result.correct).map((result) => result.id);
  const tasks = missedIds.map((id) => state.taskMap.get(id)).filter(Boolean);
  if (!tasks.length) return;
  startSession(tasks, `Powtórka: ${state.session.title}`, 'repeat');
}

async function copyResult() {
  const session = state.session;
  const correct = session.results.filter((result) => result.correct).length;
  const reward = rewardForScore(Math.round((correct / session.tasks.length) * 100));
  const text = `Misja: Informatyka\nZestaw: ${session.title}\nWynik: ${correct}/${session.tasks.length}\nGwiazdki: ${session.stars}\nOdznaka: ${reward.badge}`;
  const copied = await copyText(text);
  showToast(copied ? 'Wynik został skopiowany.' : 'Nie udało się skopiować wyniku.');
}

function launchCelebration() {
  playFanfare();
  createConfetti();
}

function playFanfare() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const start = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + index * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.18, start + index * 0.14 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.14 + 0.32);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + index * 0.14);
      oscillator.stop(start + index * 0.14 + 0.34);
    });
    setTimeout(() => context.close(), 1600);
  } catch (error) {
    console.debug('Dźwięk fanfar niedostępny', error);
  }
}

function createConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confettiLayer.innerHTML = '';
  const colors = ['#5b4bdb', '#0a8f78', '#ffbf59', '#e85871', '#4b9ce2', '#9b6dd1'];
  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.1}s`);
    piece.style.setProperty('--delay', `${Math.random() * 0.55}s`);
    piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
  }
  setTimeout(() => { confettiLayer.innerHTML = ''; }, 5200);
}

function renderAbout() {
  app.innerHTML = `
    <header class="page-heading">
      <div>
        <p class="eyebrow">O projekcie</p>
        <h1>Mały projekt, otwarta droga rozwoju</h1>
        <p>Aplikacja powstała jako przyjemne uzupełnienie lekcji informatyki. Nie zastępuje Scratcha, arkusza, edytora tekstu ani pracy nauczyciela.</p>
      </div>
      <span class="badge badge-build">🚧 W fazie budowy</span>
    </header>

    <div class="about-grid">
      <article class="about-card">
        <h2>🎯 Co ćwiczy</h2>
        <ul>
          <li>logiczne i algorytmiczne myślenie,</li>
          <li>bezpieczne i odpowiedzialne działanie w sieci,</li>
          <li>pracę z informacją, danymi i podstawowymi aplikacjami,</li>
          <li>rozumienie komputerów, sieci i prostych stron WWW,</li>
          <li>świadome korzystanie z AI i sprawdzanie odpowiedzi.</li>
        </ul>
      </article>

      <article class="about-card">
        <h2>🔐 Prywatność</h2>
        <p>Nie ma kont, reklam, analityki ani centralnej bazy wyników. Aplikacja nie prosi ucznia o imię. Motyw kolorystyczny jest jedynym ustawieniem zapisywanym lokalnie w przeglądarce.</p>
        <p>Link nauczyciela zawiera jedynie identyfikatory zadań i nazwę zestawu.</p>
      </article>

      <article class="about-card">
        <h2>🧑‍🏫 Dla nauczyciela</h2>
        <p>Kreator pozwala łączyć klasy, tematy, poziomy i typy ćwiczeń. Gotowy link można wysłać przez dziennik, wiadomość lub wyświetlić na tablicy.</p>
        <p>To narzędzie do ćwiczeń i powtórek, nie zabezpieczony system egzaminacyjny.</p>
      </article>

      <article class="about-card">
        <h2>🛠️ Rozbudowa</h2>
        <p>Zadania znajdują się w jednym pliku JSON i są sprawdzane automatycznie przez GitHub Actions. Dokumentacja repozytorium opisuje schemat oraz dodawanie nowych treści.</p>
        <p>Pomysły, poprawki i nowe zadania można zgłaszać przez GitHub Issues.</p>
      </article>
    </div>

    <section class="section-block panel">
      <div class="panel-title"><div><h2>Stan projektu</h2><p>Wersja ${APP_VERSION} jest gotowa do testów, ale katalog i mechaniki będą nadal rozwijane.</p></div></div>
      <div class="warning-box">Treści zostały przygotowane z myślą o zakresie edukacji informatycznej w klasach 3–8, ale nie są oficjalnym podręcznikiem ani pełnym programem nauczania. Nauczyciel powinien dobrać zadania do swojej klasy.</div>
      <div class="action-row" style="margin-top:18px">
        <button class="btn btn-primary" type="button" data-view="student">Otwórz zadania</button>
        <button class="btn" type="button" data-view="teacher">Otwórz kreator</button>
        <a class="btn btn-ghost" href="https://github.com/lepczynski-cloud/misja-informatyka" rel="noreferrer">Repozytorium GitHub</a>
      </div>
    </section>`;
}

function correctAnswerText(task) {
  switch (task.type) {
    case 'choice':
      return task.options[task.answer];
    case 'multi':
      return task.answer.map((index) => task.options[index]).join('; ');
    case 'order':
      return task.answer.join(' → ');
    case 'match':
      return task.pairs.map(([left, right]) => `${left}: ${right}`).join('; ');
    case 'sort':
      return task.categories.map((category) => `${category.name}: ${category.items.join(', ')}`).join('; ');
    case 'input':
      return task.answers[0];
    default:
      return '';
  }
}

function taskSearchText(task) {
  const extra = [
    ...(task.options || []),
    ...(task.items || []),
    ...(task.answers || []),
    ...(task.pairs || []).flat(),
    ...(task.categories || []).flatMap((category) => [category.name, ...category.items])
  ];
  return normalizeText([task.title, task.story, task.prompt, task.explanation, TOPICS[task.topic]?.name, ...extra].join(' '));
}

function baseAppUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url;
}

function shuffledDifferent(items) {
  const original = [...items];
  let shuffled = shuffle([...items]);
  if (items.length > 1 && arraysEqual(shuffled, original)) {
    shuffled = [...items.slice(1), items[0]];
  }
  return shuffled;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('pl-PL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'zestaw-misja-informatyka';
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    return success;
  } catch {
    return false;
  }
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  state.toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!(location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;
  try {
    await navigator.serviceWorker.register('./service-worker.js');
  } catch (error) {
    console.debug('Service worker nie został zarejestrowany', error);
  }
}
