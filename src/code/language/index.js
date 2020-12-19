import Parser from './parser';

export function interpret(code) {
  const errors = [];
  const parseResult = Parser.parse(code);
  parseResult.errors.forEach((err) => errors.push(err));

  if (!parseResult.ast) {
    return { errors };
  }

  return {
    code: parseResult.ast,
    errors,
  };
}

export function lint(code) {
  return interpret(code);
}
