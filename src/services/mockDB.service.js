const fetchUser = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        lastAccessed: new Date()
    };
};

const fetchProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { id: 1, name: 'Product A', price: 99.99 },
        { id: 2, name: 'Product B', price: 149.99 }
    ];
};

module.exports = {
    fetchUser,
    fetchProducts
};