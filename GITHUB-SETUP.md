# Publikacja projektu na GitHubie

## Proponowana nazwa

Nazwa repozytorium:

```text
misja-informatyka
```

Nazwa aplikacji widoczna dla użytkowników:

```text
Misja: Informatyka
```

Krótki opis repozytorium:

```text
Interaktywna aplikacja przeglądarkowa z zadaniami z informatyki dla uczniów klas 3–8, kreatorem zestawów dla nauczyciela i trybem samodzielnej nauki.
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

## 1. Utworzenie repozytorium

1. Zaloguj się na GitHubie.
2. Wybierz `New repository`.
3. Ustaw właściciela `lepczynski-cloud`.
4. Wpisz nazwę `misja-informatyka`.
5. Wybierz repozytorium publiczne.
6. Nie twórz dodatkowego README, `.gitignore` ani licencji, ponieważ wszystkie te pliki są już w paczce.
7. Utwórz repozytorium.

## 2. Wysłanie plików przez terminal

Po rozpakowaniu paczki przejdź do katalogu projektu i wykonaj:

```bash
git init
git add .
git commit -m "Initial release of Misja Informatyka"
git branch -M main
git remote add origin https://github.com/lepczynski-cloud/misja-informatyka.git
git push -u origin main
```

Alternatywnie można użyć GitHub Desktop albo funkcji `Add file` i `Upload files` w przeglądarce. Do repozytorium należy wysłać zawartość katalogu projektu, tak aby `README.md`, `package.json`, `public` i `.github` znajdowały się bezpośrednio w katalogu głównym repozytorium.

## 3. Włączenie GitHub Pages

Po pierwszym pushu:

1. Otwórz repozytorium na GitHubie.
2. Przejdź do `Settings`.
3. W menu bocznym wybierz `Pages`.
4. W sekcji `Build and deployment` ustaw `Source` na `GitHub Actions`.
5. Pozostałe ustawienia pozostaw bez zmian.

Workflow znajduje się w pliku:

```text
.github/workflows/pages.yml
```

Uruchamia się automatycznie po pushu do gałęzi `main`. Można go także uruchomić ręcznie w zakładce `Actions`.

## 4. Sprawdzenie wdrożenia

W zakładce `Actions` powinien pojawić się workflow:

```text
Test and deploy GitHub Pages
```

Wykonuje on kolejno:

- instalację środowiska,
- walidację 162 zadań,
- kontrolę składni JavaScript,
- budowanie katalogu `dist`,
- publikację na GitHub Pages.

Po pomyślnym zakończeniu aplikacja powinna działać pod adresem:

```text
https://lepczynski-cloud.github.io/misja-informatyka/
```

Każda kolejna zmiana wysłana do `main` automatycznie uruchomi nowe testy i wdrożenie.

## 5. Ustawienia repozytorium

W sekcji `About` warto uzupełnić:

- opis repozytorium podany na początku tej instrukcji,
- adres strony `https://lepczynski-cloud.github.io/misja-informatyka/`,
- proponowane topics.

Warto również włączyć:

- `Issues`, aby użytkownicy mogli zgłaszać błędy i pomysły,
- `Discussions`, jeśli projekt zacznie być używany przez więcej nauczycieli,
- ochronę gałęzi `main`, gdy pojawią się współautorzy.

## 6. Test lokalny przed wysłaniem zmian

```bash
npm ci
npm test
npm run dev
```

Aplikacja będzie dostępna lokalnie pod adresem:

```text
http://127.0.0.1:4173
```

## 7. Czy potrzebna jest subdomena

Na początku nie jest potrzebna. GitHub Pages zapewnia HTTPS i jeden stały adres działający na telefonie, tablecie oraz komputerze. Link można zapisać jako zakładkę albo dodać aplikację do ekranu głównego.

Subdomenę, na przykład:

```text
informatyka.lepczynski.it
```

można dodać później bez zmiany kodu aplikacji. Do pierwszych testów i udostępniania projektu prostszy będzie standardowy adres GitHub Pages.

## 8. Najczęstsze problemy

### Strona wyświetla błąd 404

- sprawdź, czy repozytorium nazywa się dokładnie `misja-informatyka`,
- sprawdź, czy gałąź główna nazywa się `main`,
- otwórz `Settings`, następnie `Pages`, i wybierz `GitHub Actions`,
- sprawdź ostatni przebieg workflow w zakładce `Actions`.

### Workflow zatrzymuje się na walidacji

Otwórz log kroku `Sprawdź katalog zadań i kod`. Walidator poda identyfikator zadania oraz opis problemu. Popraw plik `public/data/tasks.json` i ponownie wyślij commit.

### Aplikacja działa, ale stara wersja nadal jest widoczna

Service worker przechowuje pliki do pracy offline. Po wdrożeniu nowej wersji odśwież stronę. W razie potrzeby zamknij wszystkie jej karty i otwórz ją ponownie. Numer pamięci podręcznej jest zmieniany razem z wersją w `package.json`.

### Link nauczyciela jest długi

Jest to oczekiwane, ponieważ link zawiera identyfikatory wybranych zadań i nie korzysta z bazy danych. Maksymalna liczba zadań w jednym linku została ograniczona do 30.
