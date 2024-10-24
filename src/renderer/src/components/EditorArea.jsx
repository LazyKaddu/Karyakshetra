import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

import { io } from 'socket.io-client';

const EditorArea = ({ content }) => {
  
  const handleChange = (value) => {
    console.log(value);
    console.log(lang(content.name));
  }



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
    <Editor
      height="80vh"
      width="80vw"
      defaultLanguage="text"
      language={lang(content.name)}  // Set language dynamically
      theme="myCustomTheme"          // Apply the custom theme
      value={content.content}        // Content to display in the editor
      onChange={handleChange}        // Handle content change
      onMount={onEditorMount}        // Use onMount to define the theme
      className='border-b-[1px] border-[#6b98ab] border-l-[1px]'     
    />
  );
};

export default EditorArea;
