import './CardItem.css'


function CardItem({ title, text, date, img, audio, playAudio}) {




    return (
        <div className="card">
            <img src={img} alt="random" />
            <h2>{title}</h2>
            <p>{text}</p>
            <button className="play-audio" onClick={() => playAudio(audio)}>Play Audio</button>
        </div>
    );
}

export default CardItem;