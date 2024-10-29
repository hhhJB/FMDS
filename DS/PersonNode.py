from enum import Enum
from typing import List, Dict
from BaseNode import NodeBase, NodeTag

class PersonGender(Enum):
    MALE = 1
    FEMALE = 2
    OTHER = 3

class PersonNode(NodeBase):
    def __init__(self, name: str, gender: PersonGender, node_id: int = -1):
        super().__init__(name, NodeTag.PERSON, node_id)
        self.gender = gender

    def to_jsonable_object(self) -> Dict:

        res = super().to_jsonable_object()
        res["gender"] = self.gender.value
        return res
