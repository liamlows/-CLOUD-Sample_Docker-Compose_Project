const knex = require('../database/knex');

//create new cart
const createCart = async (user_id, product_id, quantity) => {
    //add cart to table
    const query = knex('cart').insert({ customer_id: user_id, product_id, quantity });
    console.log('Raw query for createCart:', query.toString());
    const result = await query;
    //return cart
    const query2 = knex('cart').where({customer_id:user_id});
    console.log('Raw query for getCart:', query2.toString());
    const result2 = await query2;
    return result2;
}
//get product by cart
const fetchProductByID = async (product_id) => {
    //return product
    const query = knex('product').where({product_id});
    console.log('Raw query for getProduct:', query.toString());
    const result = await query;
    return result;
};
//create new order
const createOrder = async (firstName, lastName, address, city, state, zip, cardName, cardNumber, cardExprDate, purchaseDate, farmer_id, customer_id, product_id, quantity, price) => {
    //add order to table
    const query = knex('transactions').insert({ firstName, lastName, address, city, state, zip, cardName, cardNumber, cardExprDate, purchaseDate, farmer_id, customer_id, product_id, quantity, price });
    console.log('Raw query for createOrder:', query.toString());
    const result = await query;
    //get most recent order number
    const query2 = knex('transactions').max('transaction_id', {as: 'recentOrder'});
    console.log('Raw query for getOrder:', query2.toString());
    const result2 = await query2;
    //get order
    const query3 = knex('transactions').where({transaction_id: result2[0].recentOrder});
    console.log('Raw query for getOrder:', query3.toString());
    const result3 = await query3;
    //get products from cart
    const query4 = knex('cart').where({customer_id});
    console.log('Raw query for getCart:', query4.toString());
    const result4 = await query4;
    //add products to transaction
    for(let i=0;i<result4.length;i++){
        const query0 = knex('transaction_products').insert({ transaction_id: result2[0].recentOrder, product_id: result4[i].product_id, quantity: result4[i].quantity});
        console.log('Raw query for addProductsToTransaction:', query0.toString());
        const result0 = await query0;
    }
    //remove products from cart
    const query5 = knex('cart').where({customer_id}).del();
    console.log('Raw query for deleteCart:', query5.toString());
    const result5 = await query5;
    //get transaction products
    const query6 = knex('transaction_products').where({transaction_id: result2[0].recentOrder});
    console.log('Raw query for getTransactionProducts:', query6.toString());
    const result6 = await query6;
    return result3+result6;
}
//get product by cart
const fetchCartProducts = async (customer_id) => {
    //return product
    const query = knex('cart').join('product','product_id','cart.product_id').select().where({customer_id});
    console.log('Raw query for getProduct:', query.toString());
    const result = await query;
    return result;
};

module.exports = {
    createCart,
    fetchProductByID,
    createOrder,
    fetchCartProducts
};