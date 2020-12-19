import { interpret, lint } from './language';

export class Ceed {
  constructor(config, eventBus, CodeMirror) {
    this.eventBus = eventBus;

    this.editor = CodeMirror(
      (el) => {
        document.querySelector('body').appendChild(el);
      },
      {
        keyMap: config.keyMap,
        lineNumbers: config.lineNumbers,
        theme: config.theme,
        value: config.program,
        mode: 'ceed',
        autofocus: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: {
          getAnnotations: (text) => {
            const { errors } = lint(text);

            console.log(errors);
            return errors.map((err) => ({
              from: CodeMirror.Pos(err.line - 1, err.character - 1),
              to: CodeMirror.Pos(err.line - 1, err.character - 1 + err.length),
              message: err.message,
              severity: 'error',
            }));
          },
        },
        extraKeys: {
          'Ctrl-Enter': () => this.evaluate(),
        },
      }
    );
    this.evaluate();

    this.eventBus.on('evaluate', () => this.evaluate());
  }

  getProgram() {
    return this.editor.getValue();
  }

  evaluate() {
    try {
      const program = this.editor.getValue();
      const result = interpret(program);
      if (result.errors.length < 1) {
        this.eventBus.emit('clear-error');
      } else {
        const errCount = result.errors.length;
        const msg = errCount === 1 ? '1 Error!' : `${errCount} Errors!`;
        this.eventBus.emit('display-error', new Error(msg));
      }
      console.log(result);
    } catch (err) {
      this.eventBus.emit('display-error', err);
    }
  }
}
