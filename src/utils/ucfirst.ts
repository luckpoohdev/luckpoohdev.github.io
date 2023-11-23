const ucfirst = (str) => str ? `${String(str).toUpperCase().slice(0, 1)}${String(str).slice(1)}` : null
export default ucfirst