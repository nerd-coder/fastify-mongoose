import { FastifyInstance, Plugin } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { Connection, ConnectionOptions, Schema } from 'mongoose'

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: Connection
  }
}

declare global {
  namespace NerdCoder {
    interface PluginOptions {
      url: string
      connectionOptions: ConnectionOptions
      models?: { [key: string]: Schema }
    }
  }
}

declare let fastifyMongoose: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  PluginOptions
>

export = fastifyMongoose
