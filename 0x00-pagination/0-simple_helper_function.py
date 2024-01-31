#!/usr/bin/env python3
"""a function index_range that takes two integer arguments page& page_size"""


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
