const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// OpenFreeMap's default style shows the local script for place names (and
// sometimes stacks the Latin name above/below it). We want labels to stay in
// English everywhere, so any text-field expression that references a name
// field gets replaced with a straight name_en -> name fallback.
const toEnglishOnly = (textField) => {
  if (Array.isArray(textField) && JSON.stringify(textField).includes('"name')) {
    return ['coalesce', ['get', 'name_en'], ['get', 'name']];
  }
  return textField;
};

let cachedStyle = null;

export async function loadEnglishStyle() {
  if (cachedStyle) return cachedStyle;

  const res = await fetch(STYLE_URL);
  const style = await res.json();

  style.layers = style.layers.map((layer) => (
    layer.layout?.['text-field']
      ? { ...layer, layout: { ...layer.layout, 'text-field': toEnglishOnly(layer.layout['text-field']) } }
      : layer
  ));

  cachedStyle = style;
  return style;
}
