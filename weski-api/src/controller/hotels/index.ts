import axios from 'axios';

const API_URL = 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';

export async function getHotelsBySize(params: SearchFields): Promise<SearchResponse[]> {
    try {
        // Uncomment the following lines to simulate a delay for testing purposes
        // const delay = Math.floor(Math.random() * (1000 - 3000 + 1)) + 3000;
        // await new Promise(resolve => setTimeout(resolve, delay));
        const response = await axios.post(API_URL, { query: params });
        return response.data?.body?.accommodations || [];
    } catch (err) {
        console.error('Failed to fetch hotels for the size: ', params.group_size);
        return [];
    }
}

export function getUniqueHotels(
    hotelMap: Map<string, Hotel>,
    newHotels: SearchResponse[]
): Hotel[] {
    for (const hotel of newHotels) {
        const key = hotel.HotelCode;
        if (!key) continue;

        const priceStr = hotel?.PricesInfo?.AmountAfterTax ?? '';
        const price = parseFloat(priceStr);
        if (isNaN(price)) continue;

        const existing = hotelMap.get(key);

        if (!existing) {
            const images = hotel.HotelDescriptiveContent?.Images ?? [];
            const mainImage =
                images.find((img) => img.MainImage === 'True')?.URL ||
                images[0]?.URL ||
                null;

            hotelMap.set(key, {
                HotelCode: key,
                HotelName: hotel.HotelName ?? 'Unnamed',
                Rating: hotel.HotelInfo?.Rating ?? null,
                Price: price,
                MainImageUrl: mainImage,
            });
        }
    }

    return [...hotelMap.values()].sort((a, b) => a.Price - b.Price);
}

