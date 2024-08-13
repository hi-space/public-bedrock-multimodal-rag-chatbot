import numpy as np


def deep_clean(data):
    if isinstance(data, dict):
        cleaned_data = {k: deep_clean(v) for k, v in data.items() if v is not None and v != ''}
        return {k: v for k, v in cleaned_data.items() if v}
    elif isinstance(data, list):
        cleaned_list = [deep_clean(item) for item in data if item is not None and item != '']
        if cleaned_list:
            return cleaned_list
        else:
            return None
    else:
        return data


def safe_float_conversion(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def softmax(xlist: list):
    x = np.array(xlist)
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()