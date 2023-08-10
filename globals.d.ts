import type { MongoClient } from 'mongodb'

declare global {
    var __MONGO_URI__: string;
}