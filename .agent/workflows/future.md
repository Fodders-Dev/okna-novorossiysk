---
description: Продолжаем разработку лендинга «Окна и двери в Новороссийске».
---

# Workflow: Разработка лендинга

## Контекст
Проект: одностраничный лендинг частного мастера по окнам/дверям.
Стек: Vite + Vanilla HTML/CSS/JS.

## Основные файлы
- `SPEC.md` — спецификация проекта
- `PLAN.md` — план по фазам
- `index.html` — главная страница
- `src/main.js` — вся JS-логика
- `src/styles/` — CSS-модули

## Запуск проекта
```bash
// turbo
npm install
// turbo
npm run dev
```

## Текущий статус
Фазы 1-4 завершены. Осталось:
- Интеграция Яндекс.Карты
- SEO-оптимизация (meta, Schema.org)
- Замена заглушек на реальные данные

## Команды
- `npm run dev` — dev-сервер (http://localhost:3000)
- `npm run build` — production-сборка в /dist
- `npm run preview` — просмотр production-сборки
