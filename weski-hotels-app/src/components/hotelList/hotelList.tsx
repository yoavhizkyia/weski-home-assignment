import React from 'react';
import { useAtomValue } from 'jotai';

import './hotelList.scss';
import HotelCard from './hotelCard';
import { resortNameAtom, searchPayloadAtom } from '../../atoms/searchPayloadAtom';
import { useHotelWS } from '../../hooks/useWsHotels';
import dayjs from 'dayjs';

const HEADING = `Select your ski trip`;
const ERROR_MESSAGE = 'Error fetching hotels. Please try again later.';

const HotelList: React.FC = () => {
    const searchPayload = useAtomValue(searchPayloadAtom)
    const resortName = useAtomValue(resortNameAtom)

    const { hotels, isError } = useHotelWS(searchPayload);

    if (!searchPayload) return <></>;

    if (isError && hotels.length === 0) {
        return (
            <div className='message error'>
                <h2>{ERROR_MESSAGE}</h2>
            </div>
        );
    }

    const dateRange = `${dayjs(searchPayload.from_date).format('MM/DD/YYYY')} - ${dayjs(searchPayload.to_date).format('MM/DD/YYYY')}`;

    const subheading = searchPayload
        ? [
            `${hotels.length} ski trip options`,
            resortName,
            dateRange,
            `${searchPayload.group_size} people`,
        ].join(' • ')
        : '';

    return (
        <div className='wrapper'>
            <div className='headingBlock'>
                <h2 className='title'>{HEADING}</h2>
                <p className='sub'>{subheading}</p>
            </div>
            <div className='grid'>
                {hotels.map(hotel => <HotelCard key={hotel.HotelCode} hotel={hotel} />)}
            </div>
        </div>
    );
}

export default HotelList;