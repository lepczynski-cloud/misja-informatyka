# Dodanie projektu do GitHuba

## Proponowana nazwa

Nazwa repozytorium:

```text
misja-informatyka
```

Nazwa aplikacji:

```text
Misja: Informatyka
```

Opis repozytorium:

```text
Interaktywna aplikacja przeglądarkowa z 1686 zadaniami z informatyki dla uczniów klas 3–8, kreatorem zestawów dla nauczyciela i trybem samodzielnej nauki.
```

Proponowane topics:

```text
education
informatyka
polish
primary-school
learning
quiz
pwa
offline-first
github-pages
javascript
cybersecurity
```

## Utworzenie repozytorium

1. Utwórz na GitHubie publiczne repozytorium `misja-informatyka`.
2. Nie dodawaj automatycznie README, licencji ani `.gitignore`, ponieważ znajdują się już w paczce.
3. Rozpakuj ZIP.
4. Wgraj zawartość katalogu `misja-informatyka` do głównego katalogu repozytorium.

Przykład z terminala:

```bash
cd misja-informatyka
git init
git add .
git commit -m "Release Misja Informatyka 0.3.0"
git branch -M main
git remote add origin https://github.com/lepczynski-cloud/misja-informatyka.git
git push -u origin main
```

## Uruchomienie GitHub Pages

1. Otwórz `Settings` w repozytorium.
2. Przejdź do `Pages`.
3. W sekcji `Build and deployment` ustaw źródło `GitHub Actions`.
4. Otwórz kartę `Actions` i sprawdź workflow `Test and deploy GitHub Pages`.
5. Po poprawnym wdrożeniu aplikacja będzie dostępna pod adresem:

```text
https://lepczynski-cloud.github.io/misja-informatyka/
```

Workflow uruchamia się po każdym wysłaniu zmian do gałęzi `main`.

## Co sprawdza GitHub Actions

Przed wdrożeniem workflow wykonuje:

```bash
npm ci
npm run validate
npm run build
```

Walidacja obejmuje między innymi:

- 1686 zadań,
- 14 źródeł merytorycznych,
- poprawność struktury JSON,
- 400 zadań Prawda lub Fałsz,
- 478 zadań z cyberbezpieczeństwa,
- rozkład odpowiedzi między pozycjami,
- kontrolę długości odpowiedzi,
- brak nieznanych kluczy źródeł,
- brak dokładnie powtórzonych pytań,
- składnię JavaScript.

## Lokalny test przed wysłaniem zmian

Wymagany jest Node.js 20 lub nowszy.

```bash
npm ci
npm test
npm run dev
```

Aplikacja będzie dostępna pod adresem:

```text
http://127.0.0.1:4173
```

## Adres niestandardowy

Subdomena nie jest potrzebna do uruchomienia projektu. Standardowy adres GitHub Pages działa przez HTTPS na komputerach i telefonach.

Własną subdomenę, na przykład `informatyka.lepczynski.it`, można dodać później. Nie wymaga to przebudowania aplikacji, ale wymaga skonfigurowania domeny w GitHub Pages i rekordu DNS.

## Aktualizacje

Po zmianie plików:

```bash
git add .
git commit -m "Opis zmiany"
git push
```

GitHub Actions ponownie przetestuje i opublikuje stronę.

## Ważne pliki

- `README.md`: główny opis projektu,
- `public/data/tasks.json`: katalog zadań,
- `public/data/sources.json`: katalog źródeł,
- `docs/ADDING-TASKS.md`: schemat dodawania zadań,
- `docs/CONTENT-GUIDE.md`: zasady redakcyjne,
- `docs/SOURCES.md`: opis źródeł,
- `.github/workflows/pages.yml`: walidacja i publikacja,
- `.github/workflows/ci.yml`: testy pull requestów i innych gałęzi.
