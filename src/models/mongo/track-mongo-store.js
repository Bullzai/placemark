import { Track } from "./track.js";

export const trackMongoStore = {
  async getTracksByCategoryId(id) {
    const tracks = await Track.find({ categoryid: id }).lean();
    return tracks;
  },
};
