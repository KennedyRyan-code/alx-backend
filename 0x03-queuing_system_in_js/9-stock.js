import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Create express app
const app = express();
const port = 1245;

// Data: list of products
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get item by ID
const getItemById = (id) => {
    return listProducts.find(item => item.itemId === id);
};

// Redis client setup
const client = redis.createClient();
const reserveStockByIdAsync = promisify(client.set).bind(client);
const getCurrentReservedStockByIdAsync = promisify(client.get).bind(client);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to list all products
app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

// Route to get product details by ID
app.get('/list_products/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const item = getItemById(parseInt(itemId));

    if (!item) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentQuantity = await getCurrentReservedStockByIdAsync(`item.${itemId}`) || item.initialAvailableQuantity;
    const productDetail = { ...item, currentQuantity };
    res.json(productDetail);
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const item = getItemById(parseInt(itemId));

    if (!item) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentQuantity = await getCurrentReservedStockByIdAsync(`item.${itemId}`) || item.initialAvailableQuantity;

    if (currentQuantity <= 0) {
        return res.status(400).json({ status: 'Not enough stock available', itemId: parseInt(itemId) });
    }

    await reserveStockByIdAsync(`item.${itemId}`, currentQuantity - 1);
    return res.json({ status: 'Reservation confirmed', itemId: parseInt(itemId) });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});