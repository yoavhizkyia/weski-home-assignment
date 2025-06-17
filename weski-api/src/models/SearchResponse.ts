interface SearchResponse {
    HotelCode: string;
    HotelName: string;
    HotelInfo: {
        Rating: number | null;
    };
    PricesInfo: {
        AmountAfterTax: string;
    };
    HotelDescriptiveContent: {
        Images: Array<{
            MainImage: string;
            URL: string;
        }>;
    };
}