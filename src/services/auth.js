import bcrypt from 'bcryptjs';

export async function createPasswordHash(password) {
    return bcrypt.hash(password, 12);
}

export async function checkPassword(user, password) {
    return await bcrypt.compare(password, user.password);
}