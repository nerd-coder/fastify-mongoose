const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(
  async function(fastify, { url, connectionOptions, models = {} }) {
    const cnn = await mongoose.createConnection(url, connectionOptions)

    for (const key in models) if (models.hasOwnProperty(key)) cnn.model(key, models[key])

    fastify.decorate('mongoose', cnn)
    fastify.addHook('onClose', async () => cnn.close())
  },
  { fastify: '>=2.0.0', name: 'fastify-mongoose' }
)
