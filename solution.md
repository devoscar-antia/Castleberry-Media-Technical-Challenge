# Solution

**Candidato:** Oscar Antia  
**Repo base:** [CastleberryMedia/candidate-challenge](https://github.com/CastleberryMedia/candidate-challenge)

---

## Qué identifiqué

Revisé el flujo del README (login, onboarding, dashboard, artículos, posts y profile) y encontré cuatro fallos en el front, todos en tres archivos. El resto del flujo ya funcionaba: preferencias, generación con la Edge Function `generate-posts`, programación y la pantalla de perfil.

**1. Títulos de artículos (`TopicSelection.tsx`)**  
La función `brokenExtractTitle` no usaba el artículo; devolvía `"Article 1"`, `"Article 2"`, etc. Con eso era difícil saber qué artículo guardar.

**2. Edición de posts (`GeneratedPosts.tsx`)**  
`saveEdit` era `async`, cerraba el modal y mostraba “Changes saved”, pero nunca hacía `update` en Supabase. Al recargar, el texto volvía al original.

**3. Puntos en el dashboard (`Dashboard.tsx`)**  
Al canjear, la UI restaba puntos del usuario logueado, pero el `update` en base de datos iba a `leaderboard[0]?.id` (el primero del ranking). En pantalla parecía bien; tras F5 el saldo no cuadraba.

**4. Imagen en el preview (`GeneratedPosts.tsx`)**  
Se leía `image_url` con un `as any`, pero en la query y en la DB el campo es `imageurl`. Por eso el preview programado siempre mostraba “Scheduled image unavailable”.

Para poder levantar el proyecto en local también tuve que ajustar Supabase: el seed dejaba tokens de auth en `NULL` (login devolvía 500) y muchas migraciones del producto completo impedían `supabase start`. Dejé solo las migraciones del challenge más una base mínima de tablas y corregí `seed.sql`.

---

## Qué cambios realicé

**Frontend (bugs del challenge)**

- `TopicSelection.tsx`: la lista usa `article.title` en lugar del índice.
- `GeneratedPosts.tsx`: `saveEdit` persiste en `posts` y actualiza el estado local; el preview usa `post.articles?.imageurl`.
- `Dashboard.tsx`: el canje actualiza `profile.id` y valida que el monto sea positivo y no supere el saldo.

**Supabase (para que corra en local)**

- `supabase/seed.sql`: `confirmation_token`, `recovery_token` y campos similares en `''` en vez de `NULL`.
- `supabase/migrations/20250803009999_challenge_base_schema.sql`: tablas base (`profiles`, `articles`, `posts`, etc.).
- Migraciones del producto completo movidas a `supabase/migrations_archive/` para que `supabase db reset` termine sin errores.

---

## Por qué tomé esas decisiones

Quise tocar lo mínimo: cada bug tenía una causa clara y no hacía falta refactorizar hooks ni otras pantallas.

En `saveEdit` añadí el `update` que faltaba y actualicé `posts` en memoria para no recargar toda la página; si Supabase falla, el modal sigue abierto y el toast muestra el error.

En el dashboard el problema era el `id` equivocado, no la lógica del toast. Las validaciones de monto las puse para evitar saldos negativos después de arreglar el `id`.

Quité el `as any` en la imagen para alinear código y tipos; así un typo en el nombre del campo vuelve a saltar en compilación.

En Supabase no reinventé el esquema: solo lo necesario para que el evaluador pueda hacer `supabase start` + `db reset` y probar con los usuarios demo del README.

---

## Cómo probé la app

Entorno: Windows, Docker Desktop, Supabase CLI (`npx supabase`), Node 22.

```powershell
npm install
Copy-Item .env.example .env.local
npx supabase start
# Pegar en .env.local la Publishable key que imprime el CLI
npx supabase db reset
npx supabase functions serve
npm run dev
```

App en `http://localhost:8080`. Usuario: `demo.a@example.test` / `Challenge123!`

Recorrí los 12 pasos del README: login, onboarding y refresh de preferencias, canje de puntos (comprobando con F5), búsqueda y guardado de artículos con títulos reales, generación de post, edición con persistencia tras recargar, programación, preview con imagen, enlace al artículo y profile. También corrí `npm run build` sin errores.

---

## Qué mejoraría con más tiempo

- Actualizar el estado local en `schedulePost` en lugar de llamar `loadData()` cada vez.
- Generar tipos con `supabase gen types` y quitar los `as any[]` en las cargas de posts y artículos.
- Avisar si cierras el modal de edición con cambios sin guardar.
- Mensajes de error más claros cuando falla la carga de datos (hoy a veces parece que no hay artículos guardados).
