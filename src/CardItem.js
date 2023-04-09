import './CardItem.css'


function CardItem({ name,  birthYear, deathYear, text, img, audio, playAudio}) {

    return (
        <div className="card">
            <img src={img} alt="random" />
            <h2>{name}</h2>
            <h3>{birthYear}</h3>
            <h3>{deathYear}</h3>
            <p>{text}</p>
            <button className="play-audio" onClick={() => playAudio(audio)}>
                <img src='./images/playsolid.svg'/>
            </button>
        </div>
    );
}

export default CardItem;