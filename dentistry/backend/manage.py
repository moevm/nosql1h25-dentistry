import os
import sys
from os.path import dirname, abspath

sys.path.insert(0, dirname(dirname(abspath(__file__))))


def run():
    from django.core.management import execute_from_command_line
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.core.settings')

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    run()
