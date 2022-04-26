const knex = require('../database/knex')

const NFT_TABLE = 'nft'


const fetchNFT = async () => {

    const query = knex(NFT_TABLE); 
    const result = await query; 

    return result;
}

const createNFT = async (name, image_url, price, description, creator_id, 
    seller_id, owner_id, for_sale) => {

    const query = knex(NFT_TABLE).insert({ name, image_url, price, description, 
        creator_id, seller_id, owner_id, for_sale});
    const result = await query;

    return result;
}

const updateName = async (id, name) => {
    const query = knex(NFT_TABLE).update({ name: name} ).where({ id });
    const result = await query;

    return result;
}

const updatePrice = async (id, price) => {
    const query = knex(NFT_TABLE).update({price: price} ).where({ id });
    const result = await query;

    return result;
}

const updateDescription = async (id, description) => {
    const query = knex(NFT_TABLE).update({ description: description } ).where({ id });
    const result = await query;

    return result;
}

const updateImageUrl = async (id, image_url) => {
    const query = knex(NFT_TABLE).update({image_url: image_url} ).where({ id });
    const result = await query;

    return result;
}

const updateCreatorId = async (id, creator_id) => {
    const query = knex(NFT_TABLE).update({creator_id: creator_id} ).where({ id });
    const result = await query;

    return result;
}

const updateSellerId = async (id, seller_id) => {
    const query = knex(NFT_TABLE).update({ seller_id: seller_id } ).where({ id });
    const result = await query;

    return result;
}

const updateOwnerId = async (id, owner_id) => {
    const query = knex(NFT_TABLE).update({ owner_id: owner_id} ).where({ id });
    const result = await query;

    return result;
}

const updateForSale = async (id, for_sale) => {
    const query = knex(NFT_TABLE).update({for_sale: for_sale} ).where({ id });
    const result = await query;

return result;
}

const getNFT = async (id) => {
    const query = knex(NFT_TABLE).where({ id });
    // (NFT_TABLE).where({ name })
    const result = await query;

    return result;
}

const deleteNFT = async (id) => {
    const query = knex(NFT_TABLE).where({ id }).del();
    // (NFT_TABLE).where({ name })
    const result = await query;

    return result;
}

module.exports = {
    createNFT, 
    getNFT,
    fetchNFT,
    deleteNFT,
    updateName,
    updatePrice,
    updateDescription,
    updateImageUrl,
    updateCreatorId,
    updateSellerId,
    updateOwnerId,
    updateForSale 
}
