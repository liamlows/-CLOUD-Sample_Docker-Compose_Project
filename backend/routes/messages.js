const express = require('express');
const { query } = require('../db');
const pool = require('../db')

const router = express.Router();

const MessageController = require('../controllers/messages');


  // GET /
  router.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

// POST/nft
router.post('/nft', async (req, res, next) => {
  try {
      const body = req.body;
      console.log(body);

      const result = await req.models.nft.createNFT(body.name, body.image_url, body.price, body.description
        , body.creator_id, body.seller_id, body.owner_id, body.for_sale);
      res.status(201).json(result);

  } catch (err) {
      console.error("Failed to create new NFT: ", err);
      // res.status(500).
  }
})

// POST: /nft/id
router.post('/nft/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const body = req.body;

    var result;
    
    if (body.name != undefined) {
      result = await req.models.nft.updateName(params.id, body.name);
    }
    if (body.price != undefined) {
      result = await req.models.nft.updatePrice(params.id, body.price);
    }
    if (body.description != undefined) {
      result = await req.models.nft.updateDescription(params.id, body.description);
    }
    if (body.image_url != undefined) {
      result = await req.models.nft.updateImageUrl(params.id, body.image_url);
    }
    if (body.creator_id != undefined) {
      result = await req.models.nft.updateCreatorId(params.id, body.creator_id);
    } 
    if (body.seller_id != undefined) {
      result = await req.models.nft.updateSellerId(params.id, body.seller_id);
    } 
    if (body.owner_id != undefined) {
      result = await req.models.nft.updateOwnerId(params.id, body.owner_id);
    } 
    if (body.for_sale != undefined) {
      result = await req.models.nft.updateForSale(params.id, body.for_sale);
    }

    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to create new NFT: ", err);
  }

  next()
})

// GET: /nft/id
router.get('/nft/:id', async (req, res, next) => {
  try {

    const result = await req.models.nft.getNFT(req.params.id); 
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to create get NFT by name: ", err);
      // res.status(500).
  }

  next()
})

router.get('/nft', async (req, res, next) => {
  try {

    const result = await req.models.nft.fetchNFT(); 
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get NFT: ", err);
      // res.status(500).
  }

  next()
})

// DELETE: /nft/id
router.delete('/nft/:id', async (req, res, next) => {
  try {

    const result = await req.models.nft.deleteNFT(req.params.id); 
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to delete NFT by id: ", err);
      // res.status(500).
  }

  next()
}) 

  // for messages
// Post: create a message /message 
router.post('/message', async (req, res, next) => {
  try {
      const body = req.body;
      console.log(body);
      const result = await req.models.messages.createMessage(body.message,body.send_id,body.recieve_id);
      //const result = await req.models.message.createMessage(body.message, body.send_id, body.recieve_id);
      res.status(201).json(result);

  } catch (err) {
      console.error("Failed to create new message: ", err);
      // res.status(500).
  } 
}) 

// DELETE: /message/id
router.delete('/message/:id', async (req, res, next) => {
  try {

    const result = await req.models.messages.deleteMessage(req.params.id);
    res.status(201).json(result);
    //res.status(201).json(result);

  } catch (err) {
      console.error("Failed to delete message by id: ", err);
      // res.status(500).
  }

  next()
})

// Get: /message/id
router.get('/message/:send_id', async (req, res, next) => {
  try {

    const result = await req.models.messages.getMessage(req.params.send_id);
    res.status(201).json(result);
    //res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get message by send id: ", err);
      // res.status(500).
  }

  next()
})

// GET: /message
router.get('/search', async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const result = await MessageController.searchMessage(body.message, user.id);
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get message: ", err);
  }

  next()
})  

// GET: /message
router.get('/message', async (req, res, next) => {
  try {

    const result = await req.models.messages.fetchMessage();
    res.status(201).json(result);
    //res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get message: ", err);
      // res.status(500).
  }

  next()
}) 


router.get('/nft/:min/:max/:how', async (req, res) => {
  try {
    const params = req.params;

    if (params.min === undefined) params.min = 0
    if (params.max === undefined) params.max = Infinity
    if (params.how === undefined) params.how = true

    const result = await req.models.nft.getAllByPrice(params.min, params.max, params.how);
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get NFTs by price: ", err);
  }
})

router.get('/nft/search/:term', async (req, res) => {
  try {
    const term = req.params.term;

    const result = await req.models.nft.searchByTerm(term);
    res.status(201).json(result);

  } catch (err) {
      console.error("Failed to get NFTs by description: ", err);
  }
})


module.exports = router;