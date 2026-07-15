# Public demo architecture

The DKO showcase is a static browser application designed for GitHub Pages.

## Runtime

- `index.html` provides the presentation shell and Android device frame.
- `styles.css` recreates the current light and dark DKO visual language.
- `app.js` owns the synthetic inspection state, navigation, role views, photo
  markup canvases, signature canvas, and HTML document previews.
- `assets/photos/` contains only purpose-created synthetic inspection photos.

There is no backend, database, authentication service, analytics endpoint, or
remote API. Reloading or using **Obnovit demo** returns the showcase to its
initial synthetic state.

## Production boundary

The native product remains a separate private Android application built with
Kotlin, Jetpack Compose, Room/SQLite, and CameraX. Its security, persistence,
PDF generation, encrypted backup, and audit guarantees are not delegated to
this browser showcase.

The public demo reproduces user-visible behavior for presentation only. It is
not a substitute for the APK and must not be used for real inspections.
