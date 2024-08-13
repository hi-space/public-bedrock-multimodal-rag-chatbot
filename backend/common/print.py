try:
    from termcolor import colored
    import colorama
    colorama.init()
except ImportError:
    def colored(text, color):
        return str(text)

def print_color(str, color, end='\n'):
    print(colored(str, color), end=end)

def print_red(str, end='\n'):
    print(colored(str, 'red'), end=end)


def print_green(str, end='\n'):
    print(colored(str, 'green'), end=end)


def print_yellow(str, end='\n'):
    print(colored(str, 'yellow'), end=end)


def print_cyan(str, end='\n'):
    print(colored(str, 'cyan'), end=end)


def print_blue(str, end='\n'):
    print(colored(str, 'blue'), end=end)


def print_magenta(str, end='\n'):
    print(colored(str, 'magenta'), end=end)
