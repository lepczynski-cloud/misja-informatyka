# Dodawanie zadań

## Pliki danych

Zadania znajdują się w:

```text
public/data/tasks.json
```

Źródła merytoryczne znajdują się w:

```text
public/data/sources.json
```

Po każdej zmianie uruchom:

```bash
npm run validate
```

## Wspólne pola

Każde zadanie powinno mieć:

```json
{
  "id": "k5-bezpieczenstwo-120",
  "grades": [5],
  "topic": "bezpieczenstwo",
  "difficulty": 2,
  "type": "choice",
  "title": "Krótki tytuł",
  "story": "Sytuacja, którą analizuje uczeń.",
  "prompt": "Jasne polecenie albo pytanie.",
  "hint": "Podpowiedź pomagająca pomyśleć, ale bez zdradzania odpowiedzi.",
  "explanation": "Wyjaśnienie zasady i powodu poprawności odpowiedzi.",
  "sourceKeys": ["CERT-PHISHING"]
}
```

### `id`

Format:

```text
k<klasa>-<temat>-<numer>
```

Przykłady:

```text
k3-komputer-087
k6-ai-142
k8-bezpieczenstwo-205
```

Identyfikator musi być unikalny i stabilny. Nie zmieniaj go po opublikowaniu, ponieważ może znajdować się w linkach przygotowanych przez nauczyciela.

### `grades`

Dozwolone klasy:

```json
[3]
[5, 6]
[7, 8]
```

### `topic`

Dozwolone wartości:

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

```text
1: łatwe
2: średnie
3: trudniejsze
```

### `sourceKeys`

Wpisz co najmniej jeden klucz istniejący w `public/data/sources.json`.

Przykład:

```json
"sourceKeys": ["CERT-PHISHING", "GOV-PHISHING"]
```

Klucz opisuje podstawę merytoryczną pytania. Nie oznacza zatwierdzenia zadania przez daną instytucję.

## Typ `choice`

Jedna poprawna odpowiedź.

```json
{
  "id": "k5-bezpieczenstwo-120",
  "grades": [5],
  "topic": "bezpieczenstwo",
  "difficulty": 2,
  "type": "choice",
  "title": "SMS o dopłacie",
  "story": "Uczeń dostaje SMS z linkiem i informacją, że paczka zostanie odesłana za 20 minut. Nie oczekuje żadnej przesyłki.",
  "prompt": "Co powinien zrobić najpierw?",
  "hint": "Nie korzystaj z kanału wskazanego przez podejrzaną wiadomość.",
  "explanation": "Presja czasu, mała dopłata i link mogą wskazywać na smishing. Przesyłkę należy sprawdzić w oficjalnej aplikacji lub na znanej stronie.",
  "options": [
    "Otworzyć link, bo kwota jest niewielka",
    "Sprawdzić przesyłki samodzielnie w oficjalnej aplikacji",
    "Odpisać nadawcy numerem karty",
    "Przesłać link koledze do przetestowania"
  ],
  "answer": 1,
  "sourceKeys": ["CERT-PHISHING", "CERT-TELEFON"]
}
```

Wymagane są co najmniej cztery odpowiedzi. `answer` jest indeksem, licząc od zera.

## Typ `truefalse`

Dłuższy kontekst i ocena jednego stwierdzenia.

```json
{
  "id": "k6-internet-130",
  "grades": [6],
  "topic": "internet",
  "difficulty": 2,
  "type": "truefalse",
  "title": "Kłódka nie potwierdza właściciela",
  "story": "Uczeń otwiera stronę z wiadomości. W pasku adresu widzi kłódkę, ale domena różni się jedną literą od adresu szkolnej usługi.",
  "prompt": "Prawda czy fałsz? Sam symbol kłódki wystarcza, aby uznać stronę za prawdziwą i wpisać na niej hasło.",
  "hint": "Szyfrowanie połączenia i wiarygodność właściciela to różne kwestie.",
  "explanation": "HTTPS chroni transmisję do wskazanej domeny. Nie potwierdza, że domena należy do oczekiwanej organizacji.",
  "options": ["Prawda", "Fałsz"],
  "answer": 1,
  "sourceKeys": ["CERT-PHISHING"]
}
```

