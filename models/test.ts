// models/test.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface ITest extends Document {
  message: string;
}

const testSchema = new Schema<ITest>({
  message: { type: String, required: true },
});

const Test = models.Test || model<ITest>('Test', testSchema);
export default Test;
