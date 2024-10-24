import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const [Term, setTerm] = useState('')

  useEffect(() => {
    terminal.current = new Terminal();
    terminal.current.open(terminalRef.current);
    // console.log(terminal.current);
    // Create terminal instance
    window.api.createTerminal();
    
    terminal.current.onData((data)=>{
        terminal.current.write(data);
    })

    const outputHandeler = (data) => {
        terminal.current.write(data);
      }

    // Handle terminal output
    window.api.onTerminalOutput(outputHandeler);

    // Handle terminal error output
    window.api.onTerminalError((data) => {
      terminal.current.write(`\x1b[31m${data}\x1b[0m`); // Print errors in red
    });

    // Function to send input to the terminal
    terminal.current.onData((input) => {
      console.log(input)
      if(input != ""){
        setTerm(Term+input)
      }else{
        console.log(Term);
        window.api.sendTerminalInput(Term);
        setTerm("");
      }
    });

    // Handle terminal exit
    window.api.onTerminalExit((code) => {
      terminal.current.write(`\r\nTerminal exited with code: ${code}`);
    });

    return () => {
      // Cleanup on component unmount
      window.api.onTerminalOutput(null);
      window.api.onTerminalError(null);
      window.api.onTerminalExit(null);
    };
  }, []);

  return <div ref={terminalRef} style={{ height: '5vh', width: '100%' }} />;
};

export default TerminalComponent;
