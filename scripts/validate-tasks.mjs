import { readFile } from 'node:fs/promises';
import process from 'node:process';

const path = new URL('../public/data/tasks.json', import.meta.url);
const tasks = JSON.parse(await readFile(path, 'utf8'));
const topics = new Set(['komputer', 'internet', 'bezpieczenstwo', 'algorytmy', 'dane', 'tworzenie', 'ai', 'sieci', 'prawo']);
const types = new Set(['choice', 'multi', 'order', 'match', 'sort', 'input']);
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

  if (task.type === 'order') {
    if (!Array.isArray(task.items) || task.items.length < 3 || task.items.some((item) => !isText(item)) || !unique(task.items)) fail(task, 'items musi zawierać co najmniej trzy unikalne kroki.');
    if (!Array.isArray(task.answer) || task.answer.length !== task.items.length || !task.answer.every((item) => task.items.includes(item)) || !unique(task.answer)) {
      fail(task, 'answer musi zawierać te same elementy co items.');
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
  if ((gradeCounts.get(grade) ?? 0) < 15) warnings.push(`Klasa ${grade} ma mniej niż 15 zadań.`);
}
for (const topic of topics) {
  if ((topicCounts.get(topic) ?? 0) < 10) warnings.push(`Temat ${topic} ma mniej niż 10 zadań.`);
}
for (const type of types) {
  if ((typeCounts.get(type) ?? 0) === 0) warnings.push(`Brak zadań typu ${type}.`);
}

console.log(`Sprawdzono ${tasks.length} zadań.`);
console.log('Klasy:', Object.fromEntries([...gradeCounts].sort((a, b) => a[0] - b[0])));
console.log('Tematy:', Object.fromEntries([...topicCounts].sort()));
console.log('Typy:', Object.fromEntries([...typeCounts].sort()));

for (const warning of warnings) console.warn(`OSTRZEŻENIE: ${warning}`);
if (errors.length) {
  console.error(`\nZnaleziono ${errors.length} błędów:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Katalog zadań jest poprawny.');
