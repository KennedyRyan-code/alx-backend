#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
from typing import Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self):
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, list]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Returns a dictionary with information about the dataset page based on index.

        Parameters:
        - index (int): The start index of the current page.
        - page_size (int): The number of items per page.

        Returns:
        - Dict: A dictionary with hypermedia pagination information.
        """
        assert index is None or (isinstance(index, int) and 0 <= index < len(self.indexed_dataset())), "Invalid index"
        assert isinstance(page_size, int) and page_size > 0, "Page size must be a positive integer"

        start_index = index or 0
        next_index = start_index + page_size
        data = [self.indexed_dataset().get(i) for i in range(start_index, next_index)]

        return {
            'index': start_index,
            'next_index': next_index if next_index < len(self.indexed_dataset()) else None,
            'page_size': page_size,
            'data': data
        }
