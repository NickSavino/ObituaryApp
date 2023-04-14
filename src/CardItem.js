import { useState } from 'react';
import './CardItem.css'


function CardItem({ name,  birthYear, deathYear, text, img, audio, playAudio, isOpen }) {

    const [isExpanded, setIsExpanded] = useState(isOpen);


    return (
        <div className="card" onClick={() => setIsExpanded(!isExpanded)}>
            <div className='image-container'>
                <img className='vignette' src={img} alt="random" />
            </div>
            <h2>{name}</h2>
            <h3>Born: {birthYear}</h3>
            <h3>Died: {deathYear}</h3>
            <div className={`card-text ${isExpanded ? "expanded" : ""}`}>
                <p>{text}</p>
            </div>
            <button className="play-audio" onClick={(event) => playAudio(event, audio)}>
                <img src='./images/playsolid.svg'/>
            </button>
        </div>
    );
}

export default CardItem;