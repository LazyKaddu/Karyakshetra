// src/App.js
import React, { useState } from 'react';
import EditorArea from './components/EditorArea';
import FileExplorer from './components/FileExp';
import './assets/main.css';
import Navbar from './components/nav';
import TerminalComponent from './components/Terminal';

const App = () => {

  const [content, setcontent] = useState({
    name: "karyakshetra.txt",
    content: "welcome to karyakshetra",
  })

  return (
    <div className='flex flex-col'>
      <Navbar/>
      <div className='flex'>
        <FileExplorer setcontent={setcontent}  />
        <EditorArea content={content}/>
      </div>
      <TerminalComponent/>
    </div>
  );
};

export default App;
