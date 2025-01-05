import { APIError, ErrCode, api } from "encore.dev/api";
import { secret } from "encore.dev/config";

interface Photo {
  src: {
    medium: string;
    landscape: string;
  };
  alt: string;
}

interface SearchPhotoResponse {
  photos: Photo[];
}

interface SearchPhotoProps {
  query: string;
}

const pexelsApiKey = secret("PexelsApiKey");

export const searchPhoto = api(
  { expose: true, method: "GET", path: "/images/:query" },
  async ({ query }: SearchPhotoProps): Promise<SearchPhotoResponse> => {
    const URL = `https://api.pexels.com/v1/search?query=${query}`;
    const response = await fetch(URL, {
      headers: {
        Authorization: pexelsApiKey(),
      },
    });

    if (response.status >= 400) {
      throw new APIError(
        ErrCode.Internal,
        `pexels API error: ${response.status}`,
      );
    }

    const json = await response.json();
    console.log("XXX", json);

    return json as SearchPhotoResponse;
  },
);