Wymagania:

- `options` musi mieć dokładnie `Prawda` i `Fałsz`,
- `answer` ma wartość `0` dla Prawdy albo `1` dla Fałszu,
- kontekst powinien mieć co najmniej 100 znaków,
- stwierdzenie powinno być jednoznaczne,
- unikaj podwójnego przeczenia,
- wyjaśnienie powinno uzasadniać fakt, a nie tylko powtarzać odpowiedź.

## Typ `multi`

Kilka poprawnych odpowiedzi.

```json
{
  "id": "k7-bezpieczenstwo-210",
  "grades": [7],
  "topic": "bezpieczenstwo",
  "difficulty": 3,
  "type": "multi",
  "title": "Sygnały phishingu",
  "story": "Wiadomość prosi o pilne logowanie przez link i podanie kodu z aplikacji.",
  "prompt": "Które elementy powinny wzbudzić podejrzenie?",
  "hint": "Może być więcej niż jedna odpowiedź.",
  "explanation": "Presja, nieoczekiwany link i prośba o sekret są typowymi sygnałami próby wyłudzenia.",
  "options": [
    "Presja czasu",
    "Prośba o kod logowania",
    "Link do innej domeny",
    "Poprawna polska interpunkcja"
  ],
  "answer": [0, 1, 2],
  "sourceKeys": ["CERT-PHISHING"]
}
```

## Typ `match`

Łączenie elementów w pary.

```json
{
  "id": "k4-komputer-130",
  "grades": [4],
  "topic": "komputer",
  "difficulty": 1,
  "type": "match",
  "title": "Plik i zastosowanie",
  "story": "Uczeń porządkuje materiały w folderze projektu.",
  "prompt": "Połącz rozszerzenie z najczęstszym rodzajem zawartości.",
  "hint": "Spójrz na końcówkę nazwy pliku.",
  "explanation": "Rozszerzenie pomaga systemowi i użytkownikowi rozpoznać typ pliku.",
  "pairs": [
    [".png", "obraz"],
    [".mp3", "dźwięk"],
    [".txt", "tekst"]
  ],
  "sourceKeys": ["MS-PLIKI"]
}
```

Wymagane są co najmniej trzy pary. Lewa i prawa strona każdej pary muszą być unikalne.

## Typ `input`

Krótka odpowiedź wpisywana przez ucznia.

```json
{
  "id": "k6-sieci-130",
  "grades": [6],
  "topic": "sieci",
  "difficulty": 2,
  "type": "input",
  "title": "System nazw",
  "story": "Komputer zamienia czytelną nazwę strony na adres sieciowy.",
  "prompt": "Podaj skrót nazwy systemu wykonującego to zadanie.",
  "hint": "Skrót ma trzy litery.",
  "explanation": "DNS pomaga odnajdywać adresy powiązane z nazwami domen.",
  "answers": ["DNS", "dns"],
  "placeholder": "Wpisz skrót",
  "sourceKeys": ["ZPE-INFORMATYKA"]
}
```

## Zadania z układaniem kolejności

Aplikacja nie obsługuje zadań typu `sort` ani `order`. W wielu codziennych sytuacjach kilka kolejności może być poprawnych.

Zamiast tego pytaj o:

- najlepszy pierwszy bezpieczny krok,
- warunek konieczny przed działaniem,
- właściwy cel,
- błąd w przedstawionej procedurze,
- najlepszą reakcję na konkretną sytuację.

## Kontrola przed pull requestem

```bash
npm ci
npm test
```

Sprawdź też ręcznie:

- czy pytanie ma jedną obronioną odpowiedź,
- czy najdłuższa odpowiedź nie zdradza regularnie rozwiązania,
- czy błędne odpowiedzi są wiarygodne, ale wyraźnie gorsze,
- czy podpowiedź nie podaje gotowej odpowiedzi,
- czy wyjaśnienie uczy zasady,
- czy `sourceKeys` wskazują właściwe źródła,
- czy język pasuje do wskazanej klasy.
