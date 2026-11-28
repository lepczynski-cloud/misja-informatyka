# Współpraca przy projekcie

Dziękuję za chęć rozwijania Misji: Informatyka. Projekt jest nadal w fazie budowy, dlatego szczególnie cenne są uwagi nauczycieli, uczniów i rodziców.

## Możliwe zgłoszenia

- błąd działania aplikacji,
- niejasne pytanie,
- niejednoznaczna odpowiedź,
- błąd językowy,
- nieaktualna informacja,
- propozycja nowego zadania,
- sugestia dotycząca dostępności lub wygody użycia.

## Zmiana kodu lub treści

1. Utwórz fork repozytorium.
2. Utwórz osobną gałąź.
3. Wprowadź zmianę.
4. Uruchom testy.
5. Wyślij pull request z krótkim opisem.

```bash
npm ci
npm test
```

## Nowe zadania

Przed dodaniem zadania przeczytaj:

- [Dodawanie zadań](docs/ADDING-TASKS.md)
- [Zasady przygotowywania treści](docs/CONTENT-GUIDE.md)
- [Źródła merytoryczne](docs/SOURCES.md)

Każde zadanie musi mieć:

- unikalny identyfikator,
- wskazaną klasę, temat i trudność,
- jasną sytuację i polecenie,
- podpowiedź,
- wyjaśnienie,
- co najmniej jeden poprawny `sourceKey`.

Nie dodawaj zadań typu `sort` albo `order`. Procesy opisuj jako wybór najlepszego działania, warunku, błędu lub reakcji.

## Jakość odpowiedzi

Nie twórz regularnego wzorca, w którym:

- poprawna odpowiedź jest zawsze najdłuższa,
- poprawna odpowiedź jest zawsze na tej samej pozycji,
- błędne odpowiedzi są żartem lub oczywistym absurdem,
- tylko poprawna odpowiedź ma szczegółowe uzasadnienie,
- odpowiedź można rozpoznać po innym stylu języka.

Walidator automatycznie kontroluje część tych cech, ale nie zastępuje przeglądu człowieka.

## Bezpieczeństwo treści

Przykładowe fałszywe wiadomości powinny korzystać z nieaktywnych domen `.example`. Nie umieszczaj prawdziwych danych dzieci, haseł, tokenów ani aktywnych stron phishingowych.

Problemy bezpieczeństwa samej aplikacji zgłaszaj zgodnie z [SECURITY.md](SECURITY.md).
