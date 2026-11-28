# Zasady przygotowywania treści

## Cel

Zadania mają bawić, skłaniać do myślenia i pomagać utrwalać wybrane zagadnienia z informatyki. Aplikacja nie zastępuje nauczyciela, podręcznika ani praktycznych narzędzi.

## Dobry schemat zadania

1. Krótka, konkretna sytuacja.
2. Jedno jasne pytanie.
3. Odpowiedzi, które wymagają zrozumienia, a nie zgadywania po formie.
4. Podpowiedź pokazująca kierunek myślenia.
5. Wyjaśnienie zasady i konsekwencji.
6. Co najmniej jedno źródło merytoryczne.

## Język

- Pisz po polsku.
- Używaj krótkich zdań dla klas 3 i 4.
- Dla klas 5 i 6 można dodać więcej kontekstu oraz decyzję do podjęcia.
- Dla klas 7 i 8 można wymagać porównania źródeł, skutków i ograniczeń.
- Wyjaśniaj termin przed użyciem albo pozwól wywnioskować go z sytuacji.
- Unikaj języka zawstydzającego ucznia.
- Nie używaj realnych danych dzieci, aktywnych linków phishingowych ani prawdziwych haseł.

## Odpowiedzi jednokrotnego wyboru

### Nie zdradzaj rozwiązania długością

Nie stosuj schematu, w którym poprawna odpowiedź jest prawie zawsze najdłuższa, najbardziej szczegółowa albo jedyna napisana pełnym zdaniem.

Dobre odpowiedzi powinny mieć podobny poziom szczegółowości. Długość nie musi być identyczna, ale nie może być regularną podpowiedzią.

Walidator mierzy:

- jak często poprawna odpowiedź jest jednoznacznie najdłuższa,
- średnią długość odpowiedzi poprawnych i błędnych,
- rozkład poprawnych odpowiedzi między pozycjami.

### Twórz wiarygodne dystraktory

Błędna odpowiedź powinna odzwierciedlać rzeczywiste nieporozumienie. Nie powinna być żartem, przypadkowym zdaniem ani oczywistym nonsensem.

Słabo:

```text
A. Sprawdź adres strony.
B. Zjedz kanapkę.
C. Zamknij oczy.
D. Wpisz hasło.
```

Lepiej:

```text
A. Sprawdź pełną domenę i otwórz usługę z zapisanej zakładki.
B. Zaufaj stronie, ponieważ ma kłódkę HTTPS.
C. Zaufaj nazwie nadawcy widocznej nad adresem e-mail.
D. Wpisz hasło, a dopiero później sprawdź, czy strona była prawdziwa.
```

## Prawda lub Fałsz

Zadanie powinno zawierać sytuację, a nie tylko wyrwane z kontekstu zdanie definicyjne.

Dobre stwierdzenie:

- dotyczy jednego faktu lub wniosku,
- jest jednoznaczne,
- nie używa podwójnego przeczenia,
- nie opiera się na słowach typu „zawsze” wyłącznie po to, aby łatwo wskazać Fałsz,
- ma wyjaśnienie pokazujące przyczynę.

W całym katalogu należy utrzymywać równowagę odpowiedzi Prawda i Fałsz.

## Cyberbezpieczeństwo

Scenariusz powinien pokazywać realną decyzję, na przykład:

- podejrzany SMS o dopłacie,
- e-mail z fałszywym logowaniem,
- wiadomość od przejętego konta znajomego,
- prośbę o kod logowania lub kod BLIK,
- fałszywy kontakt z pomocą techniczną,
- aplikację żądającą nadmiernych uprawnień,
- publiczne Wi-Fi,
- wyciek danych,
- przejęcie konta,
- publikację zdjęcia z danymi,
- nękanie, szantaż lub podszywanie się.

### Przykładowe wiadomości

Wiadomość może być dłuższa, ale musi pozostać bezpiecznym materiałem edukacyjnym.

- Stosuj nieaktywne domeny z końcówką `.example`.
- Nie podawaj działających danych logowania.
- Nie twórz instrukcji omijania zabezpieczeń.
- Pytaj o sygnały ostrzegawcze, sposób weryfikacji i bezpieczną reakcję.
- Dla młodszych klas uwzględniaj rozmowę z zaufaną osobą dorosłą.
- Nie sugeruj samodzielnej konfrontacji z oszustem.

Najlepsza odpowiedź zwykle powinna ograniczać ryzyko, zatrzymywać presję, chronić sekrety i korzystać z niezależnego oficjalnego kanału.

## AI z głową

Nie wymagaj znajomości specjalistycznej terminologii. Zadania powinny ćwiczyć praktyczne zachowania:

- opisanie celu,
- wskazanie odbiorcy,
- określenie długości i formatu,
- prośbę o przykład,
- prośbę o prostsze wyjaśnienie,
- zadawanie kolejnego pytania,
- wykorzystanie narzędzia jako trenera, nie autora pracy,
- sprawdzanie obliczeń, dat i źródeł,
- rozpoznawanie nieistniejących cytowań,
- usuwanie danych osobowych,
- porównywanie z wiarygodnymi materiałami.

Zamiast pytać „Czym jest prompt engineering?”, pokaż dwa polecenia i zapytaj, które lepiej opisuje cel ucznia.

## Zadania o wyszukiwaniu

Dobre zadania mogą obejmować:

- precyzyjne słowa kluczowe,
- cudzysłów dla dokładnego wyrażenia,
- operator `site:`,
- wykluczanie niepasującego znaczenia,
- sprawdzanie autora, daty i adresu,
- przejście od wyniku wyszukiwarki do źródła,
- porównanie informacji w kilku materiałach,
- odróżnienie źródła pierwotnego od komentarza.

## Wyjaśnienie odpowiedzi

Dobre wyjaśnienie nie powtarza tylko poprawnej opcji. Powinno w jednym lub dwóch zdaniach wskazać zasadę, zależność albo konsekwencję.

Słabo:

```text
Poprawna odpowiedź to HTTPS.
```

Lepiej:

```text
HTTPS szyfruje połączenie z konkretną domeną, ale nie potwierdza uczciwości właściciela. Dlatego nadal trzeba sprawdzić pełny adres strony.
```

## Źródła

Przed dodaniem zadania sprawdź aktualność informacji w wiarygodnym źródle. W przypadku zakresu szkolnego zacznij od aktualnej podstawy programowej i materiałów edukacyjnych instytucji publicznych. W przypadku technologii korzystaj z oficjalnej dokumentacji.

Dodaj klucz do `sourceKeys`. Gdy potrzebnego źródła nie ma jeszcze w katalogu, najpierw uzupełnij `public/data/sources.json` i `docs/SOURCES.md`.

Treści dotyczące usług, prawa, bezpieczeństwa i szybko zmieniających się narzędzi powinny być okresowo przeglądane.
