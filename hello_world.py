# -*- coding: utf-8 -*-
from datetime import datetime

from bson.json_util import dumps  # Конвертация из формата bson в json
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['dental_clinic']
collection = db['patient_cards']

collection.delete_many({})

# Пример стоматологических карточек
patients = [{"name": "Иван Иванов", "age": 30, "diagnosis": "Кариес", "treatment": "Пломбирование",
    "visit_date": datetime.now(), "doctor": "Петрова А.И.", "cost": 4500, "insurance": True,
    "next_visit": datetime(2024, 3, 15), "history": [{"date": datetime(2023, 12, 1), "procedure": "Осмотр"},
        {"date": datetime(2024, 1, 15), "procedure": "Пломбирование"}]},
    {"name": "Анна Смирнова", "age": 25, "diagnosis": ["Периодонтит", "Гингивит"], "treatment": "Удаление нерва",
        "visit_date": datetime.now(), "doctor": "Сидоров П.П.", "cost": 8000, "insurance": False,
        "next_visit": datetime(2024, 3, 20), "history": [{"date": datetime(2023, 11, 15), "procedure": "Рентген"},
        {"date": datetime(2024, 1, 10), "procedure": "Удаление нерва"}]},
    {"name": "Сергей Петров", "age": 40, "diagnosis": "Зубной камень", "treatment": "Чистка ультразвуком",
        "visit_date": datetime.now(), "doctor": "Петрова А.И.", "cost": 3500, "insurance": True,
        "next_visit": datetime(2024, 4, 1), "history": [{"date": datetime(2023, 12, 20), "procedure": "Чистка"}]}]

collection.insert_many(patients)


def print_results(title, cursor):
    print(f"\n{title}:")
    print(dumps(cursor, ensure_ascii=False, indent=4))


def perform_queries():
    # Поиск пациентов по конкретному диагнозу
    print_results("Пациенты с кариесом", collection.find({"diagnosis": "Кариес"}))

    # Поиск пациентов определенного врача
    print_results("Пациенты доктора Петровой А.И.", collection.find({"doctor": "Петрова А.И."}))

    # Подсчет среднего чека
    average_cost = collection.aggregate([{"$group": {"_id": None, "avg_cost": {"$avg": "$cost"}}}])
    print_results("Средняя стоимость лечения", average_cost)

    # Поиск пациентов со страховкой
    print_results("Пациенты со страховкой", collection.find({"insurance": True}))

    # Статистика по врачам
    doctor_stats = collection.aggregate(
        [{"$group": {"_id": "$doctor", "patient_count": {"$sum": 1}, "total_revenue": {"$sum": "$cost"}}}])
    print_results("Статистика по врачам", doctor_stats)

    # Ближайшие записи на прием
    next_visits = collection.find().sort("next_visit", 1)
    print_results("Ближайшие записи на прием", next_visits)


def add_patient(patient_data):
    result = collection.insert_one(patient_data)
    print(f"\nДобавлен новый пациент с ID: {result.inserted_id}")


def update_patient(name, new_data):
    result = collection.update_one({"name": name}, {"$set": new_data})
    print(f"\nОбновлено записей: {result.modified_count}")


def add_to_history(name, procedure_data):
    result = collection.update_one({"name": name}, {"$push": {"history": procedure_data}})
    print(f"\nДобавлена новая запись в историю: {result.modified_count}")


perform_queries()

new_patient = {"name": "Мария Сидорова", "age": 28, "diagnosis": "Пульпит", "treatment": "Лечение каналов",
    "visit_date": datetime.now(), "doctor": "Сидоров П.П.", "cost": 6000, "insurance": True,
    "next_visit": datetime(2024, 3, 25), "history": []}
add_patient(new_patient)

update_patient("Иван Иванов", {"cost": 5000, "next_visit": datetime(2024, 3, 20)})

add_to_history("Иван Иванов", {"date": datetime.now(), "procedure": "Контрольный осмотр"})
