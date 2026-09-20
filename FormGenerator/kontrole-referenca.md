# Referenca kontrola metamodela

Svaka kontrola ima osnovna svojstva iz `Control`: **id** (ceo broj), **name** (string), **type** (string).

**Data** kontrole (TextBox, DateTimePicker, RadioButton, CheckBox, ComboBox, FilePicker, Slider) dodatno dele: `label`, `dataType` (obavezno), `isRequired`, `isReadOnly`, `defaultValue`, `restrictedValue` (validacija) i `computedValue` (računata vrednost).

**Content** kontrole (Label, ProgressBar) imaju obavezan `value`.

U tabeli je napomena data **jednom po komponenti** (čemu služi), a ne po svakom svojstvu.

| Naziv komponente | Svojstva | Vrednosti svojstva | Napomena (čemu služi) |
|---|---|---|---|
| **Panel** | title | string | Kontejner — grupiše i raspoređuje druge kontrole prema zadatom layout-u. |
| | layout | Flow / Grid / Anchor / Explicit | |
| | controls | niz kontrola (min. 1) | |
| **Collection** | template | kontrola (obično Panel) — obavezno | Ponavljajući skup redova po šablonu; dodavanje/brisanje; prikaz kao tabela (Grid) ili lista. |
| **TextBox** | editorStyle | SingleLine / MultiLine | Unos teksta ili broja; opcioni regex i numeričke granice. |
| | pattern | string (regex) | |
| | min / max | broj | |
| | _+ data svojstva_ | — | |
| **DateTimePicker** | mode | Date / Time / DateTime | Izbor i prikaz datuma/vremena po zadatom formatu. |
| | format | string (npr. `dd.MM.yyyy`, `yyyy`, `HH:mm`) | |
| | min / max | datum-string ili broj | |
| | _+ data svojstva_ | — | |
| **RadioButton** | groupName | string | Izbor tačno jedne opcije unutar grupe. |
| | optionValue | string | |
| | _+ data svojstva_ | dataType obično „Logical" | |
| **CheckBox** | groupName | string | Uključivanje/isključivanje; dozvoljen višestruki izbor u grupi. |
| | optionValue | string | |
| | _+ data svojstva_ | dataType obično „Logical" | |
| **ComboBox** | items | niz ComboBoxItem | Padajući izbor iz liste ponuđenih stavki. |
| | selectionMode | Single / Multiple | |
| | isEditable | true / false | |
| | placeholder | string | |
| | _+ data svojstva_ | — | |
| ComboBoxItem | id / value / label | ceo broj / string / string | Jedna stavka ComboBox liste (vrednost + prikazni tekst). |
| **FilePicker** | fileFormat | accept string (npr. `image/*`) | Otpremanje fajla (npr. slike, potpisa). |
| | _+ data svojstva_ | dataType obično „Graphic" | |
| **Slider** | min / step / max | broj (podraz. 0 / 1 / 100) | Izbor numeričke vrednosti u opsegu prevlačenjem. |
| | _+ data svojstva_ | dataType obično „Real" | |
| **Label** | value | bilo koja vrednost — obavezno | Prikaz statičnog teksta; nije za unos. |
| **ProgressBar** | value | broj — obavezno | Vizuelni prikaz vrednosti u opsegu (napredak). |
| | min / max | broj (podraz. 0 / 100) | |
