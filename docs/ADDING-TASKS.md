# Dodawanie zadań

Wszystkie zadania znajdują się w pliku:

```text
public/data/tasks.json
```

Plik zawiera jedną tablicę obiektów JSON. Po każdej zmianie uruchom:

```bash
npm run validate
```

Walidator sprawdza identyfikatory, klasy, tematy, trudność, wymagane pola, odpowiedzi oraz najważniejsze założenia całego katalogu.

## Pola wspólne

```json
{
  "id": "k5-bezpieczenstwo-04",
  "grades": [5],
  "topic": "bezpieczenstwo",
  "difficulty": 2,
  "type": "choice",
  "title": "Krótki tytuł",
  "story": "Konkretna sytuacja wprowadzająca ucznia w zadanie.",
  "prompt": "Jasne pytanie lub polecenie.",
  "hint": "Podpowiedź, która pomaga pomyśleć, ale nie zdradza od razu rozwiązania.",
  "explanation": "Wyjaśnienie, dlaczego odpowiedź jest poprawna."
}
```

### `id`

Format:

```text
k{klasa}-{temat}-{numer}
```

Przykład:

```text
k5-bezpieczenstwo-04
```

Identyfikator musi być unikalny i stabilny. Linki przygotowane przez nauczycieli odwołują się właśnie do `id`.

### `grades`

Lista klas, dla których zadanie jest odpowiednie:

```json
"grades": [5]
```

Można wskazać kilka klas:

```json
"grades": [5, 6]
```

### `topic`

Dopuszczalne wartości:

```text
komputer
internet
bezpieczenstwo
algorytmy
dane
tworzenie
ai
sieci
prawo
```

### `difficulty`

- `1` oznacza rozgrzewkę,
- `2` oznacza wyzwanie,
- `3` oznacza misję specjalną.

Trudność należy oceniać względem wskazanej klasy.

## Typ `choice`

Jedna poprawna odpowiedź. `answer` jest indeksem elementu w tablicy `options`, liczonym od zera.

```json
{
  "id": "k5-internet-04",
  "grades": [5],
  "topic": "internet",
  "difficulty": 1,
  "type": "choice",
  "title": "Adres strony",
  "story": "Maja dostała kilka podobnych adresów i szuka oficjalnej strony muzeum.",
  "prompt": "Który fragment adresu warto sprawdzić szczególnie uważnie?",
  "options": [
    "Kolor przycisku",
    "Liczbę obrazków",
    "Nazwę domeny",
    "Godzinę na zegarze"
  ],
  "answer": 2,
  "hint": "Pomyśl, który element wskazuje właściciela miejsca w sieci.",
  "explanation": "Nazwa domeny pomaga rozpoznać, do jakiej strony naprawdę prowadzi adres."
}
```

Pytanie musi mieć jedną jednoznacznie najlepszą odpowiedź. Nie należy tworzyć zadań, w których kilka czynności można poprawnie wykonać w dowolnej kolejności.

Pozycję poprawnej odpowiedzi należy zmieniać między zadaniami. Walidator kontroluje rozkład indeksów w całym katalogu.

## Typ `multi`

Kilka poprawnych odpowiedzi. `answer` jest tablicą indeksów.

```json
{
  "id": "k6-ai-04",
  "grades": [6],
  "topic": "ai",
  "difficulty": 2,
  "type": "multi",
  "title": "Sprawdź podpowiedź narzędzia",
  "story": "Narzędzie podało trzy fakty potrzebne do prezentacji.",
  "prompt": "Co warto zrobić przed wykorzystaniem odpowiedzi?",
  "options": [
    "Porównać informacje z wiarygodnym źródłem",
    "Sprawdzić, czy odpowiedź pasuje do pytania",
    "Wkleić ją bez czytania",
    "Usunąć nazwę autora źródła"
  ],
  "answer": [0, 1],
  "hint": "Dobra odpowiedź nadal może zawierać błąd albo dotyczyć innego problemu.",
  "explanation": "Odpowiedź trzeba przeczytać, ocenić i porównać z wiarygodnymi materiałami."
}
```

## Typ `match`

Uczeń łączy lewe elementy z prawymi. Każda prawa odpowiedź musi być unikalna.

```json
{
  "id": "k5-komputer-04",
  "grades": [5],
  "topic": "komputer",
  "difficulty": 1,
  "type": "match",
  "title": "Pliki w odpowiednich szufladach",
  "story": "W szkolnym folderze pomieszały się dokumenty, grafiki i nagrania.",
  "prompt": "Połącz rozszerzenie z typem pliku.",
  "pairs": [
    [".png", "obraz"],
    [".mp3", "dźwięk"],
    [".pdf", "dokument"],
    [".mp4", "film"]
  ],
  "hint": "Przypomnij sobie rozszerzenia widoczne na końcu nazw plików.",
  "explanation": "Rozszerzenie podpowiada systemowi i użytkownikowi, jakiego rodzaju dane zawiera plik."
}
```

## Typ `sort`

Uczeń przyporządkowuje elementy do kategorii.

```json
{
  "id": "k4-bezpieczenstwo-04",
  "grades": [4],
  "topic": "bezpieczenstwo",
  "difficulty": 1,
  "type": "sort",
  "title": "Mogę podać czy zachowuję dla siebie?",
  "story": "Gra pyta o kilka informacji potrzebnych rzekomo do odebrania nagrody.",
  "prompt": "Przyporządkuj informacje do właściwych kategorii.",
  "categories": [
    {
      "name": "Można podać w szkolnym zadaniu",
      "items": ["ulubiony kolor", "nazwa wymyślonej drużyny"]
    },
    {
      "name": "Dane prywatne",
      "items": ["hasło", "adres zamieszkania", "kod otrzymany SMS-em"]
    }
  ],
  "hint": "Dane pozwalające wejść na konto lub odnaleźć konkretną osobę wymagają szczególnej ochrony.",
  "explanation": "Haseł, kodów logowania i dokładnego adresu nie należy podawać obcym osobom ani przypadkowym aplikacjom."
}
```

Nazwy kategorii i wszystkie elementy muszą być unikalne.

## Typ `input`

Uczeń wpisuje krótką odpowiedź. W `answers` można dodać kilka równoważnych wariantów. Porównanie ignoruje wielkość liter, dodatkowe spacje i polskie znaki diakrytyczne.

```json
{
  "id": "k7-algorytmy-04",
  "grades": [7],
  "topic": "algorytmy",
  "difficulty": 2,
  "type": "input",
  "title": "Wynik obliczenia",
  "story": "Program dodaje kolejne liczby do zmiennej wynik.",
  "prompt": "Jaka będzie wartość po dodaniu liczb 1, 2 i 3?",
  "placeholder": "Wpisz liczbę",
  "answers": ["6", "sześć"],
  "hint": "Dodaj wszystkie trzy liczby.",
  "explanation": "1 + 2 + 3 daje 6."
}
```

## Kontrola przed wysłaniem zmiany

1. Sprawdź poprawność merytoryczną.
2. Przeczytaj zadanie z perspektywy ucznia danej klasy.
3. Upewnij się, że pytanie jest jednoznaczne.
4. Sprawdź, czy błędne odpowiedzi są wiarygodne, ale nie podchwytliwe.
5. Upewnij się, że podpowiedź pomaga, ale nie kopiuje odpowiedzi.
6. Sprawdź, czy wyjaśnienie mówi także dlaczego.
7. Uruchom `npm run validate`.
8. Uruchom aplikację przez `npm run dev` i rozwiąż nowe zadanie.
9. Nie zmieniaj identyfikatorów istniejących zadań bez potrzeby.
