export function getEnvFilePath(): string {
  const env = process.env.ENV || 'development';

  if (env === 'development') {
    return '.dev.env';
  } else if (env === 'test') {
    return '.test.env';
  } else if (env === 'production') {
    return '.prod.env';
  } else {
    throw new Error('env not supported');
  }
}
