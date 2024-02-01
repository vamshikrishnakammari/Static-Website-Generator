'use client';
import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import GenerateFiles from './GenerateFiles';

const Draggable = () => {
  const [textStyle, setTextStyle] = useState('normal');
  const [textColor, setTextColor] = useState('black');
  const [textSize, setTextSize] = useState(14);
  const [isOpen, setIsOpen] = useState(false);
  const variants = {
    open: {
      transform: 'translateX(0px)',
      clipPath: 'circle(100% at 50% 50%)',
    },
    closed: {
      transform: 'translateX(-301px)',
      clipPath: 'circle(0% at 50% 50%)',
    },
  };


  const fileInput = useRef(null);

  const [imageSize, setImageSize] = useState(200);
  const [imageSizeIndicator, setImageSizeIndicator] = useState(200);


  const dragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
  };


  const allowDrop = (event) => {
    event.preventDefault();
  };


  const drop = (event) => {
    event.preventDefault(); 

    const data = event.dataTransfer.getData('text/plain');

    const element = document.getElementById(data);

    const clonedElement = element.cloneNode(true);

    const wrapper = document.createElement('div');

    Object.assign(wrapper.style, {
      position: 'absolute',


      left: `${event.clientX - event.target.getBoundingClientRect().left}px`,
      top: `${event.clientY - event.target.getBoundingClientRect().top}px`,
    });

    const closeButton = document.createElement('a');

    Object.assign(closeButton.style, {
      position: 'absolute',
      right: '-10px',
      top: '-10px',
      cursor: 'pointer',
    });

    closeButton.textContent = 'x';

    closeButton.onclick = (e) => {
      e.preventDefault();
      wrapper.remove();
    };

    wrapper.appendChild(closeButton);

    if (data === 'myImage') {

      clonedElement.textContent = '';

      const img = document.createElement('img');

      Object.assign(img, {
        src: '/clickHere.webp',
        width: imageSize,
        height: imageSize,


        onclick: () => {
          img.classList.add('active');
          fileInput.current.click();
        },
      });

      wrapper.appendChild(img);
    } else if (data === 'myText') {

      const paragraph = document.createElement('p');

      paragraph.textContent = 'Text';

      paragraph.style.fontWeight = textStyle === 'bold' ? 'bold' : 'normal';
      paragraph.style.fontStyle = textStyle === 'italic' ? 'italic' : 'normal';
      paragraph.style.color = textColor;
      paragraph.style.fontSize = `${textSize}px`;

      paragraph.contentEditable = 'true';

      wrapper.appendChild(paragraph);
    }


    event.target.appendChild(wrapper);
  };

  const handleFileChange = (event) => {

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {

      const img = document.querySelector('.active');

      img.src = reader.result;
      img.width = imageSize;
      img.height = imageSize;

      setImageSizeIndicator(imageSize);

      img.classList.remove('active');

      event.target.value = null;
    };

    reader.readAsDataURL(file);
  };


  const reattachEventListeners = () => {

    const wrappers = document.querySelectorAll('.queryDiv > div');

    wrappers.forEach((wrapper) => {

      const closeButton = wrapper.querySelector('a');

      const content = wrapper.querySelector('p, img');

      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.remove();
      });

      if (content.tagName.toLowerCase() === 'p') {
        content.contentEditable = 'true';
      } else {

        content.addEventListener('click', () => {
          content.classList.add('active');
          fileInput.current.click();
        });
      }
    });
  };

  useEffect(() => {
    const savedState = localStorage.getItem('websiteState');
    if (savedState) {
      document.querySelector('.queryDiv').innerHTML = savedState;
      reattachEventListeners();
    }
  }, []);


  const saveState = () => {
    const state = document.querySelector('.queryDiv').innerHTML;
    localStorage.setItem('websiteState', state);
    console.log('Website state saved.');
  };
  return (
    <>
      <div className="relative">
        <button
          className=" bg-yellow-500 rounded-[18px] right-0 py-2 px-10 z-[999]"
          onClick={saveState}
          style={{ position: 'absolute', top: '0', right: '0' }}
        >
          Save
        </button>
        <div className="absolute bg-yellow-500 rounded-[18px] right-40 py-2 px-10 z-[999]">
          <GenerateFiles />
        </div>
      </div>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex w-screen h-screen">
        <motion.div
          className="absolute top-0 overflow-hidden bottom-0 z-[10] gap-2 flex flex-col pt-3 bg-blue-800 w-[300px]"
          animate={isOpen ? 'open' : 'closed'}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-between items-center">
            <p
              className="bg-red-400 w-[100px] h-[40px] rounded-[4px] flex justify-center items-center cursor-grabbing"
              id="myImage"
              draggable="true"
              onDragStart={dragStart}
            >
              Image
            </p>{' '}
            <p
              className="bg-red-400 w-[100px] h-[40px] rounded-[4px] flex justify-center items-center cursor-grabbing"
              id="myText"
              draggable="true"
              onDragStart={dragStart}
            >
              Text
            </p>
          </div>
          <div className="flex flex-col">
            <div>
              <p className="text-[13px]">Image Size: {imageSizeIndicator}px</p>
              <input
                type="range"
                min="50"
                max="700"
                value={imageSize}
                onChange={(e) => {
                  setImageSize(e.target.value);
                  setImageSizeIndicator(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex gap-2">
                <p>Text Style:</p>
                <select
                  className="bg-red-900"
                  value={textStyle}
                  onChange={(e) => setTextStyle(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
              <label className="flex gap-1">
                <p>Text Color:</p>
                <select
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{
                    backgroundColor: textColor,
                    color:
                      textColor === 'black' ||
                      textColor === 'blue' ||
                      textColor === 'purple'
                        ? 'white'
                        : 'black',
                  }}
                >
                  <option
                    value="black"
                    style={{ backgroundColor: 'black', color: 'white' }}
                  >
                    Black
                  </option>
                  <option
                    value="red"
                    style={{ backgroundColor: 'red' }}
                  >
                    Red
                  </option>
                  <option
                    value="blue"
                    style={{ backgroundColor: 'blue', color: 'white' }}
                  >
                    Blue
                  </option>
                  <option
                    value="green"
                    style={{ backgroundColor: 'green' }}
                  >
                    Green
                  </option>
                  <option
                    value="yellow"
                    style={{ backgroundColor: 'yellow' }}
                  >
                    Yellow
                  </option>
                  <option
                    value="purple"
                    style={{ backgroundColor: 'purple', color: 'white' }}
                  >
                    Purple
                  </option>
                  <option
                    value="orange"
                    style={{ backgroundColor: 'orange' }}
                  >
                    Orange
                  </option>
                </select>
              </label>

              <label>
                Text Size: {textSize}px
                <input
                  type="range"
                  min="10"
                  max="72"
                  value={textSize}
                  onChange={(e) => setTextSize(e.target.value)}
                />
              </label>
            </div>
          </div>
        </motion.div>
        <button
          className="z-20 absolute left-0 top-80 break-words bg-red-600 rounded-[40px] py-4 px-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toolbar
        </button>

        <div
          className="flex-auto bg-green-900 relative flex justify-center items-center queryDiv"
          onDrop={drop}
          onDragOver={allowDrop}
        >
          Drag and Drop Here
        </div>
      </div>
    </>
  );
};

export default Draggable;
