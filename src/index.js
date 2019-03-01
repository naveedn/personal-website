import { Terminal } from 'xterm';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as fit from 'xterm/lib/addons/fit/fit';

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

function initFakeTerminal() {
  Terminal.applyAddon(fit);  // Apply the `fit` addon
  Terminal.applyAddon(fullscreen);  // Apply the `fullscreen` addon

  let term = new Terminal({ "theme": { "foreground": "#41FF00" }, "cols": 120 });
  term.open(document.getElementById('terminal'));

  term.toggleFullScreen();  // Now the terminal should occupy the full viewport
  term.fit();  // Make the terminal's size and geometry fit the size of #terminal-container

  return term
}
runFakeTerminal(initFakeTerminal());