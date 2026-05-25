import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NAV/Navbar";
import './CSS/EyelashTypeSelector.css';

class Type {
    constructor(id, type, desc, image, price, duration, deposit) {
        this.id = id;
        this.type = type;
        this.desc = desc;
        this.image = image;
        this.price = price;
        this.duration = duration;
        this.deposit = deposit;
    }
}

const EYELASH_TYPES = [
    new Type(
        1,
        'Classique',
        "Un look naturel avec un cil synthétique par cil naturel.",
        '/photos/classic.jpeg',
        50,
        '2h',
        20
    ),

    new Type(
        2,
        'Volume',
        "Un style plus fourni grâce à plusieurs extensions sur un cil naturel.",
        '/photos/volume.jpeg',
        80,
        '4h',
        20
    ),

    new Type(
        3,
        'Hybride',
        "Un mélange de classique et volume pour un look équilibré.",
        '/photos/hybrid.jpeg',
        65,
        '3h',
        20
    ),

    new Type(
        4,
        'Mega Volume',
        "Un look très intense avec beaucoup de densité.",
        '/photos/classic.jpeg',
        95,
        '4h30',
        25
    ),

    new Type(
        5,
        'Wispy',
        "Effet texturé et aérien inspiré du style Kim K.",
        '/photos/volume.jpeg',
        85,
        '3h30',
        20
    ),

    new Type(
        6,
        'Fox Eyes',
        "Effet allongé pour un regard étiré.",
        '/photos/hybrid.jpeg',
        75,
        '3h',
        20
    ),
];




export default function EyelashTypeSelector({ onSelect }) {
    // const [hoveredType, setHoveredType] = useState(null);
    const navigate = useNavigate();
    const scrollRef = useRef();
    const isMobile = window.innerWidth <= 768;

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
                    {EYELASH_TYPES.map((lash) => (
                        <div
                            key={lash.id}
                            className="typeCard"
                            onClick={() => {
                                if (!isMobile) {
                                    navigate("/monthly-calendar",{state: lash});
                                }
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <img src={lash.image} alt={`${lash.type} extensions`} />

                            <h3>{lash.type}</h3>

                            <p className="desc">{lash.desc}</p>

                            <p className="details">
                                💰 {lash.price}$ | ⏱️ {lash.duration}
                            </p>

                            <p className="deposit">
                                🔐 Acompte requis : {lash.deposit}$
                            </p>

                            <button
                                className="select-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/monthly-calendar");
                                }}
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
