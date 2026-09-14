import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
    }
    return await clientPromise;
  } catch (err) {
    console.warn('[MongoDB] Connection failed, falling back to in-memory/client storage:', err);
    return null;
  }
}

export async function getDatabase(dbName = 'mla_legal_journal'): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db(dbName);
}

export async function checkMongoConnection(): Promise<{ connected: boolean; message: string }> {
  if (!uri) {
    return {
      connected: false,
      message: 'No MONGODB_URI configured. Operating in high-performance local client storage mode.',
    };
  }
  try {
    const mongoClient = await getMongoClient();
    if (!mongoClient) {
      return { connected: false, message: 'Could not connect to MongoDB client.' };
    }
    await mongoClient.db('admin').command({ ping: 1 });
    return { connected: true, message: 'Successfully connected to MongoDB cluster!' };
  } catch (error: unknown) {
    const err = error as Error;
    return { connected: false, message: `MongoDB error: ${err?.message || 'Connection timed out'}` };
  }
}
