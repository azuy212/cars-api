export default () => {
  const {
    DB_USER_NAME,
    DB_PASSWORD,
    DB_HOST = 'localhost:27017',
    DB_NAME = 'primeTraders',
    JWT_SECRET = 'asdfghjklzxcvbnm',
    HASH_SALT_ROUNDS = 10,
    JWT_EXPIRES = '12h',
  } = process.env;
  return {
    DB_URI: DB_HOST.includes('localhost')
      ? `mongodb://${DB_HOST}/${DB_NAME}`
      : `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    JWT_SECRET,
    HASH_SALT_ROUNDS,
    JWT_EXPIRES,
  };
};
