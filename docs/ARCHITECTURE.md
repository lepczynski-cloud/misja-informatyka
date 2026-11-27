# Architektura projektu

## Założenia

Projekt jest statyczną aplikacją typu single-page application bez frameworka i bez backendu. Ma działać na GitHub Pages, nie wymagać kont użytkowników i pozostawać łatwy do rozwijania przez osoby znające podstawy HTML, CSS, JavaScript oraz JSON.

## Przepływ danych

1. `index.html` uruchamia interfejs.
2. `app.js` wczytuje `data/tasks.json` przez `fetch`.
3. Zadania są indeksowane po stabilnym `id`.
4. Wybrany widok jest renderowany po stronie przeglądarki.
5. Sesja quizu istnieje wyłącznie w pamięci bieżącej karty.
6. Po odświeżeniu wynik nie jest odtwarzany.

## Link nauczyciela

Kreator zapisuje konfigurację w parametrach adresu:

```text
?zestaw=id1.id2.id3&nazwa=Nazwa%20zestawu&v=1
```

Zalety:

- brak bazy danych,
- brak kont,
- zestaw można przesłać dowolnym kanałem,
- link działa na innym urządzeniu,
- nauczyciel nie przechowuje danych uczniów.

Ograniczenia:

- link może być długi,
- usunięcie lub zmiana `id` może uszkodzić stary zestaw,
- nauczyciel nie otrzymuje automatycznie wyników,
- konfiguracja nie jest zabezpieczonym sprawdzianem.

## Budowanie

Źródła strony znajdują się w `public`. Skrypt `scripts/build.mjs`:

- usuwa poprzedni katalog `dist`,
- kopiuje pliki z `public`,
- wstawia numer wersji do nazwy pamięci podręcznej service workera,
- tworzy plik `.nojekyll`.

Katalog `dist` jest artefaktem wdrożeniowym GitHub Pages.

## Walidacja zadań

`scripts/validate-tasks.mjs` sprawdza:

- format i unikalność identyfikatorów,
- zakres klas,
- listę tematów i typów,
- obecność treści,
- indeksy poprawnych odpowiedzi,
- zgodność elementów w zadaniach kolejnościowych,
- unikalność par oraz kategorii,
- minimalną liczbę zadań dla klas, tematów i typów.

Błąd walidacji zatrzymuje workflow przed wdrożeniem.

## Tryb offline

`service-worker.js` zapisuje podstawowe pliki aplikacji w Cache Storage. Po pierwszej poprawnej wizycie przez HTTPS aplikacja może otworzyć się bez połączenia z internetem.

Numer pamięci podręcznej korzysta z wersji w `package.json`. Przy zmianie plików przeznaczonych do publikacji należy podnieść wersję, aby użytkownicy szybciej otrzymali nowy zestaw zasobów.

## Motyw

Atrybut `data-theme` na elemencie `html` przyjmuje:

```text
system
light
dark
```

Wartość `system` korzysta z `prefers-color-scheme`. Ręczny wybór jest zapisywany w `localStorage`. Aplikacja działa także wtedy, gdy przeglądarka blokuje zapis lokalny.

## Brak zewnętrznych zależności w aplikacji

Kod uruchamiany przez ucznia nie pobiera bibliotek z CDN. Ma to kilka zalet:

- szybsze i bardziej przewidywalne uruchamianie,
- łatwiejsza praca offline,
- mniej zależności od zewnętrznych usług,
- brak dodatkowych skryptów mogących śledzić użytkownika,
- prostsza publikacja na GitHub Pages.
