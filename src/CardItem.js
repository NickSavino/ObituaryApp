import './CardItem.css'

function CardItem({ title, text, img, link}) {
    return (
        <div className="card">
            <img src={img} alt="random" />
            <h2>{title}</h2>
            <p>{text}</p>
            <a className="play-audio"><i class="fas fa-play"></i></a>
        </div>
    );
}

export default CardItem;