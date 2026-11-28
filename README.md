<p align="center">
  <img src="public/assets/logo.svg" width="92" height="92" alt="Logo Misja: Informatyka">
</p>

<h1 align="center">Misja: Informatyka</h1>

<p align="center">
  Interaktywna aplikacja przeglądarkowa z zadaniami z informatyki dla uczniów klas 3–8.
</p>

<p align="center">
  <a href="https://lepczynski-cloud.github.io/misja-informatyka/"><strong>Uruchom aplikację online</strong></a>
  ·
  <a href="GITHUB-SETUP.md">Konfiguracja repozytorium</a>
  ·
  <a href="docs/ADDING-TASKS.md">Dodawanie zadań</a>
  ·
  <a href="docs/SOURCES.md">Źródła merytoryczne</a>
</p>

<p align="center">
  <a href="https://github.com/lepczynski-cloud/misja-informatyka/actions/workflows/ci.yml"><img alt="Walidacja" src="https://github.com/lepczynski-cloud/misja-informatyka/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="Zadania" src="https://img.shields.io/badge/zadania-1686-5b4bdb">
  <img alt="Cyberbezpieczeństwo" src="https://img.shields.io/badge/cyberbezpieczeństwo-478-c34862">
  <img alt="Prawda lub fałsz" src="https://img.shields.io/badge/Prawda%20lub%20fałsz-400-0a8f78">
  <a href="LICENSE"><img alt="Licencja MIT" src="https://img.shields.io/badge/kod-MIT-1677c8"></a>
  <a href="CONTENT-LICENSE.md"><img alt="Treści CC BY 4.0" src="https://img.shields.io/badge/treści-CC%20BY%204.0-d36b29"></a>
</p>

> [!IMPORTANT]
> **Projekt jest w fazie budowy.** Aplikacja jest gotowa do testów i ćwiczeń, ale treści, mechaniki oraz interfejs będą nadal rozwijane. To uzupełnienie lekcji, a nie oficjalny podręcznik, system egzaminacyjny ani zamiennik Scratcha, arkusza kalkulacyjnego lub pracy nauczyciela.

![Strona główna aplikacji Misja: Informatyka](docs/screenshots/home-preview.png)

## Po co powstał ten projekt

Misja: Informatyka ma ułatwiać krótkie i przyjemne powtórki bez instalowania programu i zakładania konta. Uczeń może sam wybrać klasę, temat, trudność oraz długość zestawu. Nauczyciel może przefiltrować cały katalog, przejrzeć zadania, wybrać konkretne pozycje i wysłać klasie gotowy link.

Zakres obejmuje wybrane obszary obecne w edukacji informatycznej: pracę z plikami, wyszukiwanie informacji, cyberbezpieczeństwo, logiczne rozwiązywanie problemów, dane, tworzenie materiałów cyfrowych, sieci, prawa autorskie oraz rozsądne korzystanie z narzędzi AI. Projekt nie próbuje realizować całej podstawy programowej i nie zastępuje praktycznej pracy w innych narzędziach.

## Najważniejsze funkcje

### Dla ucznia

- samodzielny wybór klasy od 3 do 8,
- wybór jednego z 9 obszarów tematycznych,
- filtrowanie poziomu trudności,
- losowanie zestawu 3, 5, 10, 15 lub 20 zadań,
- przeglądanie katalogu i uruchamianie pojedynczych misji,
- podpowiedź po pierwszej nieudanej próbie,
- wyjaśnienie odpowiedzi po zakończeniu zadania,
- duże przyciski Prawda i Fałsz w szybkich zadaniach,
- gwiazdki, odznaki, fanfary i konfetti,
- powtórka całego zestawu lub tylko zadań, które sprawiły trudność,
- podsumowanie do pokazania nauczycielowi,
- dyplom do wydrukowania.

### Dla nauczyciela

- filtrowanie według klasy, tematu, trudności i rodzaju zadania,
- wyszukiwanie po tytule, sytuacji, pytaniu i odpowiedziach,
- pełna przewijana lista wszystkich zadań pasujących do filtrów,
- podgląd krótkiego opisu przed zaznaczeniem zadania,
- ręczny wybór konkretnych zadań,
- szybkie losowanie 3, 5, 10, 15 lub 20 zadań,
- gotowe propozycje zestawów,
- nazwanie i przetasowanie zestawu,
- utworzenie linku działającego na innym urządzeniu,
- użycie systemowego okna udostępniania na telefonie,
- pobranie konfiguracji zestawu w formacie JSON,
- maksymalnie 30 zadań w jednym udostępnionym zestawie.

![Kreator zestawu dla nauczyciela](docs/screenshots/teacher-preview.png)

## Katalog zadań

Wersja 0.3.0 zawiera **1686 zadań**, w tym 1200 nowych pozycji przygotowanych dla tej wersji:

