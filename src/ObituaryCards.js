import CardItem from "./CardItem";

import { useState } from 'react';


function ObituaryCards({ cardsData }) {

    const image_url = "https://res.cloudinary.com/dxm6a1io9/image/upload/v1680987913/nodp5ypk8ozfnyowqrfk.jpg"
    const audio_url = "https://res.cloudinary.com/dxm6a1io9/video/upload/v1680987912/p3jpzvheqk5y33esmxyu.mp3"
    const text = "DESMOND O'BRIEN, Second Era Grand Wizard, was born on April 12, 2023 at 5:55 AM, and died on April 11, 2023 at 5:55 AM. Desmond was a brilliant wizard who dedicated his life to the pursuit of knowledge and understanding. He was a mentor to many, and will be greatly missed."

    const [currentAudio, setCurrentAudio] = useState(null);


    const playAudio = (audio) => {

        if (currentAudio) {
            currentAudio.pause();
        }


        const playableAudio = new Audio(audio);
        playableAudio.play();
        setCurrentAudio(playableAudio);
    }

    const cards = cardsData.map((card) => (
        <CardItem
          key={card.id}
          title={card.title}
          text={card.text}
          img={card.image_url}
          audio={card.audio_url}
          playAudio={playAudio}
        />
      ));
    

    cards.push(<CardItem title={"Desmond O'brien, Second Era Grand Wizard"} text={text} img={image_url} audio={audio_url} playAudio={playAudio}></CardItem>)


    

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