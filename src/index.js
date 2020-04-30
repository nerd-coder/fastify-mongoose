const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(
  /** @param {NerdCoder.PluginOptions} options */
  async function (fastify, options) {
    const { url, connectionOptions, models = {} } = options
    const cnn = await mongoose.createConnection(url, connectionOptions)

    for (const key in models)
      if (models.hasOwnProperty(key)) cnn.model(key, models[key])

    fastify.decorate('mongoose', cnn)
    fastify.addHook('onClose', async () => cnn.close())
  },
  { fastify: '>=2.0.0', name: 'fastify-mongoose' }
)
