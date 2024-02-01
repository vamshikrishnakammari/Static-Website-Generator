import React from 'react';

const GenerateFiles = () => {
  const generateFiles = () => {

    const elements = document.querySelector('.queryDiv').children;

    const queryDivStyle = window.getComputedStyle(
      document.querySelector('.queryDiv')
    );

    // Generate HTML
    let html =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Document</title>\n</head>\n';
    html += `<body style="background-color: ${queryDivStyle.backgroundColor};">\n`;
    for (let i = 0; i < elements.length; i++) {

      const clonedElement = elements[i].cloneNode(true);

      const closeButton = clonedElement.querySelector('a');
      if (closeButton) {
        closeButton.remove();
      }
      html += clonedElement.outerHTML;
    }
    html += '\n</body>\n</html>';

    const htmlBlob = new Blob([html], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    // Create download link
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'website.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
  };

  return <button onClick={generateFiles}>Generate HTML Files</button>;
};

export default GenerateFiles;
