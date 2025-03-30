// Artsy API response types

// Common interfaces
interface Link {
  href: string;
}

interface TemplatedLink extends Link {
  templated: boolean;
}

// Gene interfaces
interface GeneLinks {
  thumbnail: Link;
  image: TemplatedLink;
  self: Link;
  permalink: Link;
  artworks: Link;
  published_artworks: Link;
  artists: Link;
}

export interface GeneResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  display_name: string | null;
  description: string | null;
  image_versions: string[];
  _links: GeneLinks;
}

// Artist interfaces
interface ArtistLinks {
  thumbnail: Link;
  image: TemplatedLink;
  self: Link;
  permalink: Link;
  artworks: Link;
  published_artworks: Link;
  similar_artists: Link;
  similar_contemporary_artists: Link;
  genes: Link;
}

export interface ArtistResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  sortable_name: string | null;
  gender: string | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  hometown: string | null;
  location: string | null;
  nationality: string | null;
  target_supply: boolean;
  image_versions: string[];
  _links: ArtistLinks;
}

// ArtistsByGene interfaces
export interface ArtistsByGeneResponse {
  total_count: number | null;
  _links: {
    self: Link;
    next: Link;
  };
  _embedded: {
    artists: ArtistResponse[];
  };
}

// For sharing between services
export interface ArtsyData {
  gene: GeneResponse;
  artist: ArtistResponse;
}
