export async function loadPersona() {
  const res = await fetch('/persona.txt')
  return await res.text()
}
