import { SOURCE, NUM, SEQUENCE, CHANNEL, BUS } from './nodes';

export function prettyPrint(ast) {
  switch (ast.node) {
    case SOURCE:
      return `${prettyPrint(ast.source)} ->`;
    case NUM:
      return `${ast.value}`;
    case CHANNEL:
      return `${ast.name}`;
    case BUS:
      return `${ast.name}`;
    case SEQUENCE:
      // TODO needs to account for lengths
      return `${ast.values.join(', ')}`;
    default:
      return 'unknown';
  }
}
