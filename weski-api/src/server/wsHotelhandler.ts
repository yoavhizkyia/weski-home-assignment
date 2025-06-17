import { Server } from "socket.io";
import { getHotelsBySize, getUniqueHotels } from "../controller/hotels/index.ts";
import { hotelSearchSchema } from "../models/searchSchema.ts";

const activeSearches = new Map<string, NodeJS.Timeout[]>();

export function setupHotelWebSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('startSearch', async (params: SearchFields) => {
      const { clientId, ski_site, from_date, to_date, group_size } = params;

      if (clientId && activeSearches.has(clientId)) {
        activeSearches.get(clientId)?.forEach(clearTimeout);
        activeSearches.delete(clientId);
      }

      const hotelMap = new Map<string, Hotel>();
      const timeouts: NodeJS.Timeout[] = [];

      const sizes = Array.from({ length: 10 - group_size + 1 }, (_, i) => group_size + i);

      sizes.forEach((size, index) => {
        const timeout = setTimeout(async () => {
          const parsed = hotelSearchSchema.parse({ ski_site, from_date, to_date, group_size: size });
          const results = await getHotelsBySize(parsed);
          const hotels = getUniqueHotels(hotelMap, results);

          socket.emit('hotelResults', hotels);

          if (clientId && index === sizes.length - 1) {
            socket.emit('done');
            activeSearches.delete(clientId);
          }
        }, index * 500);

        timeouts.push(timeout);
      });

      clientId && activeSearches.set(clientId, timeouts);
    });

    socket.on('disconnect', () => {
      activeSearches.forEach(timeouts => timeouts.forEach(clearTimeout));
      activeSearches.clear();
    });
  });
}