import CardItem from "./CardItem";
import { useEffect, useState } from 'react';

import "./ObituaryCards.css";

function ObituaryCards({ cardsData }) {


    const [currentAudio, setCurrentAudio] = useState(null);

    const [cards, setCards] = useState([]);

    const playAudio = (audio) => {

        if (currentAudio) {
            currentAudio.pause();
        }


        const playableAudio = new Audio(audio);
        playableAudio.play();
        setCurrentAudio(playableAudio);
    }

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
            <p>No Obituaries Yet</p>
        </div>
    );
}

export default ObituaryCards;