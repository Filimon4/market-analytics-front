# Split InfoField for Table and Entity

## Goal

Снизить хрупкость текущего dual-mode компонента, где в одном месте смешаны table-render (`value`/`type`) и entity-логика (`field` + store + edit/reset).

Ключевые места:

- Таблица рендерит значение так: `[InfoDataTable.vue](/home/projects/market-analytics-front/src/components/Layout/InfoDataTable/InfoDataTable.vue)`
- Entity использует `InfoField` как интерактивный view-mode: `[InfoEditableField.vue](/home/projects/market-analytics-front/src/components/common/InfoDataEntity/InfoEditableField/InfoEditableField.vue)`
- Текущий dual-mode API в `[InfoField.vue](/home/projects/market-analytics-front/src/components/common/InfoDataEntity/InfoField/InfoField.vue)`:

```42:60:/home/projects/market-analytics-front/src/components/common/InfoDataEntity/InfoField/InfoField.vue
const props = withDefaults(
  defineProps<{
    field?: IField
    value?: unknown
    type?: IField['type']
  }>(),
  { field: undefined, value: undefined, type: 'string' }
)

const value = props.field ? infoDataEntityStore.getValueOfField(props.field) : props.value
```

## Implementation Plan

1. Перенести именно файл этого плана ко мне в проект. Только сам файл плана.
2. Создать общий helper/composable для форматирования значений (`formatFieldValue`)
3. Создать `InfoTableField.vue` для отображения данных в таблицах
4. Переключить `InfoDataTable.vue` на использование `InfoTableField`
5. Упростить `InfoField.vue` до entity-only API
6. Оставить `InfoEditableField.vue` без изменения контракта
7. Провести smoke-check таблиц и страниц сущностей

## Safe Migration Notes

- Сначала общий formatter, потом переключение таблицы, потом cleanup entity-компонента — это минимизирует риск регрессии.
- Тип `date` присутствует в моделях, но в текущем formatter нет отдельной обработки; в рамках split сохранить текущее поведение 1:1, а формат `date` улучшать отдельной задачей.
- Поскольку прямых usage только два, область изменений локальна и легко проверяема.

## Acceptance Criteria

- Таблица больше не зависит от entity store через `InfoField`.
- Entity режим сохраняет edit/reset и disabled-логику без изменения UX.
- Форматирование значений одинаково в таблице и entity для одинаковых входных данных.
