import { readFile } from 'node:fs/promises';
import process from 'node:process';

const tasksPath = new URL('../public/data/tasks.json', import.meta.url);
const sourcesPath = new URL('../public/data/sources.json', import.meta.url);
const tasks = JSON.parse(await readFile(tasksPath, 'utf8'));
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

const topics = new Set(['komputer', 'internet', 'bezpieczenstwo', 'algorytmy', 'dane', 'tworzenie', 'ai', 'sieci', 'prawo']);
const types = new Set(['choice', 'truefalse', 'multi', 'match', 'input']);
const sourceKeys = new Set(sources.map((source) => source?.key));


const expectedGradeCounts = { 3: 185, 4: 225, 5: 395, 6: 395, 7: 265, 8: 221 };
const expectedTopicCounts = {
  komputer: 158,
  internet: 204,
  bezpieczenstwo: 478,
  algorytmy: 140,
  dane: 130,
  tworzenie: 122,
  ai: 246,
  sieci: 112,
  prawo: 96
};
const expectedTypeCounts = { choice: 1246, truefalse: 400, multi: 11, match: 25, input: 4 };

const errors = [];
const warnings = [];
const ids = new Set();
const textSignatures = new Map();

function fail(task, message) {
  errors.push(`${task?.id ?? '(bez id)'}: ${message}`);
}

function isText(value, min = 1) {
  return typeof value === 'string' && value.trim().length >= min;
}

function unique(values) {
  return new Set(values).size === values.length;
}

function normalizeSignature(value) {
  return String(value).toLocaleLowerCase('pl').replace(/\s+/g, ' ').trim();
}

