# Frontend

Используйте `npm run dev`, чтобы запустить сервер разработки.

Используйте переменную `VITE_API_MOCK` для имитации API. Установите её в `true`, чтобы использовать мок-API, или в `false`, чтобы использовать реальное API.
Команда для запуска сервера разработки с мок-API:

```bash
VITE_API_MOCK=true npm run dev
```

На Windows (под cmd или powershell) используйте `cross-env` для установки переменной окружения:

```powershell
npx cross-env VITE_API_MOCK=true npm run dev
```

## Роли

Некоторые страницы рендерятся в зависимости от роли пользователя.
В данный момент поддерживаются следующие роли:

- `admin` - администратор
- `specialist` - специалист/дантист
- `patient` - пациент

Чтобы изменить роль пользователя, откройте консоль разработчика в браузере и выполните следующую команду:

```javascript
localStorage.setItem(
  "user",
  JSON.stringify({
    role: "admin", // или 'specialist', 'patient'
  })
); // или 'specialist', 'patient'
```
