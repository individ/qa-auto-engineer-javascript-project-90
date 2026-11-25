# Тестирование Канбан-доски (JS)

[![hexlet-check](https://github.com/individ/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/individ/qa-auto-engineer-javascript-project-90/actions)



Учебный проект Хекслета: https://ru.hexlet.io/programs/qa-auto-engineer-javascript


## Стек

- JavaScript

## Установка

Требуется Node.js 22.12+ или 24+ и npm.

```bash
git clone https://github.com/individ/qa-auto-engineer-javascript-project-90.git
cd qa-auto-engineer-javascript-project-90
npm ci
npx playwright install chromium
```

## Использование

Запуск приложения: `npm run dev` (http://localhost:5173).

Проверка стиля: `npm run lint`. Сборка: `npm run build`.

Запуск тестов: `npm test`. Playwright автоматически запускает приложение.
Тесты проверяют форму входа, вход в приложение и выход. После выхода главная страница снова должна просить войти. Также проверяются список пользователей, создание, редактирование и удаление, ошибки в email и пустые обязательные поля. Для статусов и меток проверяются список, создание, редактирование и удаление. Для задач — создание, изменение, удаление, колонки доски, фильтры по исполнителю, статусу и метке, перенос карточки между колонками.

При установленном GNU Make доступны `make install`, `make start`, `make test` и `make lint`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.


React и ReactDOM используют версию 18, совместимую с учебным приложением.
