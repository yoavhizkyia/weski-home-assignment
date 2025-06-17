import React from "react";
import { useAtomValue } from "jotai";
import { FaStar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import './HotelCard.scss';
import { Hotel } from "../../models/Hotel";
import { resortNameAtom } from "../../atoms/searchPayloadAtom";

const FALLBACK_IMAGE = '/fallback.jpg';
const PER_PERSON_TEXT = '/per person';

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
    const resortName = useAtomValue(resortNameAtom);
    const stars = Number(hotel.Rating);

    return (
        <div className='card'>
            <img
                className='image'
                src={hotel.MainImageUrl || FALLBACK_IMAGE}
                alt={hotel.HotelName}
            />

            <div className='info'>
                <div className='header'>
                    <h3 className='name'>{hotel.HotelName}</h3>
                    <div className='stars'>
                        {stars > 0
                            ? Array.from({ length: stars }, (_, i) => (
                                <FaStar key={i} className='star' />
                            ))
                            : 'N/A'}

                    </div>
                </div>

                <div className='location'>
                    <FaLocationDot />
                    <span>{resortName}</span>
                </div>
                <div className='divider' />
                <div className='price'>
                    £{hotel.Price.toFixed(0)} <span className='per'>{PER_PERSON_TEXT}</span>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;