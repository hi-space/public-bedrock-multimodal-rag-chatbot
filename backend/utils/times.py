from datetime import datetime


def getDatetime():
    return datetime.now().strftime('%y-%m-%d %H:%M:%S')

def strToDatetime(dt_str: str):
    return datetime.strptime(dt_str, '%y-%m-%d %H:%M:%S')
