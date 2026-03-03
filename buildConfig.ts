import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CONFIG_FILE_NAME = '_app.config.js';
const OUTPUT_DIR = 'dist';

interface CreateConfigParams {
  configName: string;
  config: Record<string, any>;
  configFileName?: string;
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, configFileName } = params;
  try {
    const windowConf = `window.${configName}`;
    let configStr = `${windowConf}=${JSON.stringify(config)};`;
    configStr += `
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');

    mkdirSync(resolve(process.cwd(), OUTPUT_DIR), { recursive: true });
    writeFileSync(resolve(process.cwd(), `${OUTPUT_DIR}/${configFileName}`), configStr);

    console.log(`✨ Configuration file is build successfully:`);
    console.log(`${OUTPUT_DIR}/${configFileName}\n`);
  } catch (error) {
    console.log('Configuration file failed to package:\n' + error);
  }
}

function getEnvConfig() {
  const envConfig: Record<string, any> = {};
  const mode = process.env.NODE_ENV || 'production';
  const envFiles = ['.env', `.env.${mode}`];
  
  for (const envFile of envFiles) {
    try {
      const envContent = readFileSync(resolve(process.cwd(), envFile), 'utf-8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=').trim();
          if (key && value) {
            envConfig[key] = value;
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to read ${envFile} file:`, e);
    }
  }
  
  return envConfig;
}

function getConfigFileName(env: Record<string, any>) {
  return `__PRODUCTION__${env.M_PUBLIC_PATH || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
}

export function runBuildConfig() {
  const config = getEnvConfig();
  const configFileName = getConfigFileName(config);
  createConfig({ config, configName: configFileName, configFileName: CONFIG_FILE_NAME });
}

runBuildConfig();