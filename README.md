# MEIC — Manejamos tu Energía

Informe de negocio para el desarrollo de la landing page de **MEIC (Mantenimiento Electromecánico Industrial y Comercializadora)**. Este documento reúne toda la información del cliente para que el desarrollador tenga el contexto necesario antes de empezar a construir la página.

---

## 1. Sobre el negocio

**Nombre:** MEIC — Manejamos tu Energía
**Rubro:** Mantenimiento Electromecánico Industrial, Ingeniería y Comercializadora
**Origen:** Empresa mexicana
**Contacto principal:** Ing. Nepthaly Misael Espinoza Montero (Atención Personal)

### Quiénes somos
Empresa mexicana con más de 15 años de experiencia en el Mantenimiento Electromecánico Industrial, generando confianza, eficacia y calidad en sus servicios. Calidad, seguridad y confianza los caracteriza.

### Misión
Brindar energía segura y confiable, comprometidos con la excelencia en el servicio de mantenimiento electromecánico, construyendo confianza con los clientes y garantizando seguridad y calidad en los servicios.

### Visión
Ser líderes en soluciones energéticas sostenibles, impulsando el progreso y la innovación para un futuro brillante y confiable.

### Eslogan
> "Manejamos tu Energía"

---

## 2. Servicios que ofrece

### Servicios electromecánicos
- Instalaciones eléctricas industriales, comerciales y residenciales (bajo norma)
- Proyectos e ingeniería eléctrica
- Cálculo y diseño eléctrico
- Automatización, control y PLC
- Tableros de control y de potencia
- Alumbrado industrial y público
- Mantenimiento general
- Mantenimiento a subestaciones eléctricas y transformadores / variadores
- Plantas de emergencia
- Diseño en AutoCAD y Revit
- Análisis energético y diagramas
- Energías renovables
- Reparaciones mecánicas, hidráulicas y neumáticas
- Suministro e instalación de aire acondicionado
- Mantenimiento y reparación de motores eléctricos
- Variadores, bombas, grúas viajeras y maquinaria industrial

### Servicios de maquinaria pesada y construcción
- Sistemas hidráulicos y mangueras de alta presión / conexiones
- Reparación de sistemas eléctricos
- Torno y reparación de piezas (piezas de CNC)
- Reparación de marchas y alternadores
- Cables de acero de alta resistencia
- Renta de maquinaria para obra
- Elaboración de sellos hidráulicos de alta presión
- Baleros, cremalleras y sellos especiales
- Pruebas en bancos hidráulicos
- Reparación de compresores neumáticos
- Reparación de compactadoras, generadores, vibradores de concreto y más

### Comercializadora
MEIC también opera como comercializadora de refacciones, piezas y maquinaria relacionada con estos servicios.

---

## 3. Datos de contacto

| Medio | Dato |
|---|---|
| Teléfono | 720 354 9575 |
| WhatsApp | 722 805 8043 |
| Correo | meicmanejamostuenergia@gmail.com |
| Atención personal | Ing. Nepthaly Misael Espinoza Montero |

*(Estos datos deben integrarse en la sección de contacto / footer de la landing page.)*

---

## 4. Recursos disponibles

Todo el material de referencia entregado por el cliente está en la carpeta [`imagenes/`](imagenes/):

- **Logo de MEIC** (variantes en JPEG) — usado como identidad visual principal.
- `MEIC SERVICIOS.pdf` — brochure de servicios.
- `PRESENTACION MEIC.pdf` — presentación institucional (quiénes somos, misión, visión, servicios, evidencia fotográfica de trabajos realizados, datos de contacto).

Toda la información necesaria del negocio para construir el contenido de la landing (textos, servicios, misión/visión, contacto, fotos de evidencia de trabajo) se encuentra en esos archivos.

### ⚠️ Importante — Logo
El logo disponible tiene **fondo blanco/gris**, no transparente. Antes de usarlo en la web, el desarrollador debe **quitarle el fondo** (por ejemplo con [remove.bg](https://www.remove.bg/)) para poder integrarlo correctamente sobre header, footer, pantalla de carga, favicon, etc.

---

## 5. Alcance técnico del proyecto

- El desarrollo se hará **sobre una plantilla HTML existente**, adaptándola a la marca e información de MEIC (no se construye desde cero).
- El desarrollador trabajará apoyándose en **Claude** para hacer los cambios sobre la plantilla.
- El **prompt inicial** para adaptar la plantilla al negocio lo proporciona el cliente/gestor del proyecto por separado (no forma parte de este documento). Ese prompt es el punto de partida, pero **no es el resultado final**.

### Requisitos a considerar al trabajar con Claude sobre la plantilla

1. **Pantalla de carga (loading screen):** la landing debe incluir una pantalla de carga al inicio, antes de mostrar el contenido principal.
2. **Estilo visual:** el resultado debe transmitir un estilo **premium, enterprise/empresarial, elegante y sofisticado** — acorde a una empresa de ingeniería industrial con 15+ años de experiencia. Debe indicarse explícitamente a Claude que aplique este tipo de estética (paletas sobrias, tipografía cuidada, espaciados generosos, transiciones suaves, sensación de solidez y confianza).
3. **Iteración post-prompt inicial:** el prompt inicial es solo el punto de partida. Se espera que el desarrollador **itere con Claude en varias rondas** después de la primera generación —ajustando estilos, detalles visuales, jerarquía de contenido, animaciones, responsive, etc.— hasta alcanzar el nivel de acabado premium/enterprise esperado. No se debe dar por terminado el trabajo con el resultado del primer prompt.
4. **Logo sin fondo:** una vez removido el fondo del logo (remove.bg u otra herramienta), integrarlo en header, footer y pantalla de carga.
5. **Contenido real del negocio:** todos los textos (quiénes somos, misión, visión, servicios, contacto) deben basarse en la información de este README y de los PDFs en `imagenes/`, no usar contenido genérico de relleno.
