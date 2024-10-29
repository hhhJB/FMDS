from enum import Enum
from typing import List, Dict, Union
from BaseNode import NodeBase, NodeTag

class GroupNode(NodeBase):
    def __init__(self, name: str, tag: NodeTag, coefficient: float = 1.0, node_id: int = -1):
        
        super().__init__(name, tag, node_id)
        self.relation_coefficient = coefficient

    def to_jsonable_object(self) -> Dict:

        res = super().to_jsonable_object()
        res["coef"] = self.relation_coefficient
        return res
