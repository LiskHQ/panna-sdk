import { getErrorMessage } from './get-error-message';

describe('getErrorMessage', () => {
  it('should return error message when error is an Error instance', () => {
    const error = new Error('Test error message');
    const result = getErrorMessage(error);
    expect(result).toBe('Test error message');
  });

  it('should return string representation when error is a string', () => {
    const error = 'String error';
    const result = getErrorMessage(error);
    expect(result).toBe('String error');
  });

  it('should return string representation when error is a number', () => {
    const error = 404;
    const result = getErrorMessage(error);
    expect(result).toBe('404');
  });

  it('should return string representation when error is null', () => {
    const error = null;
    const result = getErrorMessage(error);
    expect(result).toBe('null');
  });

  it('should return string representation when error is undefined', () => {
    const error = undefined;
    const result = getErrorMessage(error);
    expect(result).toBe('undefined');
  });

  it('should return string representation when error is an object without message property', () => {
    const error = { code: 500, error: 'Internal error' };
    const result = getErrorMessage(error);
    expect(result).toBe('[object Object]');
  });

  it('should return string representation when error is an object with message property', () => {
    const error = { code: 500, message: 'Internal error' };
    const result = getErrorMessage(error);
    expect(result).toBe('Internal error');
  });

  it('should return string representation when error is an array', () => {
    const error = ['error1', 'error2'];
    const result = getErrorMessage(error);
    expect(result).toBe('error1,error2');
  });

  it('should handle custom Error subclasses', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    const error = new CustomError('Custom error message');
    const result = getErrorMessage(error);
    expect(result).toBe('Custom error message');
  });
});
