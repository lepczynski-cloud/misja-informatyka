# Architektura projektu

## Założenia

Projekt jest statyczną aplikacją typu single-page application bez frameworka i backendu. Nie wymaga kont użytkowników i może być rozwijany przez osoby znające podstawy HTML, CSS, JavaScript oraz JSON.

## Przepływ danych

1. `index.html` uruchamia interfejs.
2. `app.js` wczytuje `data/tasks.json` przez `fetch`.
3. Zadania są indeksowane po stabilnym `id`.
4. Wybrany widok jest renderowany po stronie przeglądarki.
5. Sesja quizu istnieje tylko w pamięci bieżącej karty.
6. Po odświeżeniu wynik nie jest odtwarzany.

Katalog źródeł `data/sources.json` nie jest potrzebny do rozwiązywania quizu. Służy dokumentacji, kontroli merytorycznej i walidacji repozytorium.

## Widok nauczyciela

Katalog nauczyciela renderuje pełną listę zadań pasujących do aktywnych filtrów. Lista ma własny obszar przewijania, dzięki czemu można przeglądać wiele pozycji bez utraty panelu filtrów i zestawu.

Wybrane zadania są przechowywane w `Set`, co zapobiega duplikatom. Jeden udostępniony zestaw może zawierać maksymalnie 30 pozycji.

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

## Typy zadań

Obsługiwane typy:

```text
choice
truefalse
multi
match
input
```

Typy `sort` i `order` nie są obsługiwane. Zadania dotyczące procesów powinny pytać o jednoznaczny krok, warunek, cel, błąd albo najlepszą decyzję.

## Katalog wersji 0.3.0

- 1686 zadań,
- 1246 zadań `choice`,
- 400 zadań `truefalse`,
- 11 zadań `multi`,
- 25 zadań `match`,
- 4 zadania `input`,
- 478 zadań z cyberbezpieczeństwa,
- 246 zadań o AI,
- 14 źródeł merytorycznych.

## Budowanie

Źródła strony znajdują się w `public`. Skrypt `scripts/build.mjs`:

- usuwa poprzedni katalog `dist`,
- kopiuje pliki z `public`,
- wstawia numer wersji do nazwy pamięci podręcznej service workera,
- tworzy plik `.nojekyll`.

Katalog `dist` jest gotowym artefaktem statycznej strony.

## Walidacja zadań

`scripts/validate-tasks.mjs` sprawdza:

- format i unikalność identyfikatorów,
- klasy od 3 do 8,
- listę tematów i pięciu obsługiwanych typów,
- obecność treści, podpowiedzi i wyjaśnienia,
- indeksy poprawnych odpowiedzi,
- unikalność opcji i par,
- dokładną liczbę zadań według klasy, tematu i typu,
- 400 zadań Prawda lub Fałsz z równowagą 200 do 200,
- minimalną długość kontekstu w zadaniach Prawda lub Fałsz,
- co najmniej 350 dłuższych scenariuszy cyberbezpieczeństwa,
- brak zadań `sort`,
- brak dokładnie powtórzonych historii i pytań,
- udział pytań jednokrotnego wyboru,
- rozkład poprawnych odpowiedzi między pozycjami,
- częstość, z jaką poprawna odpowiedź jest najdłuższa,
- średnią długość odpowiedzi poprawnych i błędnych,
- obecność oraz poprawność kluczy źródeł,
- unikalność i adresy HTTPS w katalogu źródeł.

Błąd walidacji zatrzymuje workflow przed wdrożeniem.

## Audyt długości odpowiedzi

W wersji 0.2.0 poprawna odpowiedź była jednoznacznie najdłuższa w około 84,9% pytań `choice`. W wersji 0.3.0 udział wynosi około 21,6%.

Generator treści nie wydłuża sztucznie poprawnych odpowiedzi. W zadaniach, w których długość tworzyłaby nadmierną podpowiedź, uzupełnia jeden z wiarygodnych dystraktorów neutralnym doprecyzowaniem. Walidator pilnuje, aby wzorzec nie wrócił w kolejnych zmianach.

## Tryb offline

`service-worker.js` zapisuje podstawowe pliki aplikacji w Cache Storage. Po pierwszej poprawnej wizycie przez HTTPS aplikacja może otworzyć się bez połączenia z internetem.

Numer pamięci podręcznej korzysta z wersji w `package.json`. Przy zmianie plików przeznaczonych do publikacji należy podnieść wersję, aby użytkownicy otrzymali nowy zestaw zasobów.

## Motyw

Atrybut `data-theme` na elemencie `html` przyjmuje:

```text
system
light
dark
```

Wartość `system` korzysta z `prefers-color-scheme`. Ręczny wybór jest zapisywany w `localStorage`. Aplikacja działa także wtedy, gdy przeglądarka blokuje zapis lokalny.

## Brak zewnętrznych zależności w aplikacji

Kod uruchamiany przez ucznia nie pobiera bibliotek z CDN. Daje to:

- szybsze i bardziej przewidywalne uruchamianie,
- łatwiejszą pracę offline,
- mniej zależności od zewnętrznych usług,
- brak dodatkowych skryptów śledzących,
- prostsze wdrażanie jako statyczna strona.
