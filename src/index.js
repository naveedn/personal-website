import { Terminal } from 'xterm';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as fit from 'xterm/lib/addons/fit/fit';

import KeyCode  from 'keycode-js';

import './xterm.css';
import './style.css';


function process(term, input) {
  if (!term._introduced) {
    term.writeln("");
    term.writeln(`Hello, ${input}!`)
    term._introduced = true;
    printHelp(term)
  }
  else if (input.includes('help') || input == ('?')) {
    printHelp(term)
  }
  else if (input.includes('clear')) {
    term.reset()
  }
  else if (input.includes('exit')) {
    console.log('exitings')
    window.close()
  }
}

function repl(term) { 
  let buffer = ""

  term.on('key', function(key, ev) {
    const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.keyCode === KeyCode.KEY_RETURN) {
      process(term, buffer)
      buffer = ""
      term.prompt();
    } else if (ev.keyCode === KeyCode.KEY_BACK_SPACE) {
        // Do not delete the prompt
        if (term.x > 2) {
          term.write('\b \b');
          buffer = buffer.slice(0,-1)
        }
    } else if (printable) {
        buffer += key
        term.write(key);
    }
  });

  term.on('paste', function(data) {
    term.write(data);
  });
}

function printHelp(term) {
  term.writeln('');
  term.writeln('If you get need help, simply type in "help" or "?" into the prompt \n');
  term.writeln('Commands:\n');
  term.writeln('  help: will display this help prompt')
  term.writeln('  clear: will clear the entire terminal screen');
  term.writeln('  exit: will close this tab')
}


function printIntro(term) {
  term.writeln('Welcome to Naveed\'s personal website! (still under construction)\n');
  term.writeln('What is your name?\n');
  term.writeln('Type some keys and then press enter:\n');
  term.prompt();
}

function runFakeTerminal(term) {
  if (term._initialized) {
      return;
  }

  term._initialized = true;
  term._introduced = false;

  term.prompt = () => {
      term.write('\r\n$ ');
  };

  printIntro(term)
  repl(term)

}

function initFakeTerminal() {
  Terminal.applyAddon(fit);  // Apply the `fit` addon
  Terminal.applyAddon(fullscreen);  // Apply the `fullscreen` addon

  let term = new Terminal({ "theme": { "foreground": "#41FF00" }, "cols": 120 });
  term.open(document.getElementById('terminal'));

  term.toggleFullScreen();  // Now the terminal should occupy the full viewport
  term.fit();  // Make the terminal's size and geometry fit the size of #terminal container

  return term
}
runFakeTerminal(initFakeTerminal());