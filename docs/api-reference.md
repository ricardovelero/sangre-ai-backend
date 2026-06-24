# SangreAI API — Reference

Contract reference for the React frontend. Lists every endpoint with its
request shape, success response, and error responses (status + body).

> Generated to reconcile frontend expectations with backend behavior. If you
> change a controller's response, update this file (or convert it to OpenAPI).

## Conventions

- **Base URL:** all routes are mounted under `/api`.
- **Auth header:** protected routes require `Authorization: Bearer <accessToken>`
  (the middleware also tolerates a `jwt ` prefix).
- **Content type:** JSON (`Content-Type: application/json`), except `POST /upload`
  which is `multipart/form-data`.
- **Access token** lifetime 3 days; **refresh token** 9 days.

### Common error shapes

**Validation error (Zod)** — any route with body validation. Status `400`:
```json
{
  "message": "Datos inválidos",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

**Auth failure** — protected routes with a missing/invalid/expired token. Status `401`:
```json
{ "statusCode": 401, "message": "Invalid Token" }
```
> Note: a *missing* `Authorization` header also returns `401` (not `403`) due to
> how the token string is parsed.

**Rate limited.** Status `429`:
```json
{ "message": "Demasiados intentos de inicio de sesión. Inténtelo de nuevo en 15 minutos." }
```

**Server error.** Status `5xx`. In production the message is generic; in
`development` the real `err.message` and a `stack` field are included:
```json
{ "message": "Error interno del servidor." }
```

**Route not found.** Status `404`:
```json
{ "message": "🚫 Ruta no encontrada." }
```

---

## Auth — `/api/auth`

### POST `/register`
- **Body:** `{ email, password, firstName?, lastName? }` (validated)
- **201:** `{ "message": "Usuario registrado con éxito", "token", "refreshToken", "user": { "_id", "email", "firstName", "lastName" } }`
- **400 validation:** standard validation shape. Includes weak-password rules
  (see [Password rules](#password-rules)).
- **400:** `{ "message": "El usuario ya existe" }` (duplicate email)
- **>=400:** if the welcome email fails, the upstream Postmark status/body is forwarded.
- **500:** `{ "message": "Error en el servidor" }`

### POST `/login`
- Rate limited (10 / 15 min). **Body:** `{ email, password }` (validated)
- **200:** `{ "message": "Login exitoso", "token", "refreshToken", "user": { "_id", "email", "firstName", "lastName" } }`
- **400 validation** · **401:** `{ "message": "Credenciales incorrectas" }` · **429** · **500**

### POST `/logout`
- **Body:** `{ refreshToken }` (validated)
- **200:** `{ "message": "Cierre de sesión exitoso" }`
- **400 validation** · **400:** `{ "message": "Refresh Token inválido" }` · **500**

### POST `/logout-all`
- **Auth required.** No body.
- **200:** `{ "message": "Cierre de sesión en todos los dispositivos exitoso" }`
- **401** (auth) · **500**

### POST `/refresh`
- **Body:** `{ refreshToken }` (validated)
- **200:** `{ "token": "<new access token>" }`
- **400 validation**
- **403:** `{ "message": "Refresh Token inválido" }` or `{ "message": "Refresh Token expirado o inválido" }`
- **500**

### POST `/forgot-password`
- Rate limited (5 / 15 min). **Body:** `{ email }` (validated)
- **200 (always, even if email unknown — anti-enumeration):**
  `{ "message": "Si el correo existe, se ha enviado un enlace para restablecer la contraseña" }`
- **400 validation** · **429** · **500**

### POST `/reset-password`
- **Body:** `{ token, newPassword }` (validated; `newPassword` enforces [password rules](#password-rules))
- **200:** `{ "message": "Contraseña restablecida con éxito" }`
- **400 validation** · **400:** `{ "message": "Token inválido o expirado" }` · **500**

### PUT `/user/password`
- **Auth required.** **Body:** `{ currentPassword, newPassword }` (validated; `newPassword` enforces [password rules](#password-rules))
- **200:** `{ "message": "Contraseña actualizada con éxito" }`
- **400 validation** · **401:** `{ "message": "La contraseña actual es incorrecta" }`
- **404:** `{ "message": "Usuario no encontrado" }` · **500**

### GET `/user`
- **Auth required.**
- **200:** `{ "_id", "email", "firstName", "lastName" }`
- **404:** `{ "message": "Usuario no encontrado" }` · **500**

### PUT `/user`
- **Auth required.** **Body:** `{ email?, firstName?, lastName?, phone? }` (validated)
- **200:** `{ "message": "Usuario actualizado con éxito", "user": { ...sin password ni refreshToken } }`
- **400 validation** · **404** · **500**

### DELETE `/user`
- **Auth required.**
- **200:** `{ "message": "Cuenta eliminada exitosamente" }`
- **404** · **500**

---

## Upload — `/api/upload`

### POST `/`
- **Auth required.** Rate limited (10 / hour). **`multipart/form-data`**, field `file`.
- Accepts PDF, JPEG, PNG, WebP, HEIC, HEIF (validated by magic bytes). Max 5 MB.
- **200:** `{ "message": "Archivo procesado y guardado con éxito.", "_id", "text": "<markdown>" }`
- **400:** `{ "message": "No se cargó un archivo." }` / `{ "message": "No se recibió un archivo válido." }`
- **400:** `{ "message": "Formato no soportado. Solo se aceptan PDFs e imágenes JPG, PNG, Webp, HEIC, HEIF." }`
- **400 (file too big):** `{ "message": "El archivo es demasiado grande. Máximo permitido: 5 MB." }`
- **422:** `{ "message": "El archivo subido no es una analítica de sangre." }`
- **429** · **500:** `{ "message": "❌ Error al guardar la analítica en la base de datos." }` / `{ "message": "Error procesando el archivo." }`

---

## Analíticas — `/api/analitica`

### GET `/`
- **Auth required.** **200:** array of analítica objects (newest first), or `[]`.
- **400:** `{ "message": "Usuario no encontrado" }`

### GET `/series?tipo=<tipo>`
- **Auth required.** `tipo` ∈ `serie-blanca | serie-roja | lipidos | glucosa-metabolica`.
- **200:** `{ "parameters": [...], "results": [...] }`
- **400:** `{ "message": "Debe proporcionar un tipo de serie válido" }` / `{ "message": "Tipo de serie no válido" }`
- **500** (standard server error shape)

### GET `/lipidos`
- **Auth required.** **200:** array of `{ fecha, colesterol_total, HDL, LDL, trigliceridos }`.

### GET `/:id`
- **Auth required.** **200:** analítica object (with populated `tags`).
- **400:** `{ "message": "ID de analítica no válido" }` · **404:** `{ "message": "Analitica no encontrada." }`

### PUT `/:id`
- **Auth required.** **Body:** `{ laboratorio?, medico?, nombre?, apellidos?, fecha? }` (validated)
- **200:** updated analítica object.
- **400 validation** · **400:** `{ "message": "ID de analítica no válido" }` / `{ "message": "No se proporcionaron datos" }`
- **404:** `{ "message": "Analitica no encontrada." }`

### DELETE `/:id`
- **Auth required.**
- **200:** `{ "message": "Analitica eliminada correctamente." }`
- **400:** `{ "message": "ID de analítica no válido" }` · **404**

---

## Tags — `/api/tags`

### POST `/`
- **Auth required.** **Body:** `{ name, analiticaId }` (validated; `analiticaId` must be a 24-char ObjectId)
- **201:** `{ "message": "Etiqueta agregada con éxito.", "tag" }`
  or `{ "message": "Etiqueta ya incluida en analitica", "tag" }`
- **400 validation** · **404:** `{ "message": "Analitica no encontrada" }`

### GET `/`
- **Auth required.** **200:** array of tags (alphabetical).
- **500:** `{ "message": "Error al obtener las etiquetas", "error" }`

### GET `/:tagId`
- **Auth required.** **200:** `{ "tag", "analiticas": [{ _id, fecha_toma_muestra, laboratorio }] }`
- **404:** `{ "message": "Etiqueta no encontrada" }` · **500**

### DELETE `/:tagId/:analiticaId` (remove tag from one analítica)
- **Auth required.** **200:** `{ "message": "Etiqueta eliminada de Analitica." }`
- **404:** `{ "message": "Etiqueta no encontrada" }` · **500**

### DELETE `/:tagId/` (delete tag everywhere)
- **Auth required.** **200:** `{ "message": "Etiqueta eliminada correctamente" }`
- **404** · **500**

---

## Notas — `/api/analitica/:analiticaId/notes`

### POST `/`
- **Auth required.** **Body:** `{ content }` (validated, non-empty string)
- **201:** the created note `{ "content", "owner", "_id", "createdAt" }`
- **400 validation** · **404:** `{ "message": "Analitica no encontrada" }`

### GET `/`
- **Auth required.** **200:** array of notes. **404** if analítica not found.

### GET `/:noteId`
- **Auth required.** **200:** note object.
- **404:** `{ "message": "Analitica no encontrada" }` / `{ "message": "Nota no encontrada" }`

### PUT `/:noteId`
- **Auth required.** **Body:** `{ content }` (validated)
- **200:** updated note. **404** (analítica or note).

### DELETE `/:noteId`
- **Auth required.** **200:** `{ "message": "Nota eliminada correctamente" }` · **404**

---

## Password rules

Enforced on `register`, `reset-password`, and `update-password`. A password must
be ≥ 8 chars and contain an uppercase letter, a lowercase letter, a number, and a
special character. Per-rule messages (Spanish):

| Rule | Message |
|---|---|
| Missing / not a string | `La contraseña es requerida` |
| < 8 chars | `La contraseña debe tener al menos 8 caracteres` |
| No uppercase | `La contraseña debe contener al menos una letra mayúscula` |
| No lowercase | `La contraseña debe contener al menos una letra minúscula` |
| No number | `La contraseña debe contener al menos un número` |
| No special char | `La contraseña debe contener al menos un carácter especial` |

> **⚠️ Shape change in flight (PR #6).**
> - **Current `main`:** a weak password returns a **top-level** message:
>   `{ "message": "La contraseña debe contener al menos un número" }`.
> - **After PR #6 merges:** it returns the **standard validation shape**:
>   `{ "message": "Datos inválidos", "errors": [{ "field": "password", "message": "La contraseña debe contener al menos un número" }] }`.
>
> The frontend should read `errors[]` for the rule message once #6 is merged.

---

## Known inconsistencies

None outstanding. Error responses now use `message` consistently across every
endpoint (the previous `mensaje` / `error` key variants were unified), and a
missing or invalid token returns `401` everywhere.
