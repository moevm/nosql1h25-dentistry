### Отладочные пользователи
Пациент
```
client@mail.ru
JqP-4RB-8Xi-Ffd
```
Врач:
```
van11kov@mail.com
c2S-ZLn-hTx-8cy
```
### Как запустить проект:
```
docker compose build –no-cache && docker compose up
```


### Как запустить бэкенд отдельно:

Клонировать репозиторий и перейти в него в командной строке:

```
git clone https://github.com/moevm/nosql1h25-dentistry.git
```

```
cd dentistry/core
```

Cоздать и активировать виртуальное окружение:

```
python3 -m venv env
```

* Если у вас Linux/macOS

    ```
    source env/bin/activate
    ```

* Если у вас windows

    ```
    source env/scripts/activate
    ```

```
python3 -m pip install --upgrade pip
```

Установить зависимости из файла requirements.txt:

```
pip install -r requirements.txt
```


Выполнить миграции:

```
python3 manage.py migrate
```

Запустить проект:

```
python3 manage.py runserver
```
