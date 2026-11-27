# Dodawanie zadań

Wszystkie zadania znajdują się w pliku:

```text
public/data/tasks.json
```

Plik zawiera jedną tablicę obiektów JSON. Po każdej zmianie uruchom:

```bash
npm run validate
```

Walidator sprawdza identyfikatory, klasy, tematy, trudność, wymagane pola oraz poprawność odpowiedzi dla każdego typu ćwiczenia.

## Pola wspólne

Każde zadanie zawiera:

```json
{
  "id": "k5-bezpieczenstwo-04",
  "grades": [5],
  "topic": "bezpieczenstwo",
  "difficulty": 2,
  "type": "choice",
  "title": "Krótki tytuł",
  "story": "Krótka sytuacja wprowadzająca ucznia w zadanie.",
  "prompt": "Jasne polecenie lub pytanie.",
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

Identyfikator musi być unikalny i stabilny. Nie zmieniaj istniejącego `id` bez ważnego powodu, ponieważ linki przygotowane wcześniej przez nauczycieli odwołują się właśnie do identyfikatorów.

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

Trudność powinna uwzględniać klasę. To samo zagadnienie może być łatwe dla klasy 8, ale trudne dla klasy 5.

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
    "Nazwę domeny",
    "Kolor przycisku",
    "Liczbę obrazków",
    "Godzinę na zegarze"
  ],
  "answer": 0,
  "hint": "Pomyśl, który element wskazuje właściciela miejsca w sieci.",
  "explanation": "Nazwa domeny pomaga rozpoznać, do jakiej strony naprawdę prowadzi adres."
}
```

## Typ `multi`

Kilka poprawnych odpowiedzi. `answer` jest tablicą indeksów.

```json
{
  "id": "k6-ai-04",
  "grades": [6],
  "topic": "ai",
  "difficulty": 2,
  "type": "multi",
  "title": "Sprawdź podpowiedź AI",
  "story": "Chatbot podał trzy fakty potrzebne do prezentacji.",
  "prompt": "Co warto zrobić przed użyciem odpowiedzi?",
  "options": [
    "Porównać informacje z wiarygodnym źródłem",
    "Sprawdzić, czy odpowiedź pasuje do pytania",
    "Wkleić ją bez czytania",
    "Usunąć nazwę autora źródła"
  ],
  "answer": [0, 1],
  "hint": "Dobra odpowiedź nadal może zawierać błąd albo dotyczyć innego problemu.",
  "explanation": "Odpowiedź AI trzeba przeczytać, ocenić i porównać z wiarygodnymi materiałami."
}
```

## Typ `order`

Uczeń układa kroki. `items` zawiera elementy, a `answer` ich poprawną kolejność.

```json
{
  "id": "k4-algorytmy-04",
  "grades": [4],
  "topic": "algorytmy",
  "difficulty": 1,
  "type": "order",
  "title": "Bezpieczne zapisanie pracy",
  "story": "Olek kończy rysunek i chce zachować go w odpowiednim folderze.",
  "prompt": "Ułóż kroki we właściwej kolejności.",
  "items": [
    "Wybrać polecenie Zapisz jako",
    "Wskazać właściwy folder",
    "Nadać plikowi czytelną nazwę",
    "Potwierdzić zapis"
  ],
  "answer": [
    "Wybrać polecenie Zapisz jako",
    "Wskazać właściwy folder",
    "Nadać plikowi czytelną nazwę",
    "Potwierdzić zapis"
  ],
  "hint": "Zacznij od polecenia, które otwiera okno wyboru miejsca i nazwy.",
  "explanation": "Najpierw otwieramy zapis, później wybieramy miejsce i nazwę, a na końcu potwierdzamy."
}
```

Elementy w `items` muszą być unikalne.

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
  "title": "Wynik pętli",
  "story": "Program dodaje kolejne liczby do zmiennej wynik.",
  "prompt": "Jaka będzie wartość po dodaniu liczb 1, 2 i 3?",
  "placeholder": "Wpisz liczbę",
  "answers": ["6", "sześć"],
  "hint": "Dodaj wszystkie trzy liczby po kolei.",
  "explanation": "1 + 2 + 3 daje 6."
}
```

## Kontrola przed wysłaniem zmiany

1. Sprawdź poprawność merytoryczną.
2. Przeczytaj zadanie jak uczeń z podanej klasy.
3. Upewnij się, że podpowiedź pomaga, ale nie kopiuje odpowiedzi.
4. Sprawdź, czy wyjaśnienie mówi także dlaczego.
5. Uruchom `npm run validate`.
6. Uruchom aplikację przez `npm run dev` i rozwiąż nowe zadanie.
7. Nie zmieniaj identyfikatorów istniejących zadań bez potrzeby.
