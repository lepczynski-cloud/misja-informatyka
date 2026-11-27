# Współpraca przy projekcie

Dziękuję za zainteresowanie rozwojem Misji: Informatyka. Najbardziej potrzebne są poprawki merytoryczne, nowe zróżnicowane zadania, testy z uczniami i nauczycielami oraz usprawnienia dostępności.

## Zanim rozpoczniesz

- sprawdź istniejące Issues,
- dla większej zmiany opisz wcześniej pomysł,
- nie dodawaj danych uczniów ani prawdziwych danych logowania,
- zachowaj polski język interfejsu i treści,
- pamiętaj, że projekt ma uzupełniać szkolne narzędzia, a nie je zastępować.

## Lokalna konfiguracja

```bash
git clone https://github.com/lepczynski-cloud/misja-informatyka.git
cd misja-informatyka
npm ci
npm run dev
```

## Przed wysłaniem pull requestu

```bash
npm test
```

Następnie sprawdź ręcznie:

- widok ucznia,
- widok nauczyciela,
- jasny i ciemny motyw,
- układ na wąskim ekranie,
- przynajmniej jedno zadanie, którego dotyczy zmiana.

## Nowe zadania

Przeczytaj:

- [Dodawanie zadań](docs/ADDING-TASKS.md)
- [Zasady tworzenia treści](docs/CONTENT-GUIDE.md)

Pull request z zadaniami powinien zawierać:

- krótkie wyjaśnienie zakresu,
- wskazanie klas i tematów,
- informację o sprawdzeniu merytorycznym,
- wynik `npm run validate`.

## Styl kodu

- używaj zwykłego JavaScriptu bez dodawania frameworka bez wyraźnej potrzeby,
- nie dodawaj zależności tylko dla jednej prostej funkcji,
- zachowaj działanie aplikacji bez zewnętrznych usług,
- używaj semantycznego HTML,
- dbaj o obsługę klawiatury i czytników ekranu,
- tekst widoczny dla użytkownika zapisuj po polsku,
- nie wstawiaj sekretów, kluczy API ani danych osobowych.

## Zgłaszanie błędów

Użyj szablonu błędu w GitHub Issues. Podaj:

- urządzenie i przeglądarkę,
- kroki prowadzące do problemu,
- oczekiwane zachowanie,
- rzeczywiste zachowanie,
- zrzut ekranu, jeśli nie zawiera danych prywatnych.

Problemy bezpieczeństwa zgłaszaj zgodnie z plikiem [SECURITY.md](SECURITY.md).