if (!Array.isArray(sources) || sources.length === 0) {
  throw new Error('Katalog źródeł musi być niepustą tablicą JSON.');
}
const verifiedSourceKeys = new Set();
for (const source of sources) {
  if (!source || typeof source !== 'object') throw new Error('Niepoprawny wpis w katalogu źródeł.');
  if (!isText(source.key) || !isText(source.title) || !isText(source.organization) || !isText(source.url)) {
    throw new Error('Każde źródło musi mieć key, title, organization i url.');
  }
  if (verifiedSourceKeys.has(source.key)) throw new Error(`Powtórzony klucz źródła: ${source.key}.`);
  if (!/^https:\/\//.test(source.url)) throw new Error(`Źródło ${source.key} musi używać adresu HTTPS.`);
  verifiedSourceKeys.add(source.key);
}
if (sourceKeys.size !== verifiedSourceKeys.size) throw new Error('Katalog źródeł zawiera powtórzone lub puste klucze.');

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

  if (!/^k[3-8]-[a-z0-9-]+-\d{2,3}$/.test(task.id)) fail(task, 'id powinno mieć format k3-temat-01 albo k3-temat-001.');
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

  const signature = normalizeSignature(`${task.story}\n${task.prompt}`);
  const previous = textSignatures.get(signature);
  if (previous) fail(task, `powtarza dokładnie treść zadania ${previous}.`);
  textSignatures.set(signature, task.id);

  if (!Array.isArray(task.sourceKeys) || task.sourceKeys.length === 0) {
    fail(task, 'sourceKeys musi zawierać co najmniej jedno źródło merytoryczne.');
  } else {
    if (!unique(task.sourceKeys)) fail(task, 'sourceKeys nie powinno zawierać duplikatów.');
    for (const key of task.sourceKeys) {
      if (!sourceKeys.has(key)) fail(task, `nieznany klucz źródła: ${key}.`);
    }
  }

  if (task.type === 'choice' || task.type === 'multi' || task.type === 'truefalse') {
    if (!Array.isArray(task.options) || task.options.length < 2 || task.options.some((option) => !isText(option))) {
      fail(task, 'options musi zawierać co najmniej dwie odpowiedzi.');
    } else if (!unique(task.options)) {
      fail(task, 'odpowiedzi w options muszą być unikalne.');
    }
  }

  if (task.type === 'choice') {
    if (task.options.length < 4) fail(task, 'zadanie jednokrotnego wyboru powinno mieć co najmniej cztery odpowiedzi.');
    if (!Number.isInteger(task.answer) || task.answer < 0 || task.answer >= task.options.length) fail(task, 'answer wskazuje nieistniejącą odpowiedź.');
  }

  if (task.type === 'truefalse') {
    if (JSON.stringify(task.options) !== JSON.stringify(['Prawda', 'Fałsz'])) fail(task, 'zadanie P/F musi mieć odpowiedzi dokładnie: Prawda, Fałsz.');
    if (![0, 1].includes(task.answer)) fail(task, 'answer w zadaniu P/F musi mieć wartość 0 albo 1.');
    if ([...task.story].length < 100) fail(task, 'zadanie P/F powinno zawierać dłuższy kontekst sytuacyjny.');
    if ([...task.prompt].length < 65) fail(task, 'stwierdzenie P/F powinno być wystarczająco rozwinięte.');
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

if (tasks.length !== 1686) errors.push(`Katalog powinien zawierać dokładnie 1686 zadań, a zawiera ${tasks.length}.`);
for (const [grade, expected] of Object.entries(expectedGradeCounts)) {
  const actual = gradeCounts.get(Number(grade)) ?? 0;
  if (actual !== expected) errors.push(`Klasa ${grade} powinna mieć ${expected} zadań, a ma ${actual}.`);
}
for (const [topic, expected] of Object.entries(expectedTopicCounts)) {
  const actual = topicCounts.get(topic) ?? 0;
  if (actual !== expected) errors.push(`Temat ${topic} powinien mieć ${expected} zadań, a ma ${actual}.`);
}
for (const [type, expected] of Object.entries(expectedTypeCounts)) {
  const actual = typeCounts.get(type) ?? 0;
  if (actual !== expected) errors.push(`Typ ${type} powinien mieć ${expected} zadań, a ma ${actual}.`);
}
if ((typeCounts.get('truefalse') ?? 0) !== 400) errors.push('Katalog powinien zawierać dokładnie 400 zadań Prawda/Fałsz.');
if ((topicCounts.get('bezpieczenstwo') ?? 0) !== 478) errors.push('Kategoria cyberbezpieczeństwo powinna zawierać dokładnie 478 zadań.');
if ((topicCounts.get('ai') ?? 0) !== 246) errors.push('Kategoria AI powinna zawierać dokładnie 246 zadań.');
if (typeCounts.has('sort')) errors.push('Katalog nie może zawierać zadań wymagających porządkowania niejednoznacznej kolejności.');

const trueFalseTasks = tasks.filter((task) => task.type === 'truefalse');
const truthCounts = [0, 1].map((answer) => trueFalseTasks.filter((task) => task.answer === answer).length);
if (truthCounts[0] !== 200 || truthCounts[1] !== 200) {
  errors.push(`Odpowiedzi P/F powinny być zbalansowane 200/200, a są ${truthCounts.join('/')}.`);
}

const singleSelectShare = ((typeCounts.get('choice') ?? 0) + (typeCounts.get('truefalse') ?? 0)) / tasks.length;
if (singleSelectShare < 0.95) errors.push('Co najmniej 95% katalogu powinny stanowić zadania jednokrotnego wyboru lub Prawda/Fałsz.');

const choices = tasks.filter((task) => task.type === 'choice' && task.options.length >= 3);
let uniqueLongestCorrect = 0;
let totalCorrectLength = 0;
let totalWrongLength = 0;
let wrongOptionCount = 0;
for (const task of choices) {
  const lengths = task.options.map((option) => [...option].length);
  const correctLength = lengths[task.answer];
  const max = Math.max(...lengths);
  if (correctLength === max && lengths.filter((length) => length === max).length === 1) uniqueLongestCorrect += 1;
  totalCorrectLength += correctLength;
  lengths.forEach((length, index) => {
    if (index !== task.answer) {
      totalWrongLength += length;
      wrongOptionCount += 1;
    }
  });
}
const longestCorrectRate = uniqueLongestCorrect / choices.length;
const averageCorrectLength = totalCorrectLength / choices.length;
const averageWrongLength = totalWrongLength / wrongOptionCount;
if (longestCorrectRate < 0.15 || longestCorrectRate > 0.30) {
  errors.push(`Wzorzec długości odpowiedzi jest zbyt przewidywalny: poprawna odpowiedź jest jednoznacznie najdłuższa w ${(longestCorrectRate * 100).toFixed(1)}% pytań.`);
}
if (Math.abs(averageCorrectLength - averageWrongLength) > 18) {
  errors.push(`Średnia długość odpowiedzi poprawnych i błędnych różni się zbyt mocno: ${averageCorrectLength.toFixed(1)} vs ${averageWrongLength.toFixed(1)} znaków.`);
}

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

const cyberLongScenarios = tasks.filter((task) => task.topic === 'bezpieczenstwo' && [...task.story].length >= 120).length;
if (cyberLongScenarios < 350) errors.push(`Za mało rozbudowanych scenariuszy cyberbezpieczeństwa: ${cyberLongScenarios}.`);

console.log(`Sprawdzono ${tasks.length} zadań i ${sources.length} źródeł.`);
console.log('Klasy:', Object.fromEntries([...gradeCounts].sort((a, b) => a[0] - b[0])));
console.log('Tematy:', Object.fromEntries([...topicCounts].sort()));
console.log('Typy:', Object.fromEntries([...typeCounts].sort()));
console.log('Prawda/Fałsz:', { prawda: truthCounts[0], falsz: truthCounts[1] });
console.log('Pozycje poprawnych odpowiedzi (4 opcje):', answerPositionCounts);
console.log('Audyt długości:', {
  uniqueLongestCorrect,
  rate: `${(longestCorrectRate * 100).toFixed(2)}%`,
  averageCorrectLength: averageCorrectLength.toFixed(2),
  averageWrongLength: averageWrongLength.toFixed(2)
});
console.log('Dłuższe scenariusze cyberbezpieczeństwa:', cyberLongScenarios);

for (const warning of warnings) console.warn(`OSTRZEŻENIE: ${warning}`);
if (errors.length) {
  console.error(`\nZnaleziono ${errors.length} błędów:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Katalog zadań jest poprawny.');
