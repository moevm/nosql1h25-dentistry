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
    {"name": "Иван Иванов", "age": 30, "diagnosis": "Кариес", "treatment": "Пломбирование"},
    {"name": "Анна Смирнова", "age": 25, "diagnosis": ["Периодонтит", "Гингивит"], "treatment": "Удаление нерва"},
    {"name": "Сергей Петров", "age": 40, "diagnosis": "Зубной камень", "treatment": "Чистка ультразвуком"}
]

# Запись данных в коллекцию
collection.insert_many(patients)

# Чтение данных из БД (например, всех пациентов с диагнозом "Кариес")
results = collection.find({"diagnosis": "Кариес"})
print(dumps(results, ensure_ascii=False, indent=4))