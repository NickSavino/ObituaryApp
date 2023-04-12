import CardItem from "./CardItem";
import { useEffect, useState } from 'react';

import "./ObituaryCards.css";

function ObituaryCards({ cardsData, activeGetRequest }) {
    

    const [cards, setCards] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(new Audio());

      //function to play audio
      const playAudio = (event, audio) => {
        // Pause the current audio if it's playing
        event.stopPropagation();

        if (currentAudio) {
            currentAudio.pause();
        }
        if (currentAudio == null) {
            currentAudio = new Audio();
        }
        // Create a new audio object and play it
        currentAudio.src = audio;
        currentAudio.play();
        // Set the current audio to the new audio
        setCurrentAudio(currentAudio);
     
   }

    //maps over the cardsData array and creates a new array of CardItem components
    useEffect(() => {
        const newCards = cardsData.map((card) => {
            const updatedImg = card.image_url.replace("/upload/", "/upload/e_art:zorro/");
            return (<CardItem
              key={card.id}
              name={card.name}
              birthYear={card.birth_year}
              deathYear={card.death_year}
              text={card.obituary_text}
              img={updatedImg}
              audio={card.audio_url}
              playAudio={playAudio}
            />);
        });
        setCards(newCards);
    
    }, [cardsData]);


    

    return cards.length > 0 ? (
        <div className="obituary-cards">
            {cards}
        </div>
    ) : (
        <div className="no-obituary-cards">
            {activeGetRequest ? 
            <div id="fetch-bar-spinner" className="spinner"><div className="spinner-icon"></div></div>
             : 
            <p>No obituaries found</p>}
        </div>
    );
}

export default ObituaryCards;