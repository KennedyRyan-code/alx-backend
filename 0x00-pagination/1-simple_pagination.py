#!/usr/bin/python3
"""
Implement a method named get_page that takes two integer arguments page
with default value 1 and page_size with default value 10.
"""
import csv
from typing import List


def index_range(page: int, page_size: int) -> tuple:
    """
    Returns a tuple of start and end indexes for a given page and page size.

    Parameters:
    - page (int): The 1-indexed page number.
    - page_size (int): The number of items per page.

    Returns:
    - tuple: A tuple containing start and end indexes.
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return start_index, end_index

class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieves the specified page of the dataset based on page and page_size.

        Parameters:
        - page (int): The 1-indexed page number.
        - page_size (int): The number of items per page.

        Returns:
        - List[List]: The list of rows for the specified page.
        """
        assert isinstance(page, int) and page > 0, "Page must be a positive integer"
        assert isinstance(page_size, int) and page_size > 0, "Page size must be a positive integer"

        start_index, end_index = index_range(page, page_size)
        dataset = self.dataset()

        if start_index >= len(dataset):
            return []  # Return an empty list if start index is out of range

        return dataset[start_index:end_index]
