# svc-mail

---

## 📦 Установка

```bash
# Клонируем репозиторий
git clone git@github.com:FreedomDevs/svc-mail.git
cd svc-mail

docker compose up -d

pnpm install

pnpm run start:dev
```

### Панель управления RabbitMQ будет доступна по адресу:

`http://localhost:15672`

**Логин / Пароль:**

```text
guest / guest
```

---

## 🛠️ Переменные окружения (`.env`)

Для конфигурации приложения создайте файл `.env` в корневой директории:

```env
# Node Environment
NODE_ENV=production

# Настройки брокера сообщений RabbitMQ
RMQ_URL=amqp://guest:guest@localhost:5672
RMQ_QUEUE=email_queue

# Конфигурация SMTP
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=elysiumsmp.team@gmail.com
MAIL_PASS=zzzz_zzzz_zzzz 
MAIL_FROM="ElysiumSMP <elysiumsmp.team@gmail.com>"
```

# 📖 Спецификация API (RabbitMQ)
Микросервис ожидает сообщения по паттерну:

```text
send_email
```

в очередь, указанную в `.env`:

```text
email_queue
```

---

## Структура payload сообщения (JSON)

| Поле       | Тип      | Обязательное | Описание                                            |
| ---------- | -------- | ------------ | --------------------------------------------------- |
| `to`       | `string` | ✅ Да         | Email-адрес получателя (валидация `@IsEmail()`)     |
| `subject`  | `string` | ✅ Да         | Тема письма                                         |
| `text`     | `string` | ❌ Нет        | Plain text версия письма (если нет шаблона)         |
| `html`     | `string` | ❌ Нет        | Сырой HTML-код письма (если нет шаблона)            |
| `template` | `string` | ❌ Нет        | Имя файла шаблона из папки `templates` (без `.hbs`) |
| `context`  | `object` | ❌ Нет        | Переменные для подстановки в шаблон                 |

---

# Доступные шаблоны

---

## 1. Подтверждение аккаунта (`confirm-account`)

### Файл шаблона

```text
src/email-consumer/templates/confirm-account.hbs
```

### Переменные `context`

| Поле   | Тип      | Описание                                |
| ------ | -------- | --------------------------------------- |
| `name` | `string` | Имя (никнейм) пользователя              |
| `code` | `string` | 6-значный код подтверждения (`XXX-XXX`) |

### Пример сообщения

```json
{
  "pattern": "send_email",
  "data": {
    "to": "player@gmail.com",
    "subject": "ElysiumID — Подтверждение регистрации",
    "template": "confirm-account",
    "context": {
      "name": "foksik",
      "code": "853-294"
    }
  }
}
```

---

## 2. Сброс пароля (`reset-password`)

### Файл шаблона

```text
src/email-consumer/templates/reset-password.hbs
```

### Переменные `context`

| Поле   | Тип      | Описание                                |
| ------ | -------- | --------------------------------------- |
| `name` | `string` | Имя (никнейм) пользователя              |
| `code` | `string` | 6-значный код сброса пароля (`XXX-XXX`) |

### Пример сообщения

```json
{
  "pattern": "send_email",
  "data": {
    "to": "player@gmail.com",
    "subject": "ElysiumID — Восстановление доступа",
    "template": "reset-password",
    "context": {
      "name": "foksik",
      "code": "109-743"
    }
  }
}
```

---

### Ошибки SMTP
даже думать об этом не хочу