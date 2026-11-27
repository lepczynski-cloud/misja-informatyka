import { readFile } from 'node:fs/promises';
import process from 'node:process';

const path = new URL('../public/data/tasks.json', import.meta.url);
const tasks = JSON.parse(await readFile(path, 'utf8'));
const topics = new Set(['komputer', 'internet', 'bezpieczenstwo', 'algorytmy', 'dane', 'tworzenie', 'ai', 'sieci', 'prawo']);
const types = new Set(['choice', 'multi', 'match', 'sort', 'input']);
const errors = [];
const warnings = [];
const ids = new Set();

function fail(task, message) {
  errors.push(`${task?.id ?? '(bez id)'}: ${message}`);
}

function isText(value, min = 1) {
  return typeof value === 'string' && value.trim().length >= min;
}

function unique(values) {
  return new Set(values).size === values.length;
}

if (!Array.isArray(tasks)) {
  throw new Error('Katalog zadań musi być tablicą JSON.');
}

for (const task of tasks) {
  if (!task || typeof task !== 'object') {
    errors.push('Znaleziono wpis, który nie jest obiektem.');
    continue;
  }

  if (!isText(task.id)) fail(task, 'brak identyfikatora.');
  if (ids.has(task.id)) fail(task, 'zduplikowany identyfikator.');
  ids.add(task.id);

  if (!/^k[3-8]-[a-z0-9-]+-\d{2}$/.test(task.id)) fail(task, 'id powinno mieć format k3-temat-01.');
  if (!Array.isArray(task.grades) || task.grades.length === 0 || task.grades.some((grade) => !Number.isInteger(grade) || grade < 3 || grade > 8)) {
    fail(task, 'grades musi zawierać klasy od 3 do 8.');
  }
  if (!topics.has(task.topic)) fail(task, `nieznany temat: ${task.topic}.`);
  if (![1, 2, 3].includes(task.difficulty)) fail(task, 'difficulty musi mieć wartość 1, 2 lub 3.');
  if (!types.has(task.type)) fail(task, `nieznany typ: ${task.type}.`);

  for (const field of ['title', 'story', 'prompt', 'hint', 'explanation']) {
    if (!isText(task[field], 3)) fail(task, `pole ${field} jest puste lub zbyt krótkie.`);
    if (isText(task[field]) && /<script|javascript:/i.test(task[field])) fail(task, `pole ${field} zawiera niedozwolony fragment.`);
  }

  if (task.type === 'choice' || task.type === 'multi') {
    if (!Array.isArray(task.options) || task.options.length < 2 || task.options.some((option) => !isText(option))) {
      fail(task, 'options musi zawierać co najmniej dwie odpowiedzi.');
    } else if (!unique(task.options)) {
      fail(task, 'odpowiedzi w options muszą być unikalne.');
    }
  }

  if (task.type === 'choice') {
    if (!Number.isInteger(task.answer) || task.answer < 0 || task.answer >= task.options.length) fail(task, 'answer wskazuje nieistniejącą odpowiedź.');
  }

  if (task.type === 'multi') {
    if (!Array.isArray(task.answer) || task.answer.length === 0 || !unique(task.answer) || task.answer.some((index) => !Number.isInteger(index) || index < 0 || index >= task.options.length)) {
      fail(task, 'answer musi być unikalną listą poprawnych indeksów.');
    }
  }

  if (task.type === 'match') {
    if (!Array.isArray(task.pairs) || task.pairs.length < 3 || task.pairs.some((pair) => !Array.isArray(pair) || pair.length !== 2 || pair.some((value) => !isText(value)))) {
      fail(task, 'pairs musi zawierać co najmniej trzy poprawne pary.');
    } else {
      if (!unique(task.pairs.map((pair) => pair[0]))) fail(task, 'lewe elementy par muszą być unikalne.');
      if (!unique(task.pairs.map((pair) => pair[1]))) fail(task, 'prawe elementy par muszą być unikalne.');
    }
  }

  if (task.type === 'sort') {
    if (!Array.isArray(task.categories) || task.categories.length < 2) {
      fail(task, 'categories musi zawierać co najmniej dwie kategorie.');
    } else {
      const names = task.categories.map((category) => category.name);
      const items = task.categories.flatMap((category) => category.items ?? []);
      if (task.categories.some((category) => !isText(category.name) || !Array.isArray(category.items) || category.items.length === 0 || category.items.some((item) => !isText(item)))) {
        fail(task, 'każda kategoria musi mieć nazwę i co najmniej jeden element.');
      }
      if (!unique(names)) fail(task, 'nazwy kategorii muszą być unikalne.');
      if (!unique(items)) fail(task, 'elementy kategorii muszą być unikalne.');
    }
  }

  if (task.type === 'input') {
    if (!Array.isArray(task.answers) || task.answers.length === 0 || task.answers.some((answer) => !isText(answer))) fail(task, 'answers musi zawierać co najmniej jedną odpowiedź.');
  }
}

