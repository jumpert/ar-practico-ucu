# AR Treasure — Sacré Coeur

Aplicación web de realidad aumentada construida con A-Frame + AR.js para la actividad de búsqueda del tesoro. El objetivo es escanear tres marcadores impresos para completar la aventura.

## Requisitos

- Navegador compatible con WebXR/WebRTC (Chrome o Firefox actualizados).
- Conexión HTTPS al alojar la app (requisito del acceso a cámara).
- Cámara habilitada y marcadores impresos a color o en blanco y negro con buen contraste.

## Uso

1. Abre `index.html` desde un servidor web (por ejemplo `npx serve .`).
2. Concede permiso de cámara cuando el navegador lo solicite.
3. Escanea los marcadores en el siguiente orden para seguir las pistas:

   | Marcador | Archivo patrón | Archivo para imprimir | Descripción |
   |----------|----------------|-----------------------|-------------|
   | marker-1 | `assets/patt/marker1.patt` | `assets/markers/marker1.svg` | Punto de inicio. Activa la interfaz y muestra la primera pista. |
   | marker-2 | `assets/patt/marker2.patt` | `assets/markers/marker2.svg` | Llave mágica. Avanza la historia con nuevas pistas. |
   | marker-3 | `assets/patt/marker3.patt` | `assets/markers/marker3.svg` | Cofre del tesoro. Completa la misión y dispara la celebración final. |

4. Después de escanear los tres marcadores aparecerá un mensaje final con opción de reiniciar la experiencia.

## Desarrollo

- El código principal de la lógica del juego está en `js/game.js`.
- Los modelos AR se definen en `index.html` dentro de cada elemento `<a-marker>`.
- Los marcadores están disponibles como patrones (`.patt`) en `assets/patt` y como imágenes vectoriales (`.svg`) en `assets/markers`.

## Solución de problemas

- **No detecta los marcadores:** asegúrate de usar los patrones proporcionados y mantenerlos planos frente a la cámara, con buena iluminación.
- **No se escucha el audio:** toca la pantalla cuando aparezca el mensaje "Toca la pantalla para activar el sonido" para desbloquear el contexto de audio del navegador.
- **Pantalla en negro:** verifica que el navegador tenga permiso de cámara y que estés sirviendo el sitio por HTTPS (necesario en la mayoría de dispositivos móviles).
