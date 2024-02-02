#!/usr/bin/python3
""" LFUCache module
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache class that inherits from BaseCaching
    """
    def __init__(self):
        """Initialize LFUCache"""
        super().__init__()
        self.frequency = {}  # To keep track of items frequencies
        self.usage_order = []  # To keep track of the order of item usage

    def put(self, key, item):
        """ Add an item in the cache using LFU algorithm
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                # Discard the least frequency used item (LFU)
                lfu_keys = [key for key in self.cache_data.keys() if self.frequency[key] == min(self.frequency.values())]
                if len(lfu_keys) > 1:
                    # If there are multiple LFU items, use LRU to discard
                    lru_key = min(self.usage_order, key=lambda k: self.usage_order.index(k))
                    lfu_keys.remove(lru_key)
                else:
                    lru_key = lfu_keys[0]

                del self.cache_data[lru_key]
                del self.frequency[lru_key]
                self.usage_order.remove(lru_key)
                print("DISCARD: {}".format(lru_key))

            self.cache_data[key] = item
            self.frequency[key] = self.frequency.get(key, 0) + 1
            self.usage_order.append(key)

    def get(self, key):
        """ Get an item by key
        """
        if key is not None and key in self.cache_data:
            # Update the frequency and move the accessed key to the end of the usage order list
            self.frequency[key] += 1
            self.usage_order.remove(key)
            self.usage_order.append(key)
            return self.cache_data[key]
        return None
