/* eslint-disable @typescript-eslint/no-explicit-any */
import signale from 'signale';

export interface Logger {
  info(message?: any, ...optionalArgs: any[]): void;
  warn(message?: any, ...optionalArgs: any[]): void;
  error(message?: any, ...optionalArgs: any[]): void;
}

export const SignaleLogger: Logger = signale;

export const NullLogger: Logger = {
  info() {},
  warn() {},
  error() {},
};