- 800 nowych zadań jednokrotnego wyboru,
- 400 nowych zadań Prawda lub Fałsz,
- 478 zadań z cyberbezpieczeństwa,
- 246 zadań o świadomym korzystaniu z AI,
- 412 rozbudowanych scenariuszy cyberbezpieczeństwa,
- najwięcej materiału dla klas 5 i 6.

### Liczba zadań według klasy

| Klasa | Liczba zadań |
|---|---:|
| 3 | 185 |
| 4 | 225 |
| 5 | 395 |
| 6 | 395 |
| 7 | 265 |
| 8 | 221 |

### Liczba zadań według obszaru

| Obszar | Liczba zadań | Przykładowe zagadnienia |
|---|---:|---|
| Komputer i pliki | 158 | urządzenia, foldery, formaty, kopie zapasowe, porządek cyfrowy |
| Internet i wyszukiwanie | 204 | skuteczne zapytania, adresy stron, źródła i wiarygodność informacji |
| Cyberbezpieczeństwo | 478 | phishing, SMS-y, hasła, konta, prywatność, aktualizacje i reakcje na zagrożenia |
| Logika i algorytmy | 140 | warunki, pętle, zmienne, analiza instrukcji i znajdowanie błędów |
| Dane i arkusz | 130 | tabele, formuły, wykresy, sortowanie, filtrowanie i interpretacja |
| Tworzenie cyfrowe | 122 | dokumenty, prezentacje, grafika, multimedia i podstawy WWW |
| AI z głową | 246 | lepsze pytania, doprecyzowanie celu, wyszukiwanie, weryfikacja i prywatność |
| Sieci i WWW | 112 | Wi-Fi, router, DNS, adres IP, serwer i droga danych |
| Prawo i kultura cyfrowa | 96 | prawa autorskie, licencje, netykieta, współpraca i ślad cyfrowy |

### Rodzaje zadań

| Rodzaj | Liczba |
|---|---:|
| Jedna poprawna odpowiedź | 1246 |
| Prawda lub Fałsz | 400 |
| Łączenie elementów w pary | 25 |
| Kilka poprawnych odpowiedzi | 11 |
| Krótka odpowiedź wpisywana | 4 |

Zrezygnowano z zadań wymagających układania niejednoznacznych czynności w kolejności. Pytania dotyczące procesów wymagają teraz wyboru najlepszego działania, warunku, celu albo reakcji.

## Cyberbezpieczeństwo w praktyce

Zadania nie ograniczają się do definicji. Uczeń analizuje przykładowe wiadomości e-mail, SMS-y, prośby o kod, fałszywe logowanie, podejrzane aplikacje, publiczne Wi-Fi, wycieki danych i próby podszywania się pod znajomych.

Dłuższe scenariusze pytają między innymi:

- które elementy wiadomości powinny wzbudzić podejrzenie,
- jak sprawdzić nadawcę niezależnym kanałem,
- dlaczego kłódka HTTPS nie potwierdza uczciwości strony,
- co zrobić po wpisaniu hasła na fałszywej stronie,
- kiedy zgłosić podejrzany SMS na numer 8080,
- jak chronić kody logowania i odzyskiwania,
- jak reagować na szantaż, nękanie i przejęte konto.

## AI bez wymagania specjalistycznej terminologii

Zadania o AI skupiają się na codziennym użyciu. Uczeń ćwiczy:

- opisanie celu i odbiorcy odpowiedzi,
- określenie długości, formatu i poziomu trudności,
- proszenie o prostsze wyjaśnienie i przykład,
- zadawanie pytań naprowadzających zamiast pobierania gotowej pracy,
- poprawianie źle sformatowanej odpowiedzi,
- sprawdzanie dat, obliczeń, źródeł i cytowań,
- usuwanie danych osobowych przed wklejeniem tekstu,
- porównywanie odpowiedzi z aktualnymi, wiarygodnymi materiałami.

## Kontrola jakości odpowiedzi

W poprzednim katalogu poprawna odpowiedź była jednoznacznie najdłuższa w około 85% zadań jednokrotnego wyboru. W wersji 0.3.0 automatyczny audyt obniżył ten udział do około **22%**.

Walidator sprawdza również:

- rozkład poprawnych odpowiedzi między pozycjami,
- średnią długość odpowiedzi poprawnych i błędnych,
- równowagę 200 odpowiedzi Prawda i 200 odpowiedzi Fałsz,
- brak dokładnie powtórzonych treści,
- brak nieznanych typów, tematów i źródeł,
- minimalną długość kontekstu w zadaniach Prawda lub Fałsz,
- liczbę rozbudowanych scenariuszy cyberbezpieczeństwa.

Dzięki temu zasada „wybierz najdłuższą odpowiedź” nie jest skuteczną strategią.

## Źródła i sposób przygotowania treści

Pytania są autorskie. Nie zostały skopiowane z gotowych testów. Zakres, zasady bezpieczeństwa i fakty wykorzystane przy ich przygotowaniu oparto na materiałach instytucji publicznych oraz oficjalnej dokumentacji, między innymi MEN, ZPE, CERT Polska, Gov.pl, UODO, OSE, Google, Microsoft, Creative Commons i MDN.

Każde zadanie ma w pliku JSON pole `sourceKeys`, które wskazuje źródła wykorzystane do kontroli merytorycznej. Pełny katalog znajduje się w:

- [`public/data/sources.json`](public/data/sources.json),
- [`docs/SOURCES.md`](docs/SOURCES.md).

Przypisanie źródła oznacza podstawę merytoryczną, a nie zatwierdzenie konkretnego pytania przez daną instytucję.

## Prywatność i działanie bez kont

Aplikacja nie ma backendu i nie wymaga logowania. Nie przechowuje imion, odpowiedzi ani wyników uczniów na serwerze. Nie zawiera reklam, analityki ani zewnętrznych skryptów śledzących.

- Link od nauczyciela zawiera tylko nazwę zestawu i identyfikatory zadań.
- Wynik istnieje wyłącznie w aktualnej sesji przeglądarki.
- Jedynym ustawieniem zapisywanym lokalnie jest wybrany motyw.
- Po pierwszym uruchomieniu online aplikacja może działać offline dzięki service workerowi.

Brak centralnego zapisu wyników jest świadomym założeniem. Dzięki temu aplikacja nie wymaga kont dzieci ani utrzymywania bazy danych.

## Motyw i dostępność

Domyślnie aplikacja korzysta z motywu systemowego. Użytkownik może ręcznie wybrać motyw jasny albo ciemny. Interfejs jest responsywny i działa na telefonach, tabletach oraz komputerach.

![Przykładowe zadanie w ciemnym motywie](docs/screenshots/quiz-dark-preview.png)

Projekt uwzględnia między innymi:

- obsługę klawiatury,
- widoczne stany fokusu,
- semantyczne nagłówki i etykiety pól,
- komunikaty dla czytników ekranu,
- ograniczenie animacji zgodnie z ustawieniem systemowym,
- czytelny kontrast w jasnym i ciemnym motywie.

## Uruchomienie lokalne

Wymagany jest Node.js 20 lub nowszy.

```bash
git clone https://github.com/lepczynski-cloud/misja-informatyka.git
cd misja-informatyka
npm ci
npm run dev
```

Aplikacja będzie dostępna pod adresem:

```text
http://127.0.0.1:4173
```

Nie należy otwierać `index.html` bezpośrednio przez `file://`, ponieważ przeglądarka może zablokować wczytanie katalogu JSON.

### Dostępne polecenia

```bash
npm run dev       # lokalny serwer dla katalogu public
npm run validate  # kontrola katalogu zadań, źródeł i składni JavaScript
npm run build     # budowanie gotowej strony do katalogu dist
npm run preview   # budowanie i podgląd katalogu dist
npm test          # pełna walidacja i budowanie
```

## Dodawanie nowych zadań

Treści są przechowywane w pliku:

```text
public/data/tasks.json
```

Katalog źródeł znajduje się w:

```text
public/data/sources.json
```

Szczegółowe przykłady i zasady znajdują się w dokumentach:

- [Dodawanie zadań](docs/ADDING-TASKS.md)
- [Zasady tworzenia treści](docs/CONTENT-GUIDE.md)
- [Źródła merytoryczne](docs/SOURCES.md)
- [Architektura projektu](docs/ARCHITECTURE.md)
- [Współpraca przy projekcie](CONTRIBUTING.md)

Po zmianie katalogu należy uruchomić:

```bash
npm run validate
```

## Struktura repozytorium

```text
misja-informatyka/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── docs/
│   ├── screenshots/
│   ├── ADDING-TASKS.md
│   ├── ARCHITECTURE.md
│   ├── CONTENT-GUIDE.md
│   └── SOURCES.md
├── public/
│   ├── assets/
│   ├── data/
│   │   ├── sources.json
│   │   └── tasks.json
│   ├── app.js
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   └── styles.css
├── scripts/
│   ├── build.mjs
│   ├── serve.mjs
│   └── validate-tasks.mjs
├── CONTRIBUTING.md
├── GITHUB-SETUP.md
├── package.json
└── README.md
```

Katalog `dist` jest generowany automatycznie i nie trzeba go ręcznie edytować.

## Plan rozwoju

- przegląd treści z nauczycielami oraz uczniami,
- poprawianie pytań na podstawie zgłoszeń,
- kolejne praktyczne scenariusze,
- lepszy podgląd zestawu przed wysłaniem,
- opcjonalny kod QR tworzony lokalnie w przeglądarce,
- możliwość importowania własnego zestawu przez ucznia,
- dalsze testy dostępności i użyteczności,
- oznaczenie wersji stabilnej po zebraniu opinii.

Pomysły i błędy można zgłaszać przez [GitHub Issues](https://github.com/lepczynski-cloud/misja-informatyka/issues).

## Licencje

- Kod aplikacji: [MIT](LICENSE)
- Treści edukacyjne w `public/data/tasks.json`: [CC BY 4.0](CONTENT-LICENSE.md)

Autor: Wojciech Lepczyński
