import { validateSync, IsString } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { registerAs } from '@nestjs/config';
import { AppConfigs } from './app.type';

export default registerAs('appConfigs', (): AppConfigs => {
  const validatedEnvs = validate(process.env);

  return {
    connectionString: validatedEnvs.CONNECTION_STRING,
  };
});

class EnvironmentVariables {
  @IsString()
  CONNECTION_STRING: string;
}

function validate(config: Record<string, unknown>) {
  const validatedConfigs = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const validatedConfigsErrors = validateSync(validatedConfigs, {
    skipMissingProperties: false,
  });

  if (validatedConfigsErrors.length > 0) {
    console.dir({
      errors: validatedConfigsErrors.map((error) => ({
        value: error.value,
        property: error.property,
        message: Object.values(error.constraints!)[0],
      })),
      errorCode: 'required_environment_variables_loading_failed',
      message: 'Application could not load required environment variables',
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedConfigs;
}
