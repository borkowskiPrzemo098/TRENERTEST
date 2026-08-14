# ŻELAZO — szablon strony trenera personalnego

Statyczny szablon strony (HTML/CSS/JS, bez buildu) dla trenera personalnego. Kierunek wizualny: **TESTOSTERON** — surowa stal, nity, żółto-czarne pasy ostrzegawcze, ember-red akcent, industrialny/foundry klimat siłowni zamiast typowego pastelowego "wellness".

## Uruchomienie

Otwórz `index.html` w przeglądarce — brak buildu, brak zależności.

## Struktura

- `index.html` — treść i struktura strony (hero, o trenerze, oferta, efekty, opinie, cennik, kontakt)
- `style.css` — pełny system wizualny (kolory, typografia, komponenty, responsywność)
- `script.js` — mobilne menu, animacje wejścia sekcji, demo formularza kontaktowego

## Do personalizacji przed publikacją

- Wszystkie dane oznaczone jako `[w nawiasach kwadratowych]` lub żółtym kolorem (`.ph`) to placeholdery — podmień na realne dane trenera.
- Wszystkie zdjęcia to wygenerowane grafiki SVG (sylwetki, transformacje) — podmień na prawdziwe zdjęcia.
- Wszystkie opinie klientów i wyniki transformacji to przykładowa treść — zastąp prawdziwymi danymi za zgodą klientów.
- Formularz kontaktowy (`#contactForm` w `script.js`) nie wysyła danych — podłącz własną obsługę (e-mail, CRM, formspree itp.).
- Ceny w sekcji `#cennik` są przykładowe.

## Design system

Paleta: grafitowe/betonowe tło, stalowe panele z nitami, żółty hazard-stripe jako jedyny akcent ostrzegawczy, czerwień "ember" jako akcent CTA/gorąca.
Typografia: Anton (nagłówki), Barlow Condensed (etykiety), Barlow (tekst).
