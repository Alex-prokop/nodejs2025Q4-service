import * as bcrypt from 'bcryptjs';

function getSaltRounds(): number {
  const env = process.env.CRYPT_SALT;
  let rounds = env !== undefined ? Number(env) : 10;

  if (!Number.isFinite(rounds)) {
    rounds = 10;
  }

  if (rounds < 4) {
    rounds = 4;
  } else if (rounds > 31) {
    rounds = 31;
  }

  return rounds;
}

export async function hashPassword(plain: string): Promise<string> {
  const rounds = getSaltRounds();
  return bcrypt.hash(plain, rounds);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
