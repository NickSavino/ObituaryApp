import CardItem from "./CardItem";



function ObituaryCards({ cards }) {
    return cards.length > 0 ? (
        <div className="obituary-cards">
            {cards.map((card) => (
                console.log(card)
            ))}
        </div>
    ) : (
        <div className="no-obituary-cards">
            <p>No Obituaries Yet</p>
        </div>
    );
}

export default ObituaryCards;