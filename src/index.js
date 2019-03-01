import { Terminal, ITheme } from 'xterm';
import KeyCode from 'keycode-js';

import './xterm.css';
import './style.css';

function runFakeTerminal(term) {
  if (term._initialized) {
      return;
  }

  term._initialized = true;

  term.prompt = () => {
      term.write('\r\n$ ');
  };

  // term.writeln(banner)
  term.writeln('Welcome to Naveed\'s personal website!\n');
  term.writeln('What is your name?\n');
  term.writeln('Type some keys and then press enter:\n');
  term.prompt();

  term.on('key', function(key, ev) {
      const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === KeyCode.KEY_RETURN) {
          term.prompt();
      } else if (ev.keyCode === Keycode.KEY_BACK_SPACE) {
          // Do not delete the prompt
          if (term.x > 2) {
              term.write('\b \b');
          }
      } else if (printable) {
          term.write(key);
      }
  });

  term.on('paste', function(data) {
      term.write(data);
  });
}

let term = new Terminal({"theme": {"foreground": "#41FF00"}});
term.open(document.getElementById('terminal'));
runFakeTerminal(term);