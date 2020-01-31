import { FastifyInstance, Plugin } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { Connection, ConnectionOptions, Schema } from 'mongoose'

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: Connection
  }
}

declare let fastifyMongoose: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  {
    url: string
    connectionOptions: ConnectionOptions
    models?: { [key: string]: Schema }
  }
>

export = fastifyMongoose
