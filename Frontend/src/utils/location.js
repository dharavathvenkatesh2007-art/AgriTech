/**
 * Utility to normalize location objects and string representations.
 * Prevents duplicate administrative names like "Mahabubabad, Mahabubabad, Telangana" -> "Mahabubabad, Telangana"
 * while preserving city, district, state, and lat/lon properties.
 */

export function normalizeLocation(input) {
  if (!input) {
    return {
      city: 'Mahabubabad',
      district: 'Mahabubabad',
      state: 'Telangana',
      country: 'India',
      displayName: 'Mahabubabad, Telangana',
      latitude: 17.5976,
      longitude: 80.0034
    };
  }

  let city = '';
  let district = '';
  let state = '';
  let country = 'India';
  let latitude = null;
  let longitude = null;

  if (typeof input === 'string') {
    const rawParts = input.split(',').map(s => s.trim()).filter(Boolean);
    // De-duplicate administrative names
    const parts = rawParts.filter((item, index) => rawParts.indexOf(item) === index);

    if (parts.length === 1) {
      city = parts[0];
      district = parts[0];
      state = 'Telangana';
    } else if (parts.length === 2) {
      city = parts[0];
      district = parts[0];
      state = parts[1];
    } else if (parts.length >= 3) {
      city = parts[0];
      district = parts[1];
      state = parts[2];
      if (parts[3]) country = parts[3];
    }
  } else if (typeof input === 'object') {
    city = input.city || input.village || input.name || '';
    district = input.district || city || '';
    state = input.state || 'Telangana';
    country = input.country || 'India';
    latitude = input.latitude !== undefined ? Number(input.latitude) : (input.lat !== undefined ? Number(input.lat) : null);
    longitude = input.longitude !== undefined ? Number(input.longitude) : (input.lon !== undefined ? Number(input.lon) : null);
  }

  // Build clean display name: e.g. "Mahabubabad, Telangana"
  const displayParts = [];
  if (city) displayParts.push(city);
  if (district && district.toLowerCase() !== city.toLowerCase()) {
    displayParts.push(district);
  }
  if (state) displayParts.push(state);

  const displayName = displayParts.join(', ') || 'Mahabubabad, Telangana';

  // Coordinates fallback if null
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    if (state.toLowerCase().includes('andhra')) {
      latitude = 16.5062;
      longitude = 80.6480;
    } else {
      // Default to Mahabubabad / Telangana center
      latitude = 17.5976;
      longitude = 80.0034;
    }
  }

  return {
    city: city || 'Mahabubabad',
    district: district || 'Mahabubabad',
    state: state || 'Telangana',
    country: country || 'India',
    displayName,
    latitude,
    longitude
  };
}
