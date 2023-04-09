import CardItem from "./CardItem";
import { useEffect, useState } from 'react';

import "./ObituaryCards.css";

function ObituaryCards({ cardsData, activeGetRequest }) {


    const [currentAudio, setCurrentAudio] = useState(null);
    const [cards, setCards] = useState([]);

    //function to play audio
    const playAudio = (audio) => {
        console.log(currentAudio)
        if (currentAudio) {
            currentAudio.pause();
        }
        const playableAudio = new Audio(audio);
        playableAudio.play();
        setCurrentAudio(playableAudio);
    }


    //maps over the cardsData array and creates a new array of CardItem components
    useEffect(() => {
        const newCards = cardsData.map((card) => {
            return (<CardItem
              key={card.id}
              name={card.name}
              birthYear={card.birthYear}
              deathYear={card.deathYear}
              text={card.obituary_text}
              img={card.image_url}
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