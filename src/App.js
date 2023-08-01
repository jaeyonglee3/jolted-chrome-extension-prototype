import React, { useState } from 'react';
import openaiApi from './api';
import './App.css';

function App() {
  const [formValues, setFormValues] = useState({
    instructorIdentity: '',
    levelOfExpertise: '',
    areaOfInterest: '',
    transformationType: 'personalize',
  });

  const generateText = async (prompt) => {
    const response = await openaiApi.post('chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
  
    return response.data.choices[0].message.content;
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };
  
  function getHighlightedText() {
    let highlightedText = "";
    if (window.getSelection) {
      highlightedText = window.getSelection().toString();
    }
    return highlightedText;
  }
  
  // Send the highlighted text to the background script
  // chrome.runtime.sendMessage({ highlightedText: getHighlightedText() });
  // chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  //   if (message.highlightedText) {
  //     const highlightedText = message.highlightedText;
  //     console.log("Highlighted text:", highlightedText);
  //   }
  // });
  

  const handleButtonClick = async () => {
    console.log('button clicked')
    // This will only work in response to a user action (like a button click)
    // const highlightedText = await navigator.clipboard.readText();
    // console.log(highlightedText)
    
    // Example usage:
    const highlightedText = getHighlightedText();
    console.log("Highlighted text:", highlightedText);

    let prompt = '';
    const instructorIdentity = formValues.instructorIdentity || "professor of computer science";
    const levelOfExpertise = formValues.instructorIdentity || "high";
    const areaOfInterest = formValues.instructorIdentity || "theoretical computer science";
    
    switch(formValues.transformationType) {
      case 'personalize':
        prompt = `Transform the following text and maintain its length within -1/+1 paragraph. Assume it is educational material that you will now modify to be more personalized. Adjust the wording and examples, conceptual explanations and/or metaphors to be appropriate to the level of expertise provided which is ${formValues.levelOfExpertise}. Replace any explanations, usecases, examples, practice problems, or other components of the educational material to be appropriate for the area of interest which is ${formValues.areaOfInterest}. Phrase all wordings as if you were a ${formValues.instructorIdentity}. \n\n ${highlightedText}`;
        break;
      case 'simplify':
        prompt = `As a ${instructorIdentity} with a level of expertise of ${levelOfExpertise} and an area of interest in ${areaOfInterest}, simplify the following text while keeping the core ideas intact. Make it more understandable for a beginner. \n\n ${highlightedText}`;
        break;
      case 'concreteExample':
        prompt = `As a ${instructorIdentity} with a level of expertise of ${levelOfExpertise} and an area of interest in ${areaOfInterest}, provide a concrete example or real-life application of the concepts in the following text. \n\n ${highlightedText}`;
        break;
      case 'metaphoricalExplanation':
        prompt = `As a ${instructorIdentity} with a level of expertise of ${levelOfExpertise} and an area of interest in ${areaOfInterest}, provide a metaphorical explanation of the ideas in the following text. Make it creative and engaging. \n\n ${highlightedText}`;
        break;
      default:
        break;
    }

    const newText = await generateText(prompt);
    console.log(newText)

    // This will also only work in response to a user action
    if (formValues.transformationType === 'personalize') {
      document.execCommand('insertText', false, newText);
    } else {
      document.execCommand('insertText', false, `${highlightedText}\n\n${newText}`);
    }
  };

  return (
    <div className='popup'>
      <h1>JoltEd Prototype</h1>
      <body>

        <form>
          <div>
            <label>
              Transformation Type:
            </label>
            <label>
              <input
                type="radio"
                name="transformationType"
                value="personalize"
                checked={formValues.transformationType === 'personalize'}
                onChange={handleInputChange}
              />
              Personalize
            </label>
            <label>
              <input
                type="radio"
                name="transformationType"
                value="simplify"
                checked={formValues.transformationType === 'simplify'}
                onChange={handleInputChange}
              />
              Simplify
            </label>
            <label>
              <input
                type="radio"
                name="transformationType"
                value="concreteExample"
                checked={formValues.transformationType === 'concreteExample'}
                onChange={handleInputChange}
              />
              Give Concrete Example
            </label>
            <label>
              <input
                type="radio"
                name="transformationType"
                value="metaphoricalExplanation"
                checked={formValues.transformationType === 'metaphoricalExplanation'}
                onChange={handleInputChange}
              />
              Give Metaphorical Explanation
            </label>
          </div>
          <div>
            <label>
              Instructor Identity:
              <input
                type="text"
                name="instructorIdentity"
                value={formValues.instructorIdentity}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Level of Expertise:
              <input
                type="text"
                name="levelOfExpertise"
                value={formValues.levelOfExpertise}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Area of Interest:
              <input
                type="text"
                name="areaOfInterest"
                value={formValues.areaOfInterest}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </form>

        <button onClick={handleButtonClick}>
          Transform Highlighted Text
        </button>
      </body>
    </div>
  );
}

export default App;
