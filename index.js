const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const Joi = require("joi");
require('dotenv').config();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger/swagger_output.json')
const swaggerJsDoc = require('swagger-jsdoc')
const host = '0.0.0.0';
const swaggerOptions = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "YaProfi",
            description: "Task3",
            servers: ["http://" + host + ":" + process.env.PORT || 8080]
        }
    },
    apis: ["index.js"]
}
let db;
// https://www.npmjs.com/package/autocannon
const swaggerDocs = swaggerJsDoc(swaggerOptions)
const app = express();

async function getNextSequence(name) {
    var ret = await db.collection('counters').findOneAndUpdate(
        {
             _id: name
        },
        { $inc: { seq: 1 } },
        {new: true, upsert: true}
    );
    if (ret.value === null) {
        return 0
    }
    return ret.value.seq;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * @swagger
 * /promo/{id}:
 *  get:
 *      description: Use to request to get promo by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *      responses:
 *          '200':
 *              description: A successfull response
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PromoItem'
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 *  put:
 *      description: Use to update promo by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *          - in: body
 *            name: body
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *      responses:
 *          '200':
 *              description: A successfull response
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PromoItem'
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 *  delete:
 *      description: Use to delete promo by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *      responses:
 *          '200':
 *              description: A successfull deleted
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 * /promo/{id}/participant/{participantId}:
 *  delete:
 *      description: Use to delete Participant from promo by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *          - in: path
 *            name: participantId
 *            required: true
 *            description: Participant Id
 *            type: number
 *      responses:
 *          '200':
 *              description: A successfull deleted
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 *
 * /promo/{id}/prize/{prizeId}:
 *  delete:
 *      description: Use to delete prize from promo by ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *          - in: path
 *            name: prizeId
 *            required: true
 *            description: Prize Id
 *            type: number
 *      responses:
 *          '200':
 *              description: A successfull deleted
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 * /promo:
 *  get:
 *      description: Use to request to get all promo
 *      responses:
 *          '200':
 *              description: A successfull response
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PromoArray'
 *          '400':
 *              description: Invalid params
 *          '500':
 *              description: Invalid error
 *  post:
 *      description: Use to add new promo
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '400':
 *              description: Invalid params
 *          '500':
 *              description: Invalid error
 * /promo/{id}/prize:
 *  post:
 *      description: Use to add new prize by promo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *          - in: body
 *            name: body
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - description
 *              properties:
 *                  description:
 *                      type: string
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '400':
 *              description: Invalid params
 *          '404':
 *              description: Data not found
 *          '500':
 *              description: Invalid error
 * /promo/{id}/participant:
 *  post:
 *      description: Use to add new participant by promo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *          - in: body
 *            name: body
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  name:
 *                      type: string
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '400':
 *              description: Invalid params
 *          '500':
 *              description: Invalid error
 * /promo/{id}/raffle:
 *  post:
 *      description: Use to add new participant by promo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Promo ID
 *            type: number
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '400':
 *              description: Invalid params
 *          '409':
 *              description: Conflict. Prizes length !== participants length
 *          '500':
 *              description: Invalid error
 * components:
 *   schemas:
 *     PromoItem:
 *       type: object
 *       properties:
 *          id:
 *              type: integer
 *          name:
 *              type: string
 *          description:
 *              type: string
 *          prizes:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                      description:
 *                          type: string
 *          participants:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                      name:
 *                          type: string
 *     PromoArray:
 *       type: array
 *       items:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              description:
 *                  type: string
 *
 */
app.post('/promo', async (req, res) => {
    try {
        const { name, description } = req.body;

        let data = {
            name,
            description
        }

        const {error} = Joi.object({
            name: Joi.string().required(),
            description: Joi.string(),
        }).validate(data);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        data.id = await getNextSequence("item_id")
        data.prizes = []
        data.participants = []

        await db.collection('profi').insertOne(data)

        const returned = data.id

        return res.send(returned.toString())
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.post('/promo/:id/prize', async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body;

        let validate = {
            id: parseInt(id),
            description
        }

        const {error} = Joi.object({
            id: Joi.number().required(),
            description: Joi.string().required(),
        }).validate(validate);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const prizeId = await getNextSequence(validate.id + "_prize_id")

        await db.collection('profi').findOneAndUpdate(
            { id: validate.id },
            { $addToSet:
                    {
                        prizes: {
                            description: validate.description,
                            id: prizeId
                        }
                    }
            }
        )

        return res.send(prizeId.toString())
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})


app.get('/promo', async (req, res) => {
    try {
        let data;
        data = await db.collection('profi').find({}, { projection: { _id: 0, prizes: 0, participants: 0 } }).toArray()

        return res.send(data)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.get('/promo/:id', async (req, res) => {
    try {
        const { id } = req.params
        let validate = { id: parseInt(id) }
        const {error} = Joi.object({
            id: Joi.number().required(),
        }).validate(validate);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const data = await db.collection('profi').findOne({ id: validate.id }, { projection: { _id: 0 } })

        if (data === null) {
            return res.sendStatus(404)
        }

        return res.send(data)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.post('/promo/:id/participant', async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body;

        let data = {
            name,
            id: parseInt(id)
        }

        const {error} = Joi.object({
            name: Joi.string().required(),
            id: Joi.number().required(),
        }).validate(data);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const user_id = await getNextSequence(id + "_user_id")

        await db.collection('profi').findOneAndUpdate(
            { id: data.id },
            { $addToSet:
                {
                    participants: {
                        name: data.name,
                        id: user_id
                    }
                }
            }
        )

        return res.send(user_id.toString())
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.delete('/promo/:id', async (req, res) => {
    try {
        const { id } = req.params
        let validate = { id: parseInt(id) }
        const {error} = Joi.object({
            id: Joi.number().required(),
        }).validate(validate);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const data = await db.collection('profi').findOneAndDelete({ id: validate.id }, { projection: { _id: 0 } })

        if (data.value === null) {
            return res.sendStatus(404)
        }

        return res.sendStatus(200)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.delete('/promo/:id/participant/:userId', async (req, res) => {
    try {
        const { id, userId } = req.params
        let validate = {
            id: parseInt(id),
            userId: parseInt(userId)
        }

        const {error} = Joi.object({
            id: Joi.number().required(),
            userId: Joi.number().required(),
        }).validate(validate);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const data = await db.collection('profi').findOneAndUpdate(
            { id: validate.id },
            { $pull: {
                    participants: {
                        id: validate.userId
                    }
                }
            }
        )

        const isUserExists = data.value.participants.filter((item) => item.id === validate.userId)

        if (isUserExists.length === 0) {
            return res.sendStatus(404)
        }

        return res.sendStatus(200)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.delete('/promo/:id/prize/:prizeId', async (req, res) => {
    try {
        const { id, prizeId } = req.params
        let validate = {
            id: parseInt(id),
            prizeId: parseInt(prizeId)
        }

        const {error} = Joi.object({
            id: Joi.number().required(),
            prizeId: Joi.number().required(),
        }).validate(validate);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const data = await db.collection('profi').findOneAndUpdate(
            { id: validate.id },
            { $pull: {
                    prizes: {
                        id: validate.prizeId
                    }
                }
            }
        )

        const isPrizeExist = data.value.prizes.filter((item) => item.id === validate.prizeId)

        if (isPrizeExist.length === 0) {
            return res.sendStatus(404)
        }

        return res.sendStatus(200)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.put('/promo/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body;

        let data = {
            name,
            description,
            id: parseInt(id)
        }

        const {error} = Joi.object({
            name: Joi.string().required().trim().min(1),
            description: Joi.string().required(),
            id: Joi.number().required(),
        }).validate(data);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const result = await db.collection('profi').findOneAndUpdate(
            { id: data.id },
            {
                $set: {
                    name: data.name,
                    description: data.description
                }
            }
        )

        if (result.value === null) {
            return res.sendStatus(404)
        }


        return res.sendStatus(200)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.post('/promo/:id/raffle', async (req, res) => {
    try {
        const { id } = req.params

        let data = {
            id: parseInt(id)
        }

        const {error} = Joi.object({
            id: Joi.number().required(),
        }).validate(data);

        if (error) {
            console.error(error)
            return res.sendStatus(400)
        }

        const promo = await db.collection('profi').findOne(
            { id: data.id },
            { projection: { _id: 0 } }
        )

        if (promo === null) {
            return res.sendStatus(404)
        }

        if ((promo.prizes.length !== promo.participants.length) || promo.prizes.length === 0) {
            return res.sendStatus(409)
        }

        let { prizes, participants } = promo
        let response = new Array(prizes.length);

        for (let i = 0; i < participants.length; i++) {
            let rand = Math.floor(Math.random() * prizes.length);
            response[i] = {
                winner: {
                    id: participants[i].id,
                    name: participants[i].name
                },
                prize: {
                    id: prizes[rand].id,
                    description: prizes[rand].description,
                }
            }
            prizes = prizes.filter(item => item.id !== prizes[rand].id)
        }

        return res.send(response)
    } catch(err) {
        console.error(err)
        return res.status(500).send({
            error: 'Something broke.'
        })
    }
})

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




const mongodburi = process.env.MONGODB_URI
MongoClient.connect(mongodburi, { useUnifiedTopology: true, useNewUrlParser: true }, (err, database) => {
    if (err) {
        return console.log(err);
    }
    console.log('Database connected');
    db = database.db("profi")
    app.listen(process.env.PORT || 8080, host, () => console.log('server started'));
    console.log('Working fine');
});