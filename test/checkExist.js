const fastify = require('fastify')
const tap = require('tap')

const fastifyMongoose = require('../src')

tap.test(
  'fastify.mongoose should exist',
  /** @param {tap} t */
  async function(t) {
    t.plan(7)

    const app = fastify().register(fastifyMongoose, {
      url: 'mongodb://localhost:27017/test',
      models: {
        Post: {
          title: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
        },
        Account: {
          username: {
            type: String,
          },
          password: {
            type: String,
            select: false,
            required: true,
          },
          email: {
            type: String,
            unique: true,
            required: true,
            validate: {
              validator: v => {
                // Super simple email regex: https://stackoverflow.com/a/4964763/7028187
                return /^.+@.{2,}\..{2,}$/.test(v)
              },
              message: props => `${props.value} is not a valid email!`,
            },
          },
          posts: [
            {
              type: 'ObjectId',
              ref: 'Post',
              validateExistance: true,
            },
          ],
          createdAtUTC: {
            type: Date,
            required: true,
          },
        },
      },
    })

    app.post('/', async ({ body }) => {
      const { username, password, email } = body
      const createdAtUTC = new Date()
      const account = new app.mongoose.models.Account({
        username,
        password,
        email,
        createdAtUTC,
      })
      await account.save()
      return await app.mongoose.models.Account.findOne({ email })
    })

    try {
      await app.ready()
      t.ok(app.mongoose)
      t.ok(app.mongoose.models.Account)
      t.ok(app.mongoose.models.Post)

      if (app.mongoose) {
        app.mongoose.dropDatabase() // Cleanup before test
      }

      const { statusCode, payload } = await app.inject({
        method: 'POST',
        url: '/',
        payload: {
          username: 'test',
          password: 'pass',
          email: 'test@example.com',
        },
      })
      const json = JSON.parse(payload)
      const { username, password, email } = json
      t.strictSame(statusCode, 200, json)
      t.strictSame(username, 'test', json)
      t.strictSame(password, undefined, json)
      t.strictSame(email, 'test@example.com', json)
    } catch (e) {
      t.fail('Fastify threw' + e.message, e)
    }

    app.close()
  }
)
