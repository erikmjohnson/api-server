  'use strict';

/**
 * API Router Module (V1)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../../docs/config/swagger.json');


  //docs and swagger
  router.use('/doc', express.static('docs'));
  router.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Evaluate the model, dynamically
router.param('model', modelFinder);

// API Routes
router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);

router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

// Route Handlers

/**
 * Fetches all records from a given model.
 * @example router.get('/api/v1/:model', handleGetAll);
 * @param req {object} Express Request Object (required params: model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetAll(request,response,next) {
  return request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 * Fetches a single record from a given model.
 * @example router.get('/api/v1/:model/:id', handleGetOne);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetOne(request,response,next) {
  return request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 * Creates a single record in a given model.
 * @example router.post('/api/v1/:model', handlePost);
 * @param req {object} Express Request Object (required params: req.model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePost(request,response,next) {
  return request.model.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Updates a single record in a given model.
 * @example router.put('/api/v1/:model/:id', handlePut);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePut(request,response,next) {
  return request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Deletes a single record from a given model.
 * @example router.delete('/api/v1/:model/:id', handleDelete);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleDelete(request,response,next) {
  return request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;
