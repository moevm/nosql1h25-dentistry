# -*- coding: utf-8 -*-
from pymongo import MongoClient
from bson.json_util import dumps # Конвертация из формата bson в json

# Подключение к MongoDB
client = MongoClient('localhost', 27017)
db = client['dental_clinic']
collection = db['patient_cards']

# Очистка коллекции перед вставкой новых данных
collection.delete_many({})

# Пример данных для стоматологических карточек
patients = [
    {
        "name": "Иван Иванов",
        "age": 30,
        "diagnosis": "Кариес",
        "treatment": "Пломбирование",
        "visit_date": datetime.now(),
        "doctor": "Петрова А.И.",
        "cost": 4500,
        "insurance": True,
        "next_visit": datetime(2024, 3, 15),
        "history": [
            {"date": datetime(2023, 12, 1), "procedure": "Осмотр"},
            {"date": datetime(2024, 1, 15), "procedure": "Пломбирование"}
        ]
    },
    {
        "name": "Анна Смирнова",
        "age": 25,
        "diagnosis": ["Периодонтит", "Гингивит"],
        "treatment": "Удаление нерва",
        "visit_date": datetime.now(),
        "doctor": "Сидоров П.П.",
        "cost": 8000,
        "insurance": False,
        "next_visit": datetime(2024, 3, 20),
        "history": [
            {"date": datetime(2023, 11, 15), "procedure": "Рентген"},
            {"date": datetime(2024, 1, 10), "procedure": "Удаление нерва"}
        ]
    },
    {
        "name": "Сергей Петров",
        "age": 40,
        "diagnosis": "Зубной камень",
        "treatment": "Чистка ультразвуком",
        "visit_date": datetime.now(),
        "doctor": "Петрова А.И.",
        "cost": 3500,
        "insurance": True,
        "next_visit": datetime(2024, 4, 1),
        "history": [
            {"date": datetime(2023, 12, 20), "procedure": "Чистка"}
        ]
    }
]

# Запись данных в коллекцию
collection.insert_many(patients)

# Чтение данных из БД (например, всех пациентов с диагнозом "Кариес")
results = collection.find({"diagnosis": "Кариес"})
print(dumps(results, ensure_ascii=False, indent=4))
