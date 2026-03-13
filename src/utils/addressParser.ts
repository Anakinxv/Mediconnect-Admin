export interface ParsedDominicanAddress {
  direccion: string;
  municipio: string;
  provincia: string;
}

export async function ParseDominicanAddress(
  lat: number,
  lng: number,
): Promise<ParsedDominicanAddress> {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=es&country=DO`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      return { direccion: "", municipio: "", provincia: "" };
    }

    // Buscar los componentes relevantes
    let direccion = "";
    let municipio = "";
    let provincia = "";

    for (const feature of data.features) {
      if (feature.place_type.includes("address") && !direccion) {
        direccion = feature.text;
      }
      if (feature.place_type.includes("place") && !municipio) {
        municipio = feature.text;
      }
      if (feature.place_type.includes("region") && !provincia) {
        provincia = feature.text;
      }
    }

    // Si no hay address, usar el primero como dirección
    if (!direccion && data.features[0]) {
      direccion = data.features[0].text;
    }

    return { direccion, municipio, provincia };
  } catch {
    return { direccion: "", municipio: "", provincia: "" };
  }
}
