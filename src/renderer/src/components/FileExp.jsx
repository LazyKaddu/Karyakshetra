import React, { useState, useEffect } from 'react';
import { faArrowLeft, faSave, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const FileExplorer = ({setcontent}) => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('\\'); // Start with root
  const [optionOpened, setoptionOpened] = useState(false);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (dirPath) => {
    const fileData = await window.api.loadFiles(dirPath); // Using IPC to load files
    if (fileData.error) {
      console.error('Error loading files:', fileData.error);
    } else {
      setFiles(fileData);
    }
  };

  const handleDirectoryClick = (dirPath) => {
    setCurrentPath(dirPath);
  };
  const undoDir = ()=>{
    try{

        let pathsplit = currentPath.split('\\');
        if (pathsplit.length == 1){
            setCurrentPath('\\')
        }else{
            setCurrentPath(pathsplit.slice(0,-1).join('\\'))
        }
    }catch(err){
        console.log('error occured while undo file');
    }
  }

  const changeValue = async (file)=>{
    let data = await window.api.getContent(file.path);
    data = {...data,name: file.name}
    setcontent(data);
  }

  // implement these function and integrate to backend

  const openOption = ()=>{

  }

  const addFolder = ()=>{

  }

  const addFile = ()=>{

  }

  const openFolder = ()=>{

  }

  return (
    <div className="w-[20vw] h-[80vh] p-2 flex flex-col gap-2 border-b-[1px] border-[#6b98ab] resize-x">
      <h3 className="font-mono text-xl">Karyakshetra Files</h3>
      <div className='flex gap-4 relative'>
        <button onClick={undoDir} className='cursor-pointer'><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button onClick={undoDir} className='cursor-pointer'><FontAwesomeIcon icon={faSave} /></button>
        <button onClick={openOption} className='cursor-pointer'><FontAwesomeIcon icon={faFolderOpen} /></button>
        {optionOpened && <div className='flex flex-col items-start justify-evenly h-[10vh] w-[8vw] bg-[#d2d3d450] pl-2 rounded-sm absolute top-0 right-0 z-10 text-[1vw]'>
          <button onClick={openFolder}>open Folder</button>
          <button onClick={addFile}>add File</button>
          <button onClick={addFolder}>add Folder</button>
        </div>}
        
      </div>
      <ul className="overflow-y-scroll h-full bg-[#222F34] rounded Morphism p-2 overflow-x-hidden whitespace-nowrap">
        {files.map((file, index) => (
          <li
            key={index}
            className={''}
            onClick={() => file.isDirectory ? handleDirectoryClick(file.path) : changeValue(file)}
          >
            <span className='cursor-pointer'>{file.isDirectory ? '📁' : '⬜'}</span>
            <span className='cursor-pointer'>{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
