import { Server } from "socket.io";
import { getHotelsBySize, getUniqueHotels } from "../controller/hotels/index.ts";
import { hotelSearchSchema } from "../models/searchSchema.ts";

const activeSearches = new Map<string, AbortController>();

export function setupHotelWebSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('startSearch', async (params: SearchFields) => {
      const { clientId, ski_site, from_date, to_date, group_size } = params;
      if (!clientId) return;

      if (activeSearches.has(clientId)) {
        activeSearches.get(clientId)?.abort();
        activeSearches.delete(clientId);
      }

      const controller = new AbortController();
      const { signal } = controller;
      activeSearches.set(clientId, controller);

      const hotelMap = new Map<string, Hotel>();
      const sizes = Array.from({ length: 10 - group_size + 1 }, (_, i) => group_size + i);

      try {
        const promises = sizes.map(async size => {
          if (signal.aborted) return;

          const parsed = hotelSearchSchema.parse({
            ski_site,
            from_date,
            to_date,
            group_size: size,
          });

          const results = await getHotelsBySize(parsed);
          if (signal.aborted) return;

          const hotels = getUniqueHotels(hotelMap, results);
          socket.emit('hotelResults', hotels);
        });

        await Promise.all(promises);

        if (!signal.aborted) {
          socket.emit('done');
        }
      } catch (err: any) {
        if (!signal.aborted) {
          console.error("Search error:", err);
          socket.emit('error', { message: err?.message || 'Unknown error' });
        }
      } finally {
        activeSearches.delete(clientId);
      }
    });

    socket.on('disconnect', () => {
      activeSearches.forEach(controller => controller.abort());
      activeSearches.clear();
    });
  });
}
