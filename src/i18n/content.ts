export type Lang = 'es' | 'en';

export const links = {
  email: 'cihenriquez@uc.cl',
  linkedin: 'https://www.linkedin.com/in/cihenriquez',
  github: 'https://github.com/cihenriquez',
  tekknight: 'https://tekknight.io',
  tiktok: 'https://www.tiktok.com/@tekknighttools',
  instagram: 'https://www.instagram.com/tekknighttools/',
};

const tkLinks = [
  ['tekknight.io', links.tekknight],
  ['TikTok', links.tiktok],
  ['Instagram', links.instagram],
];

const img2 = (f: string) => `/projects/tesis/${f}`;
const DOI = 'https://doi.org/10.7764/tesisUC/ING/110283';
const img3 = (f: string) => `/projects/iron-impact/${f}`;
const img = (f: string) => `/projects/thegame/${f}`;
const img4 = (f: string) => `/projects/purificador/${f}`;
const img5 = (f: string) => `/projects/estabilizador/${f}`;
const img6 = (f: string) => `/projects/posicionador/${f}`;
const GIMBAL_VIDEO = 'Rixvificvl4';

export const content = {
  es: {
    htmlLang: 'es',
    siteTitle: 'Cristian Henríquez · Portafolio de hardware y firmware',
    description: 'Portafolio de Cristian Henríquez: electrónica, firmware y robótica.',
    name: 'Cristian Henríquez',
    intro: 'Diseño electrónica y firmware para robots y dispositivos embebidos, desde el esquemático hasta el producto.',
    projectsTitle: 'Proyectos',
    viewProject: 'Ver proyecto',
    otherProjectsTitle: 'Otros proyectos',
    projects: [
      {
        title: 'Tarjeta de control para un equipo de purificación de aire',
        summary: 'Rediseño completo de la tarjeta de control de un equipo de purificación de aire: hardware y firmware nuevos, pensados para que un técnico pueda instalarla, configurarla, diagnosticarla y actualizarla en terreno. Se entregaron 20 kits, que quedaron en pruebas en Chile y México.',
        tags: ['PIC18F2550', 'C', 'EAGLE', 'UART', 'Bootloader USB'],
        image: img4('layout.jpg'),
        imageAlt: 'Render del layout de la tarjeta con el microcontrolador, los optoacopladores, los TRIACs y los conectores de potencia',
        href: '/proyectos/purificador/',
        slug: 'purifier',
      },
      {
        title: 'Tesis de magíster: estimar la carga de un cargador frontal',
        summary: 'Un cargador CAT 262C semiautónomo con ROS y dos cámaras de captura de movimiento. La pregunta: ¿se puede estimar la masa de la carga con cámaras y con el torque calculado desde las señales de control, sin sensores de torque caros? En el mejor caso con señales de control, el error de masa fue de 0,8 %.',
        tags: ['ROS', 'Vicon', 'EKF', 'RLS', 'C++', 'Python'],
        image: img2('loader-test.jpg'),
        imageAlt: 'Cargador frontal CAT 262C con dos cámaras en el techo, rodeado de paneles con marcadores',
        href: '/proyectos/tesis/',
        slug: 'thesis',
      },
      {
        title: 'Iron Impact: blanco de entrenamiento inteligente',
        summary: 'Blanco de entrenamiento inteligente para HEMA, buhurt, kendo, esgrima y deportes de combate, con placas de sensores con LEDs reactivos, montaje universal y una app móvil. La arquitectura pasó de ESP32 a nRF52840 para bajar el consumo y transmitir telemetría BLE de baja latencia.',
        tags: ['ESP32', 'nRF52840', 'BLE', 'ADS1115', 'PCB'],
        image: img3('pcb-v01.jpg'),
        imageAlt: 'Render 3D de la placa Iron Impact V0.1 con un módulo ESP32, dos módulos ADS1115 y ocho entradas jack',
        href: '/proyectos/iron-impact/',
        slug: 'iron-impact',
      },
      {
        title: 'Posicionador de 4 ejes para medir antenas de ondas milimétricas',
        summary: 'Electrónica y software de control de un robot que mueve una fuente y un detector para medir el patrón de haz de fuentes de ondas milimétricas en el Centro de Astro-Ingeniería UC: firmware de motores paso a paso comandado por SPI desde una BeagleBone y barridos de medición automatizados con un analizador de espectro.',
        tags: ['ATmega328P', 'DRV8825', 'SPI', 'BeagleBone', 'Python', 'SCPI'],
        image: img6('robot.jpg'),
        imageAlt: 'Posicionador con un eje vertical y una etapa rotatoria dentro de una jaula anecoica, junto a un analizador de espectro',
        href: '/proyectos/posicionador/',
        slug: 'positioner',
        other: true,
      },
      {
        title: 'TheGame: de un Pong en protoboard a una consola en PCB',
        summary: 'Una consola portátil diseñada de punta a punta. Empezó como un Pong sobre un ATmega328P en protoboard y terminó en una placa propia con ATmega32U4, pantalla TFT y alimentación por USB o batería.',
        tags: ['ATmega32U4', 'ATmega328P', 'C', 'Altium', 'PCB'],
        image: img('pcb-front.png'),
        imageAlt: 'Render 3D de la placa TheGame con pantalla, cruceta y botones',
        href: '/proyectos/thegame/',
        slug: 'thegame',
        other: true,
      },
      {
        title: 'Estabilizador robótico de 3 ejes',
        summary: 'Un gimbal que mantiene fija la orientación de una cámara mientras la base se mueve en la mano. Lo simulamos en Simulink antes de construirlo; diseñé la placa de control con un ATmega328P, la lectura de la IMU BNO055 y el firmware con tres controladores PID.',
        tags: ['ATmega328P', 'BNO055', 'PID', 'Simulink', 'EAGLE'],
        image: img5('structure.jpg'),
        imageAlt: 'Estructura del estabilizador en madera, con un motor en el brazo superior y dos motores en la base',
        href: '/proyectos/estabilizador/',
        slug: 'stabilizer',
        other: true,
      },
    ],
    aboutTitle: 'Sobre mí',
    about: [
      'Soy ingeniero eléctrico y electrónico (MSc, PUC Chile) con foco en robótica y sistemas embebidos. Trabajo en Zippedi como Electrical Hardware Engineer. Zippedi fabrica un robot autónomo que recorre tiendas y escanea las góndolas con cámaras para detectar productos agotados y errores de precios.',
    ],
    tekknight: {
      name: 'TekKnight',
      tagline: 'Old Arts. Modern Tools',
      description: 'Herramientas de ingeniería para el entrenamiento de combate con espada. Es mi emprendimiento, donde diseño el hardware y el firmware.',
      logoAlt: 'Logo de TekKnight: un casco de caballero con detalles rojos luminosos',
      links: tkLinks,
    },
    skillsTitle: 'Con qué trabajo',
    skills: [
      ['Firmware', 'C, C++, Python, FreeRTOS, ESP32, nRF52840, MSPM0'],
      ['Comunicación', 'CAN, I2C, RS485, BLE'],
      ['Diseño', 'Altium, Eagle, LTSpice, Fusion 360, SolidWorks'],
      ['Robótica', 'ROS, Linux, Git'],
    ],
    contactTitle: 'Contacto',
    location: 'Santiago, Chile',
    switchTo: 'English',
    back: 'Volver a proyectos',
    pages: {
      'iron-impact': {
        title: 'Iron Impact: el blanco de entrenamiento inteligente de nueva generación',
        lead: 'Iron Impact es un blanco de entrenamiento inteligente para HEMA, buhurt, kendo, esgrima y deportes de combate, con métricas de impacto en tiempo real: el blanco que devuelve el golpe con datos. Lo desarrollo en TekKnight, donde diseño el hardware y el firmware.',
        facts: [
          ['Mi rol', 'Diseño de hardware y firmware (Lead Hardware Engineer en TekKnight)'],
          ['Stack', 'ESP32, nRF52840, ADS1115, BLE, OTA'],
          ['Estado', 'PCB V0.1 y soporte «Universal» para neumáticos, ambos en fase de prototipo; la arquitectura evolucionó después hacia el nRF52840'],
        ],
        links: [['Ver TekKnight', 'https://tekknight.io']],
        sections: [
          {
            heading: 'El producto',
            paragraphs: [
              'Iron Impact combina sensores piezoeléctricos con espuma EVA de alta densidad. Diseñé el hardware y el firmware y los he ido iterando: la primera arquitectura usaba un ESP32, y después migré a un nRF52840 para bajar el consumo y transmitir telemetría BLE de baja latencia.',
            ],
            figures: [
              { video: 'cCJvmzllVtA', title: 'Iron Impact: Field testing', caption: 'Video de las pruebas en terreno de Iron Impact.', wide: true },
            ],
          },
          {
            heading: 'Placas de sensores con LEDs reactivos',
            paragraphs: [
              'El blanco se compone de ocho segmentos con sensores y LEDs reactivos, montados en un neumático. La construcción está pensada para absorber la fuerza completa de armas pesadas sin degradarse.',
              'En las pruebas, un ESP32 en protoboard controlaba un anillo de LEDs sobre el neumático. Hoy los cables conectan los sensores y los LEDs a la electrónica; los de cada segmento irán montados en placas individuales.',
            ],
            figures: [
              { src: img3('led-ring-test.jpg'), alt: 'Neumático sobre una mesa con un anillo de LEDs de colores en su borde interior y un ESP32 en una protoboard en el centro', caption: 'Prueba con un ESP32 en protoboard controlando un anillo de LEDs de colores sobre el neumático.', tall: true },
              { src: img3('tire-led-test.jpg'), alt: 'Neumático apoyado en una silla con varios LEDs rojos encendidos en el borde y cables en el interior', caption: 'El neumático con LEDs en el borde y los cables hacia la electrónica, en el interior.', tall: true },
            ],
          },
          {
            heading: 'Sistema de montaje universal',
            paragraphs: [
              'El soporte «Universal» busca que el blanco se monte en cualquier parte y se ajuste al instante, funcionando con la configuración de cada persona y no en su contra. Sigue en fase de prototipo.',
            ],
            figures: [
              { src: img3('test-rig.jpg'), alt: 'Neumático sujeto por un marco de perfil de aluminio con dos piezas naranjas de ajuste, junto a una placa con un módulo ESP32 conectada por cables', caption: 'Prototipo del soporte «Universal» para neumáticos: un marco de perfil de aluminio sujeta el neumático y las piezas naranjas sirven para ajustarlo. Junto a él, la placa con ESP32.', tall: true },
            ],
          },
          {
            heading: 'App móvil complementaria',
            paragraphs: [
              'La app se conecta por Bluetooth y sirve para seguir la velocidad y la precisión de los impactos en tiempo real, con modos de entrenamiento gamificados. También permite configurar cosas como las luces y los patrones de golpes, y actualizar el firmware por aire (OTA).',
              'El anillo de ocho segmentos de la pantalla de patrones representa los ocho segmentos del blanco.',
            ],
            figures: [
              { src: img3('app-pattern-mode.jpg'), alt: 'Pantalla de la app móvil en modo de patrones: un anillo de ocho segmentos con dos iluminados y un botón de inicio', caption: 'La app en el modo de patrones: el anillo representa los ocho segmentos del blanco, con dos iluminados.', tall: true },
            ],
          },
          {
            heading: 'Primer prototipo de la PCB (V0.1)',
            paragraphs: [
              'La primera placa es un prototipo (V0.1) con una placa de desarrollo ESP32 (ESP-WROOM-32D, con USB-C). Tiene ocho entradas de sensor con conectores jack de 3,5 mm, leídas por dos módulos ADS1115, y cuatro salidas con conectores Molex para LEDs. Cada entrada lleva su propio circuito con resistencia, diodos y un condensador.',
              'Es una primera iteración: la arquitectura evolucionó después hacia el nRF52840.',
            ],
            figures: [
              { src: img3('pcb-v01.jpg'), alt: 'Render 3D de la placa Iron Impact V0.1 con un módulo ESP32, dos módulos ADS1115, ocho entradas jack y cuatro salidas para LEDs', caption: 'Render 3D de la placa Iron Impact V0.1, el primer prototipo.', wide: true },
            ],
          },
        ],
      },
      thesis: {
        title: 'Tesis de magíster: estimar la carga de un cargador frontal con cámaras y señales de control',
        lead: 'Mi tesis del Magíster en Ciencias de la Ingeniería (PUC Chile, enero 2025, profesor guía Miguel Torres Torriti). Estudia si se puede estimar de forma continua la masa y el momento de inercia de un cargador frontal usando aceleraciones obtenidas con cámaras y el torque deducido de las señales de control, en vez de sensores de torque costosos.',
        facts: [
          ['Contexto', 'Tesis de Magíster en Ciencias de la Ingeniería, PUC Chile, enero 2025'],
          ['Máquina', 'Cargador frontal CAT 262C semiautónomo con ROS'],
          ['Stack', 'ROS, Vicon Tracker, C++, Python; estimadores LS, RLS, TLS y EKF'],
        ],
        links: [
          ['Leer la tesis completa (DOI)', DOI],
          ['Simulador 2D de cámaras en GitHub', 'https://github.com/cihenriquez/Egomotion-Tracking-robot-sim'],
          ['Xbox-JoyROS en GitHub', 'https://github.com/cihenriquez/Xbox-JoyROS'],
        ],
        sections: [
          {
            heading: 'El problema',
            paragraphs: [
              'Una máquina que mueve carga cambia su dinámica: varían su masa y su momento de inercia. Conocerlos ayuda a controlarla y a operarla con más seguridad, por ejemplo en minería. Medirlos con balanzas o galgas extensiométricas no entrega datos en tiempo real y se degrada con el tiempo.',
              'La hipótesis de la tesis: con aceleraciones obtenidas por odometría visual y torques estimados a partir de las señales de control, un método recursivo puede estimar esos parámetros con precisión suficiente.',
            ],
          },
          {
            heading: 'La máquina y el montaje con cámaras',
            paragraphs: [
              'Trabajé sobre un CAT 262C modificado para ser semiautónomo, con ROS y una placa electrónica auxiliar para recolectar datos de sensores y controlarlo a distancia. Para obtener movimiento desde cámaras instalé dos Vicon Vantage V5 en el chasis. Están pensadas para seguir marcadores desde un punto fijo, así que hice lo inverso: marcadores fijos en el entorno y cámaras sobre la máquina.',
              'Desarrollé el software que se comunica con Vicon Tracker y convierte lo que ven las cámaras en el movimiento del cargador. Para ampliar el alcance de detección armé marcadores activos con LEDs infrarrojos.',
            ],
            figures: [
              { src: img2('loader-test.jpg'), alt: 'Cargador frontal CAT 262C con dos cámaras en el techo, rodeado de paneles con marcadores', caption: 'El cargador con las dos cámaras en el techo, rodeado de paneles con marcadores.', wide: true },
              { src: img2('frames.png'), alt: 'Diagrama de los marcos de referencia del mundo, del cuerpo del cargador y de las dos cámaras, con líneas hacia tres paneles de marcadores', caption: 'Marcos de referencia: el mundo, el cuerpo del cargador y las dos cámaras, que miden la posición de los marcadores.', wide: true },
            ],
          },
          {
            heading: 'Torque sin sensores de torque',
            paragraphs: [
              'Los sensores de torque son caros. Calibré la relación entre la señal PWM enviada a las servoválvulas y el torque real de las ruedas, medido con sensores XtreMA. Una vez validada, el torque se calcula solo con las señales de control.',
              'Con eso comparé cuatro combinaciones de datos: IMU o cámaras para la aceleración, y sensor de torque o señal de control para la fuerza. Cada una pasó por cuatro estimadores (LS, RLS, TLS y EKF), con un criterio de información mutua para descartar los segmentos de señal ruidosos.',
            ],
            figures: [
              { src: img2('block-diagram.png'), alt: 'Diagrama de bloques: control por ROS, la máquina, sensores de torque, encoders, IMU y cámaras Vicon, un filtro de información mutua y los estimadores', caption: 'Diagrama del sistema. En rojo, las fuentes nuevas: control Xbox, torque estimado desde las señales de control y cámaras.', wide: true },
            ],
          },
          {
            heading: 'Resultados',
            paragraphs: [
              'Con IMU y sensor de torque, el filtro de Kalman extendido estimó la masa total del cargador con un error de 2,8 ± 0,7 %. Cambiando el sensor de torque por el torque calculado desde las señales de control, el mejor caso fue 0,8 ± 0,9 % con mínimos cuadrados recursivos: en buenas condiciones, las señales de control pueden reemplazar al sensor.',
              'Con cámaras el error fue mayor, entre 6,7 % y 35 %. Las vibraciones del cargador degradan el seguimiento, sobre todo a distancia, y el sistema ideal necesitaría más de dos cámaras y un montaje amortiguado. El momento de inercia adicional (548 kg·m²) no se detectó con precisión en ninguna combinación: la carga era apenas un 0,052 % del peso total y la fricción al girar en el lugar domina.',
            ],
            figures: [
              { src: img2('force-accel.png'), alt: 'Cuatro gráficos de aceleración contra fuerza para las combinaciones de acelerómetro o cámaras con sensor de torque o señal de control', caption: 'Aceleración contra fuerza según la combinación de fuentes. Con IMU y sensor de torque (arriba a la izquierda) la relación es la más limpia; con cámaras hay más dispersión.', wide: true },
            ],
          },
          {
            heading: 'Lo que dejé disponible',
            paragraphs: [
              'Además de la tesis publiqué un simulador 2D en Python y PyGame para ver los límites de detectar puntos lejanos con dos cámaras, y un programa en C++ que convierte un control Xbox por Bluetooth en mensajes de ROS. Los enlaces están arriba.',
            ],
            figures: [
              { src: img2('simulator.png'), alt: 'Captura del simulador 2D: una base móvil amarilla, los campos de visión de dos cámaras en rojo, marcadores de colores y, arriba, la franja que ve cada cámara', caption: 'El simulador 2D: la base móvil (amarillo), los campos de visión de las dos cámaras (rojo), los marcadores de colores y, arriba, la franja que ve cada cámara.', wide: true },
            ],
          },
        ],
      },
      thegame: {
        title: 'TheGame: de un Pong en protoboard a una consola en PCB',
        lead: 'Un proyecto en dos etapas. Primero SEPong, un Pong funcional sobre un ATmega328P en protoboard, hecho en equipo de dos para el curso Sistemas Electrónicos Programables (PUC Chile). Después TheGame, la misma idea de consola rediseñada como placa propia.',
        facts: [
          ['Mi rol', 'Esquemático y PCB de TheGame; prototipo SEPong en equipo de dos'],
          ['Stack', 'C (avr-gcc, avrdude), ATmega328P, ATmega32U4, Altium'],
          ['Estado', 'SEPong funcionando; TheGame en revisión 0.1'],
        ],
        sections: [
          {
            heading: 'Etapa 1: SEPong, el prototipo',
            paragraphs: [
              'El desafío del curso era hacer un videojuego sobre un ATmega328P. En vez de usar el kit de evaluación, montamos el chip desnudo en una protoboard con lo mínimo para que funcione solo: cristal de 16 MHz, regulador 7805 para bajar los 9 V de la batería a 5 V, botón de reset y cuatro botones para mover las dos barras.',
              'Cargamos el bootloader con otro ATmega328 en un Arduino como programador ISP, y desde ahí programamos el chip por serial con un FTDI, usando avr-gcc y avrdude. La pantalla es una TFT ST7735 con lector microSD: las imágenes de inicio y de victoria se guardan como BMP en la tarjeta y se leen con Petit FatFs. Gana quien llega primero a 5 puntos.',
            ],
            figures: [
              { src: img('breadboard.jpg'), alt: 'Circuito del Pong montado en protoboard, con pantalla TFT, microcontrolador y cuatro botones', caption: 'El prototipo en protoboard, alimentado con una batería de 9 V.' },
              { src: img('sepong-start.png'), alt: 'Pantalla de inicio de SEPong', caption: 'Pantalla de inicio.' },
              { src: img('sepong-game.png'), alt: 'Pantalla de juego de SEPong con dos barras, la pelota y las vidas', caption: 'Pantalla de juego.' },
            ],
          },
          {
            heading: 'Un problema de tiempos',
            paragraphs: [
              'La TFT es lenta para redibujar imágenes completas, así que en cada cuadro solo se actualizan los píxeles que cambiaron. En la primera versión esa actualización corría dentro de un bucle while, y cuando había más píxeles por cambiar el juego se ralentizaba.',
              'Lo resolvimos moviendo la actualización a una interrupción de timer con un período fijo, mayor al peor caso de dibujo. Así el tiempo entre cuadros es constante, y además sirve para subir la dificultad: a medida que avanza la partida se acorta el período del timer y la pelota se mueve más rápido.',
            ],
          },
          {
            heading: 'Etapa 2: TheGame, la consola en una placa',
            paragraphs: [
              'En las conclusiones de SEPong quedaron pendientes dos mejoras: reducir el tamaño con una PCB y reemplazar la batería de 9 V por una más pequeña. TheGame (revisión 0.1) es ese paso: la misma consola, ahora como placa propia con siete botones (cruceta, A, B y START), reset y botón de encendido.',
              'El corazón es un ATmega32U4, que trae USB nativo. La placa se alimenta por el conector micro-USB o por batería: un MOSFET selecciona la fuente y un step-up MAX1724 entrega los 3,3 V del sistema. El encendido es un interruptor con retención (soft latch) hecho con MOSFETs y controlado por un pulsador, y un supervisor de voltaje genera el reset del microcontrolador y de la pantalla. La TFT se conecta por un FPC de 24 pines, con la retroiluminación conmutada por un MOSFET.',
              'Dos detalles de diseño: la entrada USB lleva un fusible reseteable y varistores de protección, y como todo funciona a 3,3 V, una nota en el esquemático recuerda dividir el reloj a 8 MHz porque, según el datasheet, a esa tensión no se puede usar 16 MHz. Para programarlo hay un conector ICSP.',
            ],
            figures: [
              { src: img('pcb-front.png'), alt: 'Render 3D de la cara frontal de TheGame: pantalla TFT, cruceta, botones A, B, START y reset', caption: 'Cara frontal: pantalla, cruceta, A, B, START, reset y encendido.' },
              { src: img('pcb-back.png'), alt: 'Render 3D de la cara posterior de TheGame: microcontrolador, portabatería, micro-USB y conector ICSP', caption: 'Cara posterior: microcontrolador, portabatería, micro-USB e ICSP.' },
              { src: img('schematic.png'), alt: 'Esquemático de TheGame Rev 0.1 dividido en bloques: selector de voltaje y step-up, interruptor de encendido, botones, reset, microcontrolador, TFT y USB', caption: 'Esquemático de la revisión 0.1, organizado por bloques.', wide: true },
            ],
          },
        ],
      },
      purifier: {
        title: 'Tarjeta de control para un equipo de purificación de aire',
        lead: 'Un proyecto profesional de 2019: rediseñar la electrónica de control de un equipo de purificación de aire usado en talleres automotrices, que genera oxígeno ionizado para eliminar microorganismos y olores. La versión anterior de la placa fallaba en terreno y el cliente necesitaba una placa más robusta, configurable y fácil de diagnosticar, con el diseño completo de hardware y firmware en su poder.',
        facts: [
          ['Mi rol', 'Diseño de hardware y firmware, documentación y pruebas'],
          ['Stack', 'PIC18F2550, C (MPLAB X, XC8), EAGLE'],
          ['Resultado', '20 kits entregados, en pruebas en Chile y México'],
        ],
        sections: [
          {
            heading: 'El punto de partida',
            paragraphs: [
              'No había documentación del firmware de la placa anterior, así que reconstruí su funcionamiento con pruebas y análisis del circuito. Se alimenta con los 12 V del vehículo, controla con TRIACs y optoacopladores una salida de 220 VAC para la turbina y otra de 110 VAC para la tarjeta de ionización, informa los ciclos a un módem GPRS que además permite bloquear el equipo a distancia, y muestra la cuenta de ciclos en un display de 7 segmentos por I2C.',
              'De ese análisis salieron las fallas típicas que veía el cliente: ciclos con duración incorrecta, modo de prueba que corría como un ciclo normal y un reinicio del contador que no funcionaba bien. Los requisitos fueron una placa más robusta frente a errores de manipulación, tiempos de funcionamiento configurables según la normativa de cada país, documentación de fabricación, uso y diagnóstico, y 20 kits validados.',
            ],
          },
          {
            heading: 'Hardware pensado para el técnico',
            paragraphs: [
              'Mantuve el PIC18F2550, que sobraba para la tarea y permitía generar también un firmware actualizado para las placas antiguas, y aproveché su USB, que la versión anterior no usaba. El componente que más fallaba según el cliente era el arreglo de transistores ULN2003: revisé el datasheet y las conexiones y el consumo quedaba lejos del límite de 500 mA por canal, así que la causa más probable eran errores al conectar los cables.',
              'Por eso reemplacé los bloques de borneras atornillables de una pieza, donde había que desatornillar 17 cables para cambiar una placa, por conectores de dos piezas que se enchufan sin tocar el cableado, con distinto número de contactos o paso para que no se puedan intercambiar. Los jumpers de configuración, que los operarios terminaban puenteando con un destornillador, pasaron a ser un menú con un botón y dos LEDs. Agregué LEDs de diagnóstico en la salida del regulador, en las líneas del módem y en los optoacopladores, y escribí un manual con la guía de diagnóstico.',
            ],
            figures: [
              { src: img4('layout.jpg'), alt: 'Render del layout de la tarjeta con el microcontrolador, los optoacopladores, los TRIACs y los conectores de potencia', caption: 'Layout de la nueva tarjeta, diseñado en EAGLE.', wide: true },
              { src: img4('display-board.jpg'), alt: 'Render de una placa verde con un display LCD de cuatro dígitos de siete segmentos y un conector de cuatro pines', caption: 'Render de la placa del display LCD, que se conecta a la tarjeta por I2C.', wide: true },
            ],
          },
          {
            heading: 'Un error en el circuito de carga',
            paragraphs: [
              'En la primera iteración agregué un cargador para una batería LiPo de respaldo con un MCP73833, con termistor para cortar la carga si la batería se calienta. Faltó separar la batería de la alimentación principal: al conectar la batería y los 12 V a la vez quedaban en corto los 5 V con la batería, y como la batería tiene una impedancia mucho mayor, la corriente se iba al cargador y lo quemaba.',
              'La solución fue un FDFMA2P853, que integra un MOSFET y un diodo Schottky: el MOSFET conecta la batería solo cuando faltan los 5 V del regulador y el Schottky impide que la corriente vuelva hacia ese nodo, con apenas 0,4 V de caída. En la segunda iteración el microcontrolador además detecta si hay voltaje de entrada, un interruptor DPDT conecta la batería solo cuando hace falta para que no se descargue, y a pedido del cliente se sumó una salida de 12 V con un MOSFET de potencia.',
            ],
          },
          {
            heading: 'Firmware',
            paragraphs: [
              'El firmware está escrito en C con MPLAB X y XC8, sobre una máquina de estados. El tiempo de cada ciclo se mide con una interrupción de timer, con más exactitud que en la versión anterior. El menú de configuración es otra máquina de estados que reemplaza a la principal: con el botón se elige entre cuatro tiempos de funcionamiento (10, 15, 20 o 25 minutos), se activa el modo de prueba, se reinicia el contador o se cambia el modo de comunicación, y todo queda guardado en la EEPROM. El display alterna la cuenta de ciclos con una cuenta regresiva, y sin los 12 V de entrada el microcontrolador entra en modo sleep y despierta con una interrupción.',
              'El cliente quería configurar los equipos a distancia, así que agregué comunicación serial con el módem GPRS usando el mismo hardware de antes: el relé del módem y un optoacoplador. La salida del optoacoplador invierte la señal y el módulo UART del PIC no puede invertir la trama completa, así que escribí una UART invertida por software con otro timer. El ancho de banda del relé la limita a unos 120 bps. Este modo quedó terminado, pero no alcanzó a probarse en terreno.',
              'Para actualizar equipos que están fuera del país, cargué un bootloader de las librerías de Microchip, modificado para entrar en modo de actualización con el botón de la placa. Con un cable USB, un computador y la guía del manual, cualquier técnico puede cargar un firmware nuevo.',
            ],
          },
          {
            heading: 'Resultado',
            paragraphs: [
              'Se entregaron 20 kits con su documentación y quedaron en pruebas en Chile y México. Tres presentaron fallas: al menos una por un componente mal soldado, algo esperable con componentes tan pequeños soldados a mano. Si lo hiciera de nuevo, revisaría el costo: con alimentación desde una batería, el filtro Pi y el diodo TVS probablemente están sobredimensionados, y la poca carga de procesamiento permitiría un microcontrolador más barato.',
            ],
            figures: [
              { src: img4('board-running.jpg'), alt: 'La tarjeta de control instalada en el equipo, con LEDs de diagnóstico encendidos, conectores enchufables y el display LCD conectado', caption: 'Una de las tarjetas funcionando en el equipo, con los LEDs de diagnóstico encendidos y el display conectado.', tall: true },
            ],
          },
        ],
      },
      positioner: {
        title: 'Posicionador de 4 ejes para medir antenas de ondas milimétricas',
        lead: 'Mi trabajo como asistente técnico en el Centro de Astro-Ingeniería UC (2016–2018): la electrónica y el software de control de un posicionador de 4 ejes que mueve una fuente y un detector para medir el patrón de haz de fuentes de ondas milimétricas en el Laboratorio de Radiofrecuencias.',
        facts: [
          ['Mi rol', 'Electrónica de control, firmware de motores y scripts de medición'],
          ['Stack', 'ATmega328P, DRV8825, BeagleBone, SPI, Python, SCPI'],
          ['Contexto', 'Centro de Astro-Ingeniería UC, 2016–2018'],
        ],
        sections: [
          {
            heading: 'El sistema',
            paragraphs: [
              'El posicionador tiene cuatro ejes: X e Y lineales, y dos rotaciones, φ, donde va montado el detector, y θ, donde va la fuente. Una BeagleBone corre los scripts en Python y envía órdenes por SPI a un microcontrolador que mueve los cuatro motores paso a paso.',
            ],
            figures: [
              { src: img6('robot.jpg'), alt: 'Posicionador con un eje vertical y una etapa rotatoria dentro de una jaula anecoica, junto a un analizador de espectro y una fuente de poder', caption: 'El posicionador en la jaula anecoica del Laboratorio de Radiofrecuencias del AIUC. Foto actual: el sistema siguió evolucionando después de mi periodo.', wide: true },
              { src: img6('diagram-es.svg'), alt: 'Diagrama: la BeagleBone envía órdenes por SPI al ATmega328P y consulta el analizador de espectro por SCPI; el ATmega328P recibe los finales de carrera por interrupciones y mueve cuatro drivers DRV8825 que controlan los ejes X, Y, φ y θ', caption: 'Arquitectura del sistema.', wide: true },
            ],
          },
          {
            heading: 'Firmware de los motores',
            paragraphs: [
              'El microcontrolador (un ATmega328P) funciona como esclavo SPI con un protocolo simple: un byte de sincronización con su confirmación, seguido del eje y un entero de 32 bits con los pasos. Maneja cuatro drivers DRV8825 con micropasos de 1/32 y rampas lineales de aceleración y desaceleración.',
              'Los ejes lineales tienen finales de carrera en ambos extremos, leídos con interrupciones de cambio de pin que detienen el motor si se alcanza un límite. Para fijar el cero, cada eje se acerca rápido en pasos completos hasta tocar el final de carrera y luego retrocede con micropasos hasta liberarlo.',
            ],
          },
          {
            heading: 'Medición automatizada',
            paragraphs: [
              'En la BeagleBone, una capa en Python modela cada eje como lineal o rotacional, convierte milímetros y grados a pasos, guarda la posición en disco para recuperarla entre sesiones y calcula el ángulo necesario para apuntar a un punto.',
              'Para medir el haz, el script ubica el pico de la fuente cerca de 145 GHz en un analizador de espectro Keysight N9020B, controlado por SCPI, y luego barre θ de 0° a 10° en pasos de 0,5°, registrando la potencia en cada posición.',
            ],
          },
        ],
      },
      stabilizer: {
        title: 'Estabilizador robótico de 3 ejes',
        lead: 'Proyecto del curso Diseño Eléctrico (PUC Chile, 2017), en equipo de dos con Jacob Mellado: un manipulador de tres grados de libertad que, con una sola IMU, mantiene fija la orientación de una cámara o un celular mientras la base se mueve en la mano.',
        facts: [
          ['Mi rol', 'Placa de control, firmware y lectura de la IMU; estructura en conjunto'],
          ['Stack', 'ATmega328P, C, IMU BNO055 (I2C), EAGLE, SolidWorks, Simulink'],
          ['Estado', 'Prototipo funcional; cumplió parcialmente las especificaciones'],
        ],
        sections: [
          {
            heading: 'El desafío',
            paragraphs: [
              'El estabilizador debía sostener herramientas de hasta 15 × 5 × 10 cm, con un error de orientación que nunca superara los 5° y volviendo a una banda de 1° en menos de un segundo ante cualquier perturbación. Además debía permitir ajustar la orientación de referencia, ser portátil y autocontenido, sin sensores externos alrededor del equipo.',
            ],
          },
          {
            heading: 'Simular antes de construir',
            paragraphs: [
              'Modelamos la estructura en SolidWorks, incluyendo la masa de los motores, y la importamos a Simulink, donde las articulaciones pasan a ser actuadores controlados por torque y se puede medir la orientación en el punto donde iría la IMU. Con ese modelo probamos si bastaba una sola IMU para controlar los tres ejes, con un tope de torque de 0,5 N·m y ruido gaussiano en la medición.',
              'En la segunda simulación la referencia queda fija y la base recibe torques sinusoidales en los tres ejes, imitando el movimiento de una mano. El video muestra esa simulación.',
            ],
            figures: [
              { src: img5('model.png'), alt: 'Modelo 3D en SolidWorks del estabilizador, con sus dimensiones y la cámara montada en el extremo', caption: 'Modelo de la estructura en SolidWorks.', tall: true },
              { video: GIMBAL_VIDEO, title: 'Simulación del estabilizador en Simulink', caption: 'Simulación con perturbaciones en la base y la referencia fija.' },
            ],
          },
          {
            heading: 'Electrónica y control',
            paragraphs: [
              'Diseñé la placa de control en torno a un ATmega328P a 16 MHz. Un FT232 permite programarlo por USB y enviar telemetría a un computador, un regulador LM7805 baja los 12 V de la batería NiMH a 5 V, y un traductor de nivel bidireccional conecta el bus I2C de la IMU BNO055, que trabaja a 3,3 V. Dos puentes H L298N mueven los tres motores DC de 12 V.',
              'El firmware lee los ángulos de Euler y los cuaterniones de la IMU por I2C y ejecuta tres controladores PID, uno por eje, en una interrupción de timer cada 5 ms. La derivada se filtra promediándola con la anterior, y la ganancia integral es relativamente alta porque las perturbaciones de una mano no son escalones: importa más seguir pegado a la referencia que llegar rápido a ella. Presionando un joystick se entra al modo de ajuste, donde los dos joysticks mueven la referencia de cada eje.',
            ],
            figures: [
              { src: img5('control-board.jpg'), alt: 'Placa de control fabricada con el ATmega328P, un módulo FT232, un traductor de nivel y el regulador de voltaje', caption: 'La placa de control fabricada.' },
              { src: img5('board-layout.png'), alt: 'Layout de la placa de control en EAGLE, de 75 por 41 mm', caption: 'Su layout en EAGLE.' },
              { src: img5('telemetry.png'), alt: 'Gráficos de telemetría de yaw, roll y pitch medidos contra su referencia, junto a una representación 3D de la orientación', caption: 'Telemetría por USB: cada eje medido contra su referencia, y la orientación de la IMU en 3D.', wide: true },
            ],
          },
          {
            heading: 'Estructura',
            paragraphs: [
              'La estructura es de madera, con piezas impresas en PLA donde la forma era demasiado compleja para hacerla a mano. Imprimirla completa habría tomado demasiado tiempo, y así quedó liviana, rígida y barata: no se deformó ni se trizó con el uso. La electrónica va en carcasas separadas para cambiarla fácilmente si algo falla.',
            ],
            figures: [
              { src: img5('structure.jpg'), alt: 'Estructura del estabilizador en madera durante el armado, con los motores montados', caption: 'La estructura durante el armado.', wide: true },
            ],
          },
          {
            heading: 'Resultados y lo que aprendí',
            paragraphs: [
              'El estabilizador funciona dentro de unos ±90° desde la posición base: con un solo sensor no se puede detectar un cambio de ejes y aparece el bloqueo de cardán. Converge rápido a la referencia y el ajuste con joysticks logra menos de un grado de precisión. La batería alcanza para unos diez minutos de uso continuo.',
              'Lo que no se cumplió fue la precisión. Los motores DC con reducción tienen un juego mecánico de casi 5° que el controlador no puede corregir, y en el eje yaw el error superó la especificación. El límite estaba en los actuadores, no en el control: la siguiente versión usaría motores brushless sin reducción, como los estabilizadores comerciales, que no cabían en el presupuesto del curso.',
            ],
          },
        ],
      },
    },
  },
  en: {
    htmlLang: 'en',
    siteTitle: 'Cristian Henríquez · Hardware & firmware portfolio',
    description: 'Portfolio of Cristian Henríquez: electronics, firmware and robotics.',
    name: 'Cristian Henríquez',
    intro: 'I design electronics and firmware for robots and embedded devices, from the schematic to the finished product.',
    projectsTitle: 'Projects',
    viewProject: 'View project',
    otherProjectsTitle: 'Other projects',
    projects: [
      {
        title: 'Control board for an air purification unit',
        summary: 'A complete redesign of the control board of an air purification unit: new hardware and firmware, designed so a technician can install, configure, diagnose and update it in the field. 20 kits were delivered and went into testing in Chile and Mexico.',
        tags: ['PIC18F2550', 'C', 'EAGLE', 'UART', 'USB bootloader'],
        image: img4('layout.jpg'),
        imageAlt: 'Layout render of the board with the microcontroller, optocouplers, TRIACs and power connectors',
        href: '/en/projects/air-purifier/',
        slug: 'purifier',
      },
      {
        title: 'Master thesis: estimating the payload of a skid-steer loader',
        summary: 'A semi-autonomous CAT 262C loader running ROS, with two motion-capture cameras. The question: can payload mass be estimated from cameras and from torque computed out of the control signals, without expensive torque sensors? In the best control-signal case, the mass error was 0.8%.',
        tags: ['ROS', 'Vicon', 'EKF', 'RLS', 'C++', 'Python'],
        image: img2('loader-test.jpg'),
        imageAlt: 'CAT 262C skid-steer loader with two cameras on the roof, surrounded by marker panels',
        href: '/en/projects/thesis/',
        slug: 'thesis',
      },
      {
        title: 'Iron Impact: next-gen smart striking target',
        summary: 'Smart striking target for HEMA, buhurt, kendo, fencing and combat sports, with reactive LED sensor plates, a universal mounting system and a companion mobile app. The architecture moved from ESP32 to nRF52840 to cut power use and stream low-latency BLE telemetry.',
        tags: ['ESP32', 'nRF52840', 'BLE', 'ADS1115', 'PCB'],
        image: img3('pcb-v01.jpg'),
        imageAlt: '3D render of the Iron Impact V0.1 board with an ESP32 module, two ADS1115 modules and eight jack inputs',
        href: '/en/projects/iron-impact/',
        slug: 'iron-impact',
      },
      {
        title: '4-axis positioner for measuring millimeter-wave antennas',
        summary: 'Control electronics and software for a robot that moves a source and a detector to measure the beam pattern of millimeter-wave sources at the UC Center for Astro-Engineering: stepper-motor firmware commanded over SPI from a BeagleBone, and automated measurement sweeps with a spectrum analyzer.',
        tags: ['ATmega328P', 'DRV8825', 'SPI', 'BeagleBone', 'Python', 'SCPI'],
        image: img6('robot.jpg'),
        imageAlt: 'Positioner with a vertical axis and a rotary stage inside an anechoic enclosure, next to a spectrum analyzer',
        href: '/en/projects/positioner/',
        slug: 'positioner',
        other: true,
      },
      {
        title: 'TheGame: from a breadboard Pong to a handheld console on a PCB',
        summary: 'A handheld console designed end to end. It started as a Pong on an ATmega328P on a breadboard and ended up as a custom board with an ATmega32U4, a TFT screen and USB or battery power.',
        tags: ['ATmega32U4', 'ATmega328P', 'C', 'Altium', 'PCB'],
        image: img('pcb-front.png'),
        imageAlt: '3D render of the TheGame board with screen, D-pad and buttons',
        href: '/en/projects/thegame/',
        slug: 'thegame',
        other: true,
      },
      {
        title: '3-axis robotic stabilizer',
        summary: 'A gimbal that keeps a camera at a fixed orientation while its base moves in your hand. We simulated it in Simulink before building it; I designed the ATmega328P control board, the BNO055 IMU readout and the firmware with three PID controllers.',
        tags: ['ATmega328P', 'BNO055', 'PID', 'Simulink', 'EAGLE'],
        image: img5('structure.jpg'),
        imageAlt: 'Wooden frame of the stabilizer, with one motor on the upper arm and two motors on the base',
        href: '/en/projects/stabilizer/',
        slug: 'stabilizer',
        other: true,
      },
    ],
    aboutTitle: 'About me',
    about: [
      'I am an electrical and electronics engineer (MSc, PUC Chile) focused on robotics and embedded systems. I work at Zippedi as an Electrical Hardware Engineer. Zippedi builds an autonomous robot that drives through stores and scans the shelves with cameras to detect out-of-stock products and pricing errors.',
    ],
    tekknight: {
      name: 'TekKnight',
      tagline: 'Old Arts. Modern Tools',
      description: 'Engineering sword fighting training tools. It is my own venture, where I design the hardware and firmware.',
      logoAlt: 'TekKnight logo: a knight helmet with glowing red details',
      links: tkLinks,
    },
    skillsTitle: 'What I work with',
    skills: [
      ['Firmware', 'C, C++, Python, FreeRTOS, ESP32, nRF52840, MSPM0'],
      ['Communication', 'CAN, I2C, RS485, BLE'],
      ['Design', 'Altium, Eagle, LTSpice, Fusion 360, SolidWorks'],
      ['Robotics', 'ROS, Linux, Git'],
    ],
    contactTitle: 'Contact',
    location: 'Santiago, Chile',
    switchTo: 'Español',
    back: 'Back to projects',
    pages: {
      'iron-impact': {
        title: 'Iron Impact: next-gen smart striking target',
        lead: 'Iron Impact is a smart striking target for HEMA, buhurt, kendo, fencing and combat sports, with real-time impact metrics: the target that fights back with data. I develop it at TekKnight, where I design the hardware and firmware.',
        facts: [
          ['My role', 'Hardware and firmware design (Lead Hardware Engineer at TekKnight)'],
          ['Stack', 'ESP32, nRF52840, ADS1115, BLE, OTA'],
          ['Status', 'PCB V0.1 and "Universal" tire mount, both at prototype stage; the architecture later moved to the nRF52840'],
        ],
        links: [['See TekKnight', 'https://tekknight.io']],
        sections: [
          {
            heading: 'The product',
            paragraphs: [
              'Iron Impact combines piezoelectric sensors with high-density EVA foam. I designed the hardware and firmware and have been iterating on them: the first architecture used an ESP32, and I later moved to an nRF52840 to cut power use and stream low-latency BLE telemetry.',
            ],
            figures: [
              { video: 'cCJvmzllVtA', title: 'Iron Impact: Field testing', caption: 'Video: Iron Impact field testing.', wide: true },
            ],
          },
          {
            heading: 'Reactive LED sensor plates',
            paragraphs: [
              'The target is made of eight segments with sensors and reactive LEDs, mounted on a tire. The construction is designed to absorb the full force of heavy weapons without degrading.',
              'In the tests, an ESP32 on a breadboard drove a ring of LEDs on the tire. Today cables connect the sensors and LEDs to the electronics; those of each segment will be mounted on individual boards.',
            ],
            figures: [
              { src: img3('led-ring-test.jpg'), alt: 'Tire on a table with a ring of colored LEDs along its inner edge and an ESP32 on a breadboard in the middle', caption: 'Test with an ESP32 on a breadboard driving a ring of colored LEDs on the tire.', tall: true },
              { src: img3('tire-led-test.jpg'), alt: 'Tire resting on a chair with several red LEDs lit along its edge and cables inside', caption: 'The tire with LEDs along its edge and the cables to the electronics, inside.', tall: true },
            ],
          },
          {
            heading: 'Universal mounting system',
            paragraphs: [
              'The "Universal" mount aims to let the target be mounted anywhere and adjusted instantly, working with each person setup rather than against it. It is still at prototype stage.',
            ],
            figures: [
              { src: img3('test-rig.jpg'), alt: 'Tire held by an aluminum-profile frame with two orange adjustment pieces, next to a board with an ESP32 module connected by cables', caption: 'Prototype of the "Universal" tire mount: an aluminum-profile frame holds the tire and the orange pieces are used to adjust it. Next to it, the ESP32 board.', tall: true },
            ],
          },
          {
            heading: 'Companion mobile app',
            paragraphs: [
              'The app connects over Bluetooth and is used to track impact speed and accuracy in real time, with gamified training modes. It also configures things like the lights and the strike patterns, and updates the firmware over the air (OTA).',
              'The ring of eight segments on the pattern screen represents the eight segments of the target.',
            ],
            figures: [
              { src: img3('app-pattern-mode.jpg'), alt: 'Mobile app screen in pattern mode: a ring of eight segments with two lit and a start button', caption: 'The app in pattern mode: the ring represents the eight segments of the target, two of them lit.', tall: true },
            ],
          },
          {
            heading: 'First PCB prototype (V0.1)',
            paragraphs: [
              'The first board is a prototype (V0.1) built around an ESP32 development board (ESP-WROOM-32D, with USB-C). It has eight sensor inputs on 3.5 mm jack connectors, read by two ADS1115 modules, and four Molex outputs for LEDs. Each input has its own circuit with a resistor, diodes and a capacitor.',
              'It is a first iteration: the architecture later evolved toward the nRF52840.',
            ],
            figures: [
              { src: img3('pcb-v01.jpg'), alt: '3D render of the Iron Impact V0.1 board with an ESP32 module, two ADS1115 modules, eight jack inputs and four LED outputs', caption: '3D render of the Iron Impact V0.1 board, the first prototype.', wide: true },
            ],
          },
        ],
      },
      thesis: {
        title: 'Master thesis: estimating the payload of a skid-steer loader with cameras and control signals',
        lead: 'My Master in Engineering Sciences thesis (PUC Chile, January 2025, advisor Miguel Torres Torriti). It studies whether the mass and moment of inertia of a skid-steer loader can be estimated continuously from camera-derived accelerations and from torque inferred from the control signals, instead of costly torque sensors.',
        facts: [
          ['Context', 'Master in Engineering Sciences thesis, PUC Chile, January 2025'],
          ['Machine', 'Semi-autonomous CAT 262C skid-steer loader running ROS'],
          ['Stack', 'ROS, Vicon Tracker, C++, Python; LS, RLS, TLS and EKF estimators'],
        ],
        links: [
          ['Read the full thesis (DOI)', DOI],
          ['2D camera simulator on GitHub', 'https://github.com/cihenriquez/Egomotion-Tracking-robot-sim'],
          ['Xbox-JoyROS on GitHub', 'https://github.com/cihenriquez/Xbox-JoyROS'],
        ],
        sections: [
          {
            heading: 'The problem',
            paragraphs: [
              'A machine that carries loads changes its dynamics: its mass and moment of inertia vary. Knowing them helps control the machine and operate it more safely, for example in mining. Measuring them with scales or strain gauges gives no real-time data and degrades over time.',
              'The thesis hypothesis: with accelerations obtained from visual odometry and torques estimated from the control signals, a recursive method can estimate those parameters accurately enough.',
            ],
          },
          {
            heading: 'The machine and the camera setup',
            paragraphs: [
              'I worked on a CAT 262C modified to be semi-autonomous, with ROS and an auxiliary electronics board to collect sensor data and drive it remotely. To get motion from cameras I mounted two Vicon Vantage V5 units on the chassis. They are designed to track markers from a fixed point, so I did the reverse: fixed markers in the environment and cameras on the machine.',
              'I wrote the software that talks to Vicon Tracker and turns what the cameras see into the loader motion. To extend detection range I built active markers using infrared LEDs.',
            ],
            figures: [
              { src: img2('loader-test.jpg'), alt: 'CAT 262C skid-steer loader with two cameras on the roof, surrounded by marker panels', caption: 'The loader with its two roof cameras, surrounded by marker panels.', wide: true },
              { src: img2('frames.png'), alt: 'Diagram of the world, loader body and two camera reference frames, with lines to three marker panels', caption: 'Reference frames: the world, the loader body and the two cameras, which measure the marker positions.', wide: true },
            ],
          },
          {
            heading: 'Torque without torque sensors',
            paragraphs: [
              'Torque sensors are expensive. I calibrated the relation between the PWM signal sent to the servo valves and the real wheel torque, measured with XtreMA sensors. Once validated, torque is computed from the control signals alone.',
              'With that I compared four data combinations: IMU or cameras for acceleration, and torque sensor or control signal for force. Each went through four estimators (LS, RLS, TLS and EKF), with a mutual-information criterion to discard noisy signal segments.',
            ],
            figures: [
              { src: img2('block-diagram.png'), alt: 'Block diagram: ROS control, the machine, torque sensors, encoders, IMU and Vicon cameras, a mutual-information filter and the estimators', caption: 'System diagram. In red, the new sources: Xbox controller, torque estimated from control signals, and cameras.', wide: true },
            ],
          },
          {
            heading: 'Results',
            paragraphs: [
              'With the IMU and the torque sensor, the extended Kalman filter estimated the total loader mass with a 2.8 ± 0.7% error. Swapping the torque sensor for torque computed from control signals, the best case was 0.8 ± 0.9% with recursive least squares: under good conditions, control signals can replace the sensor.',
              'With cameras the error was higher, between 6.7% and 35%. Loader vibration degrades tracking, especially at long range, and the ideal system would need more than two cameras and a damped mount. The added moment of inertia (548 kg·m²) was not detected accurately by any combination: the payload was only 0.052% of the total weight and friction during in-place turns dominates.',
            ],
            figures: [
              { src: img2('force-accel.png'), alt: 'Four acceleration versus force plots for combinations of accelerometer or cameras with torque sensor or control signal', caption: 'Acceleration versus force for each source combination. With the IMU and torque sensor (top left) the relation is cleanest; with cameras there is more scatter.', wide: true },
            ],
          },
          {
            heading: 'What I left available',
            paragraphs: [
              'Besides the thesis I published a 2D simulator in Python and PyGame to explore the limits of detecting distant points with two cameras, and a C++ program that turns a Bluetooth Xbox controller into ROS messages. The links are above.',
            ],
            figures: [
              { src: img2('simulator.png'), alt: '2D simulator screenshot: a yellow mobile base, the red fields of view of two cameras, colored markers and, at the top, the strip each camera sees', caption: 'The 2D simulator: the mobile base (yellow), the fields of view of the two cameras (red), the colored markers and, at the top, the strip each camera sees.', wide: true },
            ],
          },
        ],
      },
      thegame: {
        title: 'TheGame: from a breadboard Pong to a handheld console on a PCB',
        lead: 'A project in two stages. First SEPong, a working Pong on an ATmega328P on a breadboard, built by a team of two for the Programmable Electronic Systems course (PUC Chile). Then TheGame, the same console idea redesigned as a custom board.',
        facts: [
          ['My role', 'TheGame schematic and PCB; SEPong prototype in a team of two'],
          ['Stack', 'C (avr-gcc, avrdude), ATmega328P, ATmega32U4, Altium'],
          ['Status', 'SEPong working; TheGame at revision 0.1'],
        ],
        sections: [
          {
            heading: 'Stage 1: SEPong, the prototype',
            paragraphs: [
              'The course challenge was to build a video game on an ATmega328P. Instead of using the evaluation kit, we put the bare chip on a breadboard with the minimum it needs to run on its own: a 16 MHz crystal, a 7805 regulator to drop the 9 V battery to 5 V, a reset button and four buttons to move the two paddles.',
              'We loaded the bootloader using another ATmega328 on an Arduino as an ISP programmer, then programmed the chip over serial with an FTDI adapter, using avr-gcc and avrdude. The screen is an ST7735 TFT with a microSD reader: the start and victory images are stored as BMP files on the card and read with Petit FatFs. First to 5 points wins.',
            ],
            figures: [
              { src: img('breadboard.jpg'), alt: 'Pong circuit on a breadboard, with TFT screen, microcontroller and four buttons', caption: 'The breadboard prototype, powered by a 9 V battery.' },
              { src: img('sepong-start.png'), alt: 'SEPong start screen', caption: 'Start screen.' },
              { src: img('sepong-game.png'), alt: 'SEPong game screen with two paddles, the ball and the lives', caption: 'Game screen.' },
            ],
          },
          {
            heading: 'A timing problem',
            paragraphs: [
              'The TFT is slow at redrawing full images, so each frame only updates the pixels that changed. In the first version that update ran inside a while loop, and when more pixels had to change the game slowed down.',
              'We fixed it by moving the update into a timer interrupt with a fixed period, longer than the worst-case drawing time. That keeps the time between frames constant, and it also drives the difficulty: as the match goes on the timer period shrinks and the ball moves faster.',
            ],
          },
          {
            heading: 'Stage 2: TheGame, the console on a board',
            paragraphs: [
              'The SEPong write-up left two improvements pending: shrink it with a PCB and replace the 9 V battery with a smaller one. TheGame (revision 0.1) is that step: the same console, now as a custom board with seven buttons (D-pad, A, B and START), reset and a power button.',
              'The core is an ATmega32U4, which has native USB. The board runs from the micro-USB connector or from a battery: a MOSFET selects the source and a MAX1724 step-up delivers the 3.3 V rail. Power-on is a soft-latching switch built with MOSFETs and driven by a pushbutton, and a voltage supervisor generates the reset for the microcontroller and the screen. The TFT connects through a 24-pin FPC, with the backlight switched by a MOSFET.',
              'Two design details: the USB input has a resettable fuse and protection varistors, and because everything runs at 3.3 V, a note on the schematic reminds to divide the clock to 8 MHz since, per the datasheet, 16 MHz is not allowed at that voltage. An ICSP header is used for programming.',
            ],
            figures: [
              { src: img('pcb-front.png'), alt: '3D render of the TheGame front side: TFT screen, D-pad, A, B, START and reset buttons', caption: 'Front: screen, D-pad, A, B, START, reset and power.' },
              { src: img('pcb-back.png'), alt: '3D render of the TheGame back side: microcontroller, battery holder, micro-USB and ICSP header', caption: 'Back: microcontroller, battery holder, micro-USB and ICSP.' },
              { src: img('schematic.png'), alt: 'TheGame Rev 0.1 schematic split into blocks: voltage selector and step-up, power switch, buttons, reset, microcontroller, TFT and USB', caption: 'Revision 0.1 schematic, organized in blocks.', wide: true },
            ],
          },
        ],
      },
      purifier: {
        title: 'Control board for an air purification unit',
        lead: 'A professional project from 2019: redesigning the control electronics of an air purification unit used in car workshops, which produces ionized oxygen to remove microorganisms and odors. The previous version of the board was failing in the field, and the client needed a board that was more robust, configurable and easy to diagnose, and to own the full hardware and firmware design.',
        facts: [
          ['My role', 'Hardware and firmware design, documentation and testing'],
          ['Stack', 'PIC18F2550, C (MPLAB X, XC8), EAGLE'],
          ['Outcome', '20 kits delivered, in testing in Chile and Mexico'],
        ],
        sections: [
          {
            heading: 'The starting point',
            paragraphs: [
              'There was no documentation for the previous board\'s firmware, so I reconstructed how it worked through tests and circuit analysis. It runs on the vehicle\'s 12 V, uses TRIACs and optocouplers to switch a 220 VAC output for the blower and a 110 VAC output for the ionization board, reports cycles to a GPRS modem that can also lock the unit remotely, and shows the cycle count on a 7-segment display over I2C.',
              'That analysis surfaced the failures the client kept seeing: cycles with the wrong duration, a test mode that ran as a normal cycle, and a counter reset that did not work properly. The requirements were a board that tolerates handling mistakes, run times configurable to each country\'s regulations, documentation for manufacturing, use and diagnosis, and 20 validated kits.',
            ],
          },
          {
            heading: 'Hardware designed for the technician',
            paragraphs: [
              'I kept the PIC18F2550: it was more than enough for the job and made it possible to build updated firmware for the old boards too, and I used its USB port, which the old version ignored. According to the client, the part that failed most was the ULN2003 transistor array. Checking the datasheet and the connections, the load was far below its 500 mA per channel, so the likely cause was wiring mistakes.',
              'So I replaced the one-piece screw terminal blocks, where swapping a board meant unscrewing 17 wires, with two-piece pluggable connectors that come off without touching the wiring, each with a different pin count or pitch so they cannot be swapped. The configuration jumpers, which operators ended up bridging with a screwdriver, became a menu driven by one button and two LEDs. I added diagnostic LEDs on the regulator output, the modem lines and the optocouplers, and wrote a manual with a troubleshooting guide.',
            ],
            figures: [
              { src: img4('layout.jpg'), alt: 'Layout render of the board with the microcontroller, optocouplers, TRIACs and power connectors', caption: 'The new board layout, designed in EAGLE.', wide: true },
              { src: img4('display-board.jpg'), alt: 'Render of a green board with a four-digit seven-segment LCD and a four-pin connector', caption: 'Render of the LCD display board, which connects to the control board over I2C.', wide: true },
            ],
          },
          {
            heading: 'A mistake in the charging circuit',
            paragraphs: [
              'In the first iteration I added a charger for a backup LiPo battery with an MCP73833, with a thermistor that stops charging if the battery gets hot. I missed isolating the battery from the main supply: with the battery and the 12 V both connected, the 5 V rail was shorted to the battery, and since the battery has a much higher impedance, the current went into the charger and burned it.',
              'The fix was an FDFMA2P853, which combines a MOSFET and a Schottky diode: the MOSFET connects the battery only when the regulator\'s 5 V is missing, and the Schottky keeps current from flowing back into that node, with only a 0.4 V drop. In the second iteration the microcontroller also senses the input voltage, a DPDT switch connects the battery only when needed so it does not drain, and at the client\'s request I added a 12 V output driven by a power MOSFET.',
            ],
          },
          {
            heading: 'Firmware',
            paragraphs: [
              'The firmware is written in C with MPLAB X and XC8, around a state machine. Cycle times are measured with a timer interrupt, more accurately than in the previous version. The configuration menu is a second state machine that takes over from the main one: with the button you choose one of four run times (10, 15, 20 or 25 minutes), enable test mode, reset the counter or change the communication mode, and everything is stored in EEPROM. The display alternates the cycle count with a countdown, and without the 12 V input the microcontroller goes to sleep and wakes on an interrupt.',
              'The client wanted to configure units remotely, so I added serial communication with the GPRS modem over the existing hardware: the modem\'s relay and an optocoupler. The optocoupler output inverts the signal, and the PIC\'s UART cannot invert the whole frame, so I wrote an inverted software UART on another timer. The relay\'s bandwidth limits it to about 120 bps. This mode was finished but was not tested in the field.',
              'To update units outside the country, I loaded a bootloader from Microchip\'s libraries, modified to enter update mode with the board\'s button. With a USB cable, a computer and the guide in the manual, any technician can load new firmware.',
            ],
          },
          {
            heading: 'Outcome',
            paragraphs: [
              'Twenty kits were delivered with their documentation and went into testing in Chile and Mexico. Three had faults, at least one from a badly soldered part, which is expected with components this small soldered by hand. If I did it again I would look at cost: with a battery as the supply, the Pi filter and the TVS diode are probably oversized, and the light processing load would allow a cheaper microcontroller.',
            ],
            figures: [
              { src: img4('board-running.jpg'), alt: 'The control board installed in the unit, with diagnostic LEDs lit, pluggable connectors and the LCD display attached', caption: 'One of the boards running in the unit, with the diagnostic LEDs lit and the display attached.', tall: true },
            ],
          },
        ],
      },
      positioner: {
        title: '4-axis positioner for measuring millimeter-wave antennas',
        lead: 'My work as a technical assistant at the UC Center for Astro-Engineering (2016–2018): the control electronics and software of a 4-axis positioner that moves a source and a detector to measure the beam pattern of millimeter-wave sources in the Radio Frequency Laboratory.',
        facts: [
          ['My role', 'Control electronics, motor firmware and measurement scripts'],
          ['Stack', 'ATmega328P, DRV8825, BeagleBone, SPI, Python, SCPI'],
          ['Context', 'UC Center for Astro-Engineering, 2016–2018'],
        ],
        sections: [
          {
            heading: 'The system',
            paragraphs: [
              'The positioner has four axes: linear X and Y, and two rotations, φ, which carries the detector, and θ, which carries the source. A BeagleBone runs the Python scripts and sends commands over SPI to a microcontroller that drives the four stepper motors.',
            ],
            figures: [
              { src: img6('robot.jpg'), alt: 'Positioner with a vertical axis and a rotary stage inside an anechoic enclosure, next to a spectrum analyzer and a power supply', caption: 'The positioner in the anechoic enclosure of the AIUC Radio Frequency Laboratory. Current photo: the system kept evolving after my time there.', wide: true },
              { src: img6('diagram-en.svg'), alt: 'Diagram: the BeagleBone sends commands over SPI to the ATmega328P and queries the spectrum analyzer over SCPI; the ATmega328P reads the limit switches through interrupts and drives four DRV8825 drivers that move the X, Y, φ and θ axes', caption: 'System architecture.', wide: true },
            ],
          },
          {
            heading: 'Motor firmware',
            paragraphs: [
              'The microcontroller (an ATmega328P) acts as an SPI slave with a simple protocol: a sync byte and its acknowledgement, followed by the axis and a 32-bit integer with the steps. It drives four DRV8825 drivers with 1/32 microstepping and linear acceleration and deceleration ramps.',
              'The linear axes have limit switches at both ends, read through pin-change interrupts that stop the motor if a limit is reached. To set zero, each axis approaches quickly in full steps until it hits the switch, then backs off in microsteps until it releases it.',
            ],
          },
          {
            heading: 'Automated measurement',
            paragraphs: [
              'On the BeagleBone, a Python layer models each axis as linear or rotational, converts millimeters and degrees to steps, saves the position to disk so it survives between sessions, and computes the angle needed to aim at a point.',
              'To measure the beam, the script finds the source peak near 145 GHz on a Keysight N9020B spectrum analyzer, controlled over SCPI, then sweeps θ from 0° to 10° in 0.5° steps, logging the power at each position.',
            ],
          },
        ],
      },
      stabilizer: {
        title: '3-axis robotic stabilizer',
        lead: 'A project for the Electrical Design course (PUC Chile, 2017), built in a team of two with Jacob Mellado: a three-degree-of-freedom manipulator that uses a single IMU to keep a camera or phone at a fixed orientation while its base moves in your hand.',
        facts: [
          ['My role', 'Control board, firmware and IMU readout; frame built together'],
          ['Stack', 'ATmega328P, C, BNO055 IMU (I2C), EAGLE, SolidWorks, Simulink'],
          ['Status', 'Working prototype; partly met the specifications'],
        ],
        sections: [
          {
            heading: 'The challenge',
            paragraphs: [
              'The stabilizer had to hold tools up to 15 × 5 × 10 cm, with an orientation error never above 5°, returning to within 1° in under a second after any disturbance. It also needed a way to adjust the reference orientation, and had to be portable and self-contained, with no external sensors around it.',
            ],
          },
          {
            heading: 'Simulate before building',
            paragraphs: [
              'We modeled the frame in SolidWorks, including the motors\' mass, and imported it into Simulink, where the joints become torque-controlled actuators and the orientation can be measured where the IMU would sit. With that model we checked whether a single IMU was enough to control all three axes, with a 0.5 N·m torque limit and Gaussian noise on the measurement.',
              'In the second simulation the reference stays fixed while the base gets sinusoidal torques on all three axes, mimicking a moving hand. The video shows that simulation.',
            ],
            figures: [
              { src: img5('model.png'), alt: 'SolidWorks 3D model of the stabilizer, with dimensions and the camera mounted at the end', caption: 'The frame model in SolidWorks.', tall: true },
              { video: GIMBAL_VIDEO, title: 'Simulink simulation of the stabilizer', caption: 'Simulation with disturbances at the base and a fixed reference.' },
            ],
          },
          {
            heading: 'Electronics and control',
            paragraphs: [
              'I designed the control board around an ATmega328P at 16 MHz. An FT232 lets it be programmed over USB and send telemetry to a computer, an LM7805 regulator brings the 12 V NiMH battery down to 5 V, and a bidirectional level shifter connects the I2C bus of the BNO055 IMU, which runs at 3.3 V. Two L298N H-bridges drive the three 12 V DC motors.',
              'The firmware reads Euler angles and quaternions from the IMU over I2C and runs three PID controllers, one per axis, in a timer interrupt every 5 ms. The derivative is filtered by averaging it with the previous one, and the integral gain is fairly high because a hand does not produce step disturbances: staying close to the reference matters more than reaching it quickly. Pressing a joystick enters adjustment mode, where the two joysticks move the reference of each axis.',
            ],
            figures: [
              { src: img5('control-board.jpg'), alt: 'Fabricated control board with the ATmega328P, an FT232 module, a level shifter and the voltage regulator', caption: 'The fabricated control board.' },
              { src: img5('board-layout.png'), alt: 'EAGLE layout of the 75 by 41 mm control board', caption: 'Its layout in EAGLE.' },
              { src: img5('telemetry.png'), alt: 'Telemetry plots of measured yaw, roll and pitch against their references, next to a 3D view of the orientation', caption: 'USB telemetry: each axis measured against its reference, and the IMU orientation in 3D.', wide: true },
            ],
          },
          {
            heading: 'Frame',
            paragraphs: [
              'The frame is wood, with PLA printed parts where the shape was too complex to make by hand. Printing the whole thing would have taken too long, and this way it stayed light, stiff and cheap: it neither bent nor cracked in use. The electronics sit in separate enclosures so a failed part is easy to swap.',
            ],
            figures: [
              { src: img5('structure.jpg'), alt: 'Wooden frame of the stabilizer during assembly, with the motors mounted', caption: 'The frame during assembly.', wide: true },
            ],
          },
          {
            heading: 'Results and lessons',
            paragraphs: [
              'The stabilizer works within about ±90° of its base position: with a single sensor a change of axes cannot be detected, and gimbal lock appears. It converges quickly to the reference, and joystick adjustment reaches better than one degree. The battery lasts about ten minutes of continuous use.',
              'What fell short was precision. The geared DC motors have almost 5° of backlash that the controller cannot correct, and on the yaw axis the error exceeded the spec. The limit was the actuators, not the control: the next version would use gearless brushless motors, like commercial stabilizers, which did not fit the course budget.',
            ],
          },
        ],
      },
    },
  },
};
