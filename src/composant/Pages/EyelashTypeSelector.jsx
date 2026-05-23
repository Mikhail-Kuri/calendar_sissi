import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NAV/Navbar";

const EYELASH_TYPES = [
    {
        id:1,
        type: 'Classique',
        desc: "Un look naturel avec un cil synthétique par cil naturel.",
        image: '/photos/classic.jpeg',
        price: 50,
        duration: '2h',
        deposit: 20
    },
    {
        id:2,
        type: 'Volume',
        desc: "Un style plus fourni grâce à plusieurs extensions sur un cil naturel.",
        image: '/photos/volume.jpeg',
        price: 80,
        duration: '4h',
        deposit: 20
    },
    {
        id:3,
        type: 'Hybride',
        desc: "Un mélange de classique et volume pour un look équilibré.",
        image: '/photos/hybrid.jpeg',
        price: 65,
        duration: '3h',
        deposit: 20
    },
      {
        id:4,
        type: 'Classique',
        desc: "Un look naturel avec un cil synthétique par cil naturel.",
        image: '/photos/classic.jpeg',
        price: 50,
        duration: '2h',
        deposit: 20
    },
    {
        id:5,
        type: 'Volume',
        desc: "Un style plus fourni grâce à plusieurs extensions sur un cil naturel.",
        image: '/photos/volume.jpeg',
        price: 80,
        duration: '4h',
        deposit: 20
    },
    {
        id:6,
        type: 'Hybride',
        desc: "Un mélange de classique et volume pour un look équilibré.",
        image: '/photos/hybrid.jpeg',
        price: 65,
        duration: '3h',
        deposit: 20
    },


];


export default function EyelashTypeSelector({ onSelect }) {
    // const [hoveredType, setHoveredType] = useState(null);
    const navigate = useNavigate();
    const scrollRef = useRef();

    const scroll = (direction) => {
        const scrollAmount = 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="eyelashSelectWrapper">
                <h2 className="title">Choisissez votre type d'extensions de cils</h2>
                <p className="subtitle">Avant de continuer, sélectionnez le type qui vous convient</p>

                <div className="carousel-container">
                    <button className="scroll-btn left" onClick={() => scroll('left')}>◀</button>

                    <div className="typeList horizontal-scroll" ref={scrollRef}>
                        {EYELASH_TYPES.map(({ id,type, desc, image, price, duration, deposit }) => (
                            <div
                                key={id}
                                className="typeCard"
                                onClick={() => navigate("/monthly-calendar")}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={image} alt={`${type} extensions`}/>
                                <h3>{type}</h3>

                                <p className="desc">{desc}</p>
                                <p className="details">💰 {price}$ | ⏱️ {duration}</p>
                                <p className="deposit">🔐 Acompte requis : {deposit}$</p>

                                <button
                                    className="select-btn"
                                    onClick={() => navigate("/monthly-calendar")}
                                >
                                    Sélectionner
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="scroll-btn right" onClick={() => scroll('right')}>▶</button>
                </div>
            </div>
        </div>
    );
}
