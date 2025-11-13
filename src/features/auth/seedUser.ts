import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { userSchema } from '../user/entities/user.entity';

async function main() {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://isalman23701_db_user:HXsKVncBZroVVPaO@cluster0.qxavhuz.mongodb.net/';

    console.log('Connecting to', MONGO_URI);
    await mongoose.connect(MONGO_URI, { dbName: process.env.MONGO_DB || undefined });

    const UserModel = mongoose.model('User', userSchema);

    const email = 'ultrawater@gmail.com';
    const plainPassword = 'ultrawater#123';

    const existing = await UserModel.findOne({ email }).exec();
    if (existing) {
        console.log('User already exists:', email);
        await mongoose.disconnect();
        process.exit(0);
    }

    const hashed = await bcrypt.hash(plainPassword, 10);

    const created = await UserModel.create({
        name: 'Ultra Water',
        email,
        password: hashed,
    });

    console.log('Created user:', created.email);
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
