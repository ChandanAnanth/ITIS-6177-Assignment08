const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host : 'localhost',
        user : 'root',
        password: 'root',
        port: 3306,
        connectionLimit:5
});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'Personal Budget API',
            version: '1.0.0',
            description: 'Personal Budget API autogenerated by'
        },
        host: '157.245.85.92:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @swagger
 * /listofitems:
 *     get:
 *       description: Return all orders
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: object containing all the order data
*/
app.get('/listofitems',(req,resp) =>{
    pool.query('SELECT * from sample.listofitem')
        .then(res => {
                resp.statusCode = 200;
                resp.setHeader('Content-Type','Application/json');
                resp.send(res);
                })
        .catch(err =>{ 
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});


/**
 * @swagger
 * /listofitems:
 *  put:
 *    description: Updates items data
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: itemCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/itemPut"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/itemPut"
 *    responses: 
 *      200:
 *       description: A successfull response
 * definitions:
 *   itemPut:
 *     type: object
 *     required:
 *     - itemcode
 *     - itemname
 *     - batchcode
 *     - coname
 *     properties:
 *       itemcode:
 *         type: string
 *         example: I001
 *       itemname:
 *         type: string
 *         example: Chocolate
 *       batchcode: 
 *         type: string
 *         example: DM-2007-08
 *       coname:
 *         type: string
 *         example: ABJ
*/
app.put('/listofitems', (req,resp) =>{
    pool.query(`update sample.listofitem set itemcode = '${req['body'].itemcode}',  itemname = '${req['body'].itemname}', batchcode  = '${req['body'].batchcode}', coname = '${req['body'].coname}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send("The agent is not located in the table - Operation  unsuccessful");
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});



/**
 * @swagger
 * /listofitems:
 *  post:
 *    description: Add a new item
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: itemcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/itemPost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/itemPost"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   itemPost:
 *     type: object
 *     required:
 *     - itemcode
 *     - itemname
 *     - batchcode
 *     - coname
 *     properties:
 *       itemcode:
 *         type: string
 *         example: A098
 *       itemname:
 *         type: string
 *         example: Burger
 *       batchcode:
 *         type: string
 *         example: DM/2022-02/WBM%3
 *       coname:
 *         type: string
 *         example: CAG
*/
app.post('/listofitems',(req,resp) =>{
    pool.query(`insert into sample.listofitem values ('${req['body'].itemcode}', '${req['body'].itemname}', '${req['body'].batchcode}', '${req['body'].coname}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows added -Operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /listofitems:
 *  delete:
 *    description: Removes a item
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: itemcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/itemDel"
 *    responses: 
 *      200:
 *       description: A successfull response
 * definitions:
 *   itemDel:
 *     type: object
 *     required:
 *     - itemcode
 *     properties:
 *       itemcode:
 *         type: string
 *         example: 'I002'
*/
app.delete('/listofitems',(req,resp) =>{
    pool.query(`delete from sample.listofitem where itemcode =  ('${req['body'].itemcode}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows delete - operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /listofitems:
 *  patch:
 *    description: updates or inserts item
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: itemcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/itemPatch"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/itemPatch"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   itemPatch:
 *     type: object
 *     required:
 *     - itemcode
 *     - itemname
 *     - batchcode
 *     - coname
 *     properties:
 *       itemcode:
 *         type: string
 *         example: I098
 *       itemname:
 *         type: string
 *         example: Burger
 *       batchcode:
 *         type: string
 *         example: DM/2022-02/WBM%3
 *       coname:
 *         type: string
 *         example: CAG
*/
app.patch('/listofitems',(req,resp) =>{
    pool.query(`update sample.listofitem set itemname = '${req['body'].itemname}',  batchcode = '${req['body'].batchcode}', coname  = '${req['body'].coname}'  where itemcode = '${req['body'].itemcode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                    pool.query(`insert into sample.listofitem values('${req['body'].itemcode}', '${req['body'].itemname}', '${req['body'].batchcode}', '${req['body'].coname}')`).then(res1 => {
                        if(res1.affectedRows > 0)
                        {
                            resp.statusCode = 200;                 
                            resp.setHeader('Content-Type','Application/json');
                            resp.send(res1);
                        }
                        else{
                            resp.statusCode = 201;
                            resp.setHeader('Content-Type','text/plain');
                            resp.send("The item is not located in the table - Operation  unsuccessful");
                        }
                    })
                    .catch(err =>{
                        resp.statusCode = 404;
                        console.error('Error exccuting query', err.stack);
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('Error executing query' + err.stack);
                    });
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});


app.listen(port, ()=>{
    console.log(`server is running at ${port}`);
});
