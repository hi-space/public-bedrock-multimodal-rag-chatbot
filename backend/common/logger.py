import sys
import logging
from common.singleton import SingletonInstane
try:
    import colorama
    from termcolor import colored
    colorama.init()
except ImportError:
    def colored(text, color):
        return str(text)
    

class Logger(SingletonInstane):
    _logger = None

    @classmethod
    def get_logger(cls, name: str = "my_app_logger", filename: str = None) -> logging.Logger:
        if cls._logger is None:
            cls._logger = logging.getLogger(name)
            cls._logger.setLevel(logging.DEBUG)
            if not cls._logger.handlers:
                # processName, process, threadName, thread, name
                # formatter = logging.Formatter("%(asctime)s [%(levelname)s] [%(pathname)s:%(lineno)d] %(message)s")
                formatter = ColorFormatter("%(asctime)s [%(levelname)s] [%(funcName)s] %(message)s")

                console_handler = logging.StreamHandler(sys.stdout)
                console_handler.setFormatter(formatter)
                cls._logger.addHandler(console_handler)                

                if filename:
                    fileHandler = logging.FileHandler(filename=filename)
                    fileHandler.setFormatter(formatter)
                    cls._logger.addHandler(fileHandler)

        return cls._logger

class ColorFormatter(logging.Formatter):
    def format(self, record):
        log_colors = {
            'DEBUG': 'blue',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red',
        }
        
        color = log_colors.get(record.levelname, 'white')
        record.levelname = colored(record.levelname, color)
        record.msg = colored(record.msg, color)
        return super().format(record)


logger = Logger.get_logger()