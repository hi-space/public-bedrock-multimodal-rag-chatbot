class Entity(object):
    def __init__(self):
        pass

    @classmethod
    def from_dict(cls, data_dict):
        valid_fields = set(cls.__init__.__code__.co_varnames[1:])
        filtered_dict = {k: v for k, v in data_dict.items() if k in valid_fields}
        return cls(**filtered_dict)

    def to_dict(self):
        return {attr: getattr(self, attr) for attr in vars(self) if not attr.startswith('__') and getattr(self, attr) != 0 and getattr(self, attr) != "" and getattr(self, attr) != []}

    def __str__(self):
        return str(self.__dict__)

    def __repr__(self) -> str:
        return str(self.__dict__)

    def __getitem__(self,key):
        return getattr(self, key)
    
    def __setitem__(self,key,value):
        return setattr(self, key, value)
