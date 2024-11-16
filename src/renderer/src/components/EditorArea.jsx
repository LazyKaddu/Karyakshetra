import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

import {io} from "socket.io-client"

const EditorArea = ({ content }) => {

  const socket = io('https://karyak.vercel.app/api/server');
  
  const [User, setUser] = useState('')
  const [Group, setGroup] = useState('')
  const [Content, setContent] = useState(content.content)

  useEffect(() => {
    setContent(content.content)
  }, [content])
  

  const joinWebSocketServer = (userId, groupId) => {
    socket.emit('joinGroup', { userId, groupId });
  };

  const handleChange = (value) => {
    setContent(value)
    console.log(lang(content.name));
    socket.emit('sendContent',{user:User,groupid:Group,Content:value,name:content.name})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    joinWebSocketServer(User, Group);
  }

  socket.on('deliveredContent',(data)=>{
    if(data.name == content.name){
      setContent(data.Content);
    }
  })


  const lang = (name) => {
    let split = name.split('.');
    const ext = split[split.length - 1];

    switch (ext) {
      case 'js':
      case 'jsx':
      case 'tsx':
        return 'javascript';
      case 'html':
        return 'html';
      case 'cpp':
        return 'cpp';
      case 'py':
        return 'python';
      case 'css':
        return 'css';
      default:
        return 'javascript';  // Default language
    }
  }

  const onEditorMount = (editor, monaco) => {
    // Define a custom theme
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark', // Use vs-dark as a base
      inherit: true,   // Inherit other default styles
      rules: [],       // No custom token styles
      colors: {
        'editor.background': '#101C20', // Custom background color
        'editor.foreground': '#879094', // Custom text color
      }
    });

    // Set the theme to the custom theme
    monaco.editor.setTheme('myCustomTheme');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='w-52 h-28 absolute p-2 flex flex-col bottom-24 right-5 z-10 gap-2 shadow-2xl shadow-black border-[3px] rounded-md border-black'>
        <input type="text" className='text-black outline-none px-2' value={User} onChange={(e) => setUser(e.target.value)} placeholder='enter user id'/>
        <input type="text" className='text-black outline-none px-2' value={Group} onChange={(e)=> setGroup(e.target.value)} placeholder='enter server id'/>
        <button type="submit">join</button>
      </form>
      <Editor
        height="80vh"
        width="80vw"
        defaultLanguage="text"
        language={lang(content.name)}  // Set language dynamically
        theme="myCustomTheme"          // Apply the custom theme
        value={Content}        // Content to display in the editor
        onChange={handleChange}        // Handle content change
        onMount={onEditorMount}        // Use onMount to define the theme
        className='border-b-[1px] border-[#6b98ab] border-l-[1px] resize-x'
      />
    </>
  );
};

export default EditorArea;
