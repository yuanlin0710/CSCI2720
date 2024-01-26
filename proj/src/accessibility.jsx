// to revise: when changing the display of table, need to change the speak function

import React, { useEffect } from 'react';
import {useState} from 'react';
import { useLocation } from 'react-router-dom';

const SpeechContent = ({locs, coms, eves}) => {
  const location = useLocation();

  const [isSpeaking, setIsSpeaking] = useState(false); // State to manage speaking

  // Toggle speaking state
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  // Function to activate speaking
  const activateSpeaking = () => {
    setIsSpeaking(true);
  };

  // Function to deactivate speaking
  const deactivateSpeaking = () => {
    setIsSpeaking(false);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  // using the Web Speech API
  const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
  };


  const readTableContent = (locations) => {
    if(locations){
      let contentToSpeak = 'Locations table contains the following data: ';
    locations.forEach(location => {
    contentToSpeak += `Location ${location.id}, `;
    contentToSpeak += `${location.name}, `;
    contentToSpeak += `Events Count: ${location.eventsCount}.  `;
    contentToSpeak += ` .  `;
    });
    speak(contentToSpeak);
  }
  else{
    speak("The location table is empty.");
  }
  
  };


  const readFav = (locations) => {
    if(locations){
      let contentToSpeak = 'Favorite locations include: ';
      locations.forEach(location => {
        contentToSpeak += `Location ${location.id}, `;
        contentToSpeak += `${location.name}, `;
        contentToSpeak += ` .  `;
      });
      speak(contentToSpeak);
      }
      else{
        speak("You do not have favorite location. Try to add some.");
      }
    }
    
    





  const readSingleLoc = (location) => {

    if(location){
      let contentToSpeak = 'Location details contain the following data: ';
    
      contentToSpeak += `Location ${location.venueId}, `;
      contentToSpeak += `${location.name}, `;
      contentToSpeak += ` .  `;

    speak(contentToSpeak);

    }
    else{
      speak("The location details are not available now.");
    }
    



    };

  const readcomment = (comments) => {

    if(comments){
      let contentToSpeak = 'Comments contain the following data: ';
    comments.forEach(comment => {
      contentToSpeak += `User Name: ${comment.username}, `;
      contentToSpeak += `Comment Content: ${comment.comment}, `;
      contentToSpeak += ` .  `;
    });
    speak(contentToSpeak);

    }
    else{
      speak("There is no comment on this page. Do you want to add one?");
    }

    



    };
  

  const readEvent = (events) => {

    if(events){
      let contentToSpeak = 'Event table contains the following data: ';
      events.forEach(event => {
        contentToSpeak += `Event title: ${event.title}, `;
        contentToSpeak += `Event date: ${event.date}. `;
        contentToSpeak += `Event price: ${event.price}. `;
        contentToSpeak += ` .  `;
      });
      speak(contentToSpeak);
    }
    else{
      speak("Event table contains no event.");
    }

      



    };



  useEffect(() => {
    if (!isSpeaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const speakOut = (content) => {
      // Assuming you have a speech API function called speak that takes a string
      speak(content);
    };

    switch (location.pathname) {
      case '/UserPage/favorites':
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        speakOut("You are on the favorites Page");
        readFav(locs);
        break;
      //case location.pathname.match(/^\/locations\/\d+$/)?.input:
      //  speakOut("You are on a Location Details Page");
      //  break;
      case '/UserPage':
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        speakOut("You are on the User Page");
        break;
      case '/UserPage/locations':
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        speakOut("You are on the Location Page");
        readTableContent(locs);
        break;
      default:
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        if (location.pathname.match(/^\/UserPage\/locations\/\d+$/)) {
          speakOut("You are on a Location Details Page");
          readSingleLoc(locs);
          readEvent(eves);
          readcomment(coms);
          
        } 
        break;
    }
  }, [location, locs, coms, eves, isSpeaking]);

/*
const handleScroll = () => {

};

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
*/

// Keyboard event listener for shift+a to turn on and shift+q to turn off accessibility
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'A') {
      event.preventDefault(); 
      activateSpeaking();
    } else if (event.shiftKey && event.key === 'Q') {
      event.preventDefault();
      deactivateSpeaking();
    }
  };

  // add event listener when component mount
  window.addEventListener('keydown', handleKeyDown);

  // remove event listener when component unmount
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []); 

// Button to toggle speech
return (
  <>
    <button onClick={toggleSpeaking} style={{ position: 'fixed', bottom: '10px', right: '0', transform: 'translateY(-50%)', zIndex: 1000 }}>
      {isSpeaking ? 'Accessibility (reader): on' : 'Accessibility (reader): off'}
    </button>
  </>
);
};

export default SpeechContent;

