# AR Treasure — Sacré Coeur

Aplicación web de realidad aumentada construida con A-Frame + AR.js para la actividad de búsqueda del tesoro. El objetivo es escanear tres marcadores impresos para completar la aventura.

## Requisitos

- Navegador compatible con WebXR/WebRTC (Chrome o Firefox actualizados).
- Conexión HTTPS al alojar la app (requisito del acceso a cámara).
- Cámara habilitada y marcadores impresos a color o en blanco y negro con buen contraste.

## Uso

1. Abre `index.html` desde un servidor web (por ejemplo `npx serve .`).
2. Concede permiso de cámara cuando el navegador lo solicite.
3. Imprime los tres marcadores oficiales de AR.js y escanéalos en el siguiente orden para seguir las pistas:

   | Marcador | Tipo | Imagen de referencia | Descripción |
   |----------|------|----------------------|-------------|
   | Hiro | `preset="hiro"` | ![Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/marker-training/examples/HIRO.jpg) | Punto de inicio. Activa la interfaz y muestra la primera pista. |
   | Kanji | `preset="kanji"` | ![Kanji](https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/marker-training/examples/kanji.jpg) | Llave mágica. Avanza la historia con nuevas pistas. |
   | Código #5 | `type="barcode" value="5"` | ![Código 5](https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/marker-barcode/markers/5.png) | Cofre del tesoro. Completa la misión y dispara la celebración final. |

4. Después de escanear los tres marcadores aparecerá un mensaje final con opción de reiniciar la experiencia.

## Desarrollo

- Toda la escena y la lógica del juego se encuentran ahora en `index.html` para simplificar la carga en dispositivos móviles.
- Los modelos AR se definen dentro de cada elemento `<a-marker>` utilizando los presets nativos de AR.js (Hiro y Kanji) y un marcador tipo código (valor 5).
- La lógica de UI, audio y celebración está escrita en JavaScript in-line al final del documento para garantizar que el navegador la ejecute una vez que se cargó la escena.

## Solución de problemas

- **No detecta los marcadores:** asegúrate de usar los patrones oficiales incluidos arriba y mantenerlos planos frente a la cámara, con buena iluminación.
- **Marcador de código no responde:** verifica que el entorno tenga suficiente luz y que el marcador esté impreso sin distorsiones. El modo `mono_and_matrix` ya está habilitado para detectar tanto patrones como códigos.
- **No se escucha el audio:** toca la pantalla cuando aparezca el mensaje "Toca la pantalla para activar el sonido" para desbloquear el contexto de audio del navegador.
- **Pantalla en negro:** verifica que el navegador tenga permiso de cámara y que estés sirviendo el sitio por HTTPS (necesario en la mayoría de dispositivos móviles).
