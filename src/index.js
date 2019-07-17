const fp = require('fastify-plugin')
const mongoose = require('mongoose')
const parseEnv = require('./parseEnv')

const config = {
  host: parseEnv('MONGO_HOST', 'mongodb://localhost'),
  name: parseEnv('MONGO_NAME', 'ndx'),
  user: parseEnv('MONGO_USER', ''),
  pass: parseEnv('MONGO_PASS', ''),
}

module.exports = fp(
  async function(fastify, { url, connectionOptions, models = {} }) {
    const { user, pass, dbName, ...otherOptions } = connectionOptions || {}
    const cnn = await mongoose.createConnection(url || config.host, {
      useNewUrlParser: true,
      dbName: dbName || config.name,
      ...(user || config.user ? { user: user || config.user } : {}),
      ...(pass || config.pass ? { pass: pass || config.pass } : {}),
      ...otherOptions,
    })

    for (const key in models)
      if (models.hasOwnProperty(key)) cnn.model(key, models[key])

    fastify.decorate('mongoose', cnn)
    fastify.addHook('onClose', async () => cnn.close())
  },
  { fastify: '>=2.0.0', name: 'fastify-mongoose' }
)
