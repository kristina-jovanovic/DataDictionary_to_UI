# Mobilna verzija (Capacitor)

Demo se pakuje u native Android/iOS aplikaciju kroz [Capacitor](https://capacitorjs.com).
Isti Angular kod se koristi i za web i za mobilni.

> Napomena o komandi: Angular CLI ne prihvata proizvoljan `--mobile` flag na `ng serve`.
> Idiomatski ekvivalent je **konfiguracija**: `ng serve demo -c mobile`
> (postoji i skraćenica `npm run serve:mobile`).

## Preduslovi

- Node 18+ i `npm install` (dodaje Capacitor pakete — mora se pokrenuti lokalno,
  ne radi u ovom sandbox okruženju gde je registry zaključan).
- Za Android: Android Studio + Android SDK.
- Za iOS: macOS + Xcode.

## Prvo podešavanje (jednom)

```bash
npm install                 # instalira @capacitor/* pakete
npx cap add android         # kreira android/ projekat
npx cap add ios             # kreira ios/ projekat (samo na macOS)
```

`capacitor.config.ts` je već podešen (`webDir: dist/demo/browser`).

## Dev — mobilna konfiguracija u browseru

```bash
npm run serve:mobile        # == ng serve demo -c mobile
```

Sluša na `0.0.0.0:4200` (dostupno i uređaju/emulatoru na istoj mreži).
Build je bez optimizacije, sa source-map-ovima (lakši debug).

## Live-reload na uređaju/emulatoru

1. U `capacitor.config.ts` otkomentariši `server` i upiši IP dev mašine:
   ```ts
   server: { url: 'http://192.168.1.100:4200', cleartext: true }
   ```
2. `npm run serve:mobile`
3. `npx cap run android` — native app učitava živi dev server, promene se odmah vide.

## Pakovanje (statički build u native)

```bash
npm run cap:sync            # build:mobile + cap sync (kopira dist u native projekte)
npx cap run android         # ili: npx cap open android  (pa Run iz Android Studia)
```

Za iOS zameni `android` sa `ios`. Pre pakovanja vrati `server` u komentar
u `capacitor.config.ts` (da app koristi upakovane fajlove, ne dev server).

## npm skripte

| skripta | radi |
|---|---|
| `npm run serve:mobile` | `ng serve demo -c mobile` (0.0.0.0:4200) |
| `npm run build:mobile` | `ng build demo -c mobile` → `dist/demo/browser` |
| `npm run cap:sync` | build + `cap sync` |
| `npm run cap:android` | sync + `cap run android` |
| `npm run cap:ios` | sync + `cap run ios` |