const gradeCounts = new Map();
const topicCounts = new Map();
const typeCounts = new Map();
for (const task of tasks) {
  for (const grade of task.grades ?? []) gradeCounts.set(grade, (gradeCounts.get(grade) ?? 0) + 1);
  topicCounts.set(task.topic, (topicCounts.get(task.topic) ?? 0) + 1);
  typeCounts.set(task.type, (typeCounts.get(task.type) ?? 0) + 1);
}

for (let grade = 3; grade <= 8; grade += 1) {
  if ((gradeCounts.get(grade) ?? 0) < 50) warnings.push(`Klasa ${grade} ma mniej niż 50 zadań.`);
}
for (const topic of topics) {
  if ((topicCounts.get(topic) ?? 0) < 30) warnings.push(`Temat ${topic} ma mniej niż 30 zadań.`);
}
for (const type of types) {
  if ((typeCounts.get(type) ?? 0) === 0) warnings.push(`Brak zadań typu ${type}.`);
}

if (tasks.length < 486) errors.push(`Katalog powinien zawierać co najmniej 486 zadań, a zawiera ${tasks.length}.`);
if ((topicCounts.get('bezpieczenstwo') ?? 0) < 108) errors.push('Kategoria cyberbezpieczeństwo powinna zawierać co najmniej 108 zadań.');
if ((typeCounts.get('choice') ?? 0) < Math.ceil(tasks.length * 0.75)) errors.push('Co najmniej 75% katalogu powinny stanowić zadania jednokrotnego wyboru.');

const fourOptionChoices = tasks.filter((task) => task.type === 'choice' && task.options?.length === 4);
const answerPositionCounts = [0, 1, 2, 3].map((position) => fourOptionChoices.filter((task) => task.answer === position).length);
if (fourOptionChoices.length >= 40) {
  const minExpected = Math.floor(fourOptionChoices.length * 0.15);
  const maxExpected = Math.ceil(fourOptionChoices.length * 0.35);
  if (answerPositionCounts.some((count) => count < minExpected || count > maxExpected)) {
    errors.push(`Pozycje poprawnych odpowiedzi są zbyt przewidywalne: ${answerPositionCounts.join(', ')}.`);
  }
}
const maxOtherGrade = Math.max(...[3, 4, 7, 8].map((grade) => gradeCounts.get(grade) ?? 0));
if ((gradeCounts.get(5) ?? 0) <= maxOtherGrade || (gradeCounts.get(6) ?? 0) <= maxOtherGrade) {
  errors.push('Klasy 5 i 6 powinny mieć więcej zadań niż pozostałe klasy.');
}

console.log(`Sprawdzono ${tasks.length} zadań.`);
console.log('Klasy:', Object.fromEntries([...gradeCounts].sort((a, b) => a[0] - b[0])));
console.log('Tematy:', Object.fromEntries([...topicCounts].sort()));
console.log('Typy:', Object.fromEntries([...typeCounts].sort()));
console.log('Pozycje poprawnych odpowiedzi (4 opcje):', answerPositionCounts);

for (const warning of warnings) console.warn(`OSTRZEŻENIE: ${warning}`);
if (errors.length) {
  console.error(`\nZnaleziono ${errors.length} błędów:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Katalog zadań jest poprawny.');
