import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tanımlı değil");
}

declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

global._mongoose ??= { conn: null, promise: null };

export async function connectDB() {
  // Bağlantı zaten varsa direkt döndür
  if (global._mongoose.conn) {
    return global._mongoose.conn;
  }

  // Promise yoksa yeni bağlantı başlat
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose.connect(MONGODB_URI);
  }

  // Promise'i bekle, bağlantıyı cache'e yaz
  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
