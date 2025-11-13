ShopMaster E-Commerce

🛒 Descripción del Proyecto

ShopMaster E-Commerce es un proyecto de tienda virtual (e-commerce) desarrollado como práctica de programación web, utilizando una arquitectura de front-end puro.

El proyecto simula una experiencia de compra completa, permitiendo al usuario navegar por un catálogo de productos, ver detalles, agregar ítems a un carrito de compras persistente (usando localStorage) y, finalmente, simular un proceso de pago con la generación de un recibo en formato PDF.

Características Principales:

Catálogo Dinámico: Los productos se obtienen en tiempo real de una API externa (FakeStoreAPI).

Gestión de Carrito: Funcionalidad completa para agregar, modificar la cantidad y eliminar productos del carrito.

Persistencia de Datos: El carrito se guarda en el navegador (localStorage) para mantener la sesión.

Simulación de Pago: Incluye un formulario de pasarela de pago simulada.

Generación de Recibos: Después del pago, se genera y descarga automáticamente un ticket de compra en formato PDF (simulando un recibo térmico) para el cliente.

🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando tecnologías fundamentales de desarrollo web del lado del cliente.

Tecnología

Rol en el Proyecto

HTML5

Estructura y maquetado principal del sitio.

CSS3

Estilos personalizados, incluyendo la tipografía y el diseño responsive.

JavaScript (ES6+)

Lógica funcional, manipulación del DOM, gestión del carrito y comunicación con la API.

Bootstrap 5.3

Framework CSS/JS para un diseño responsive rápido y componentes de interfaz (navbar, cards, modales).

Font Awesome

Librería de iconos vectoriales para mejorar la usabilidad (ej. icono del carrito).

jsPDF

Librería de JavaScript utilizada para generar dinámicamente el ticket de compra en formato PDF.

FakeStoreAPI

API pública utilizada como fuente de datos para el catálogo de productos.

🖼️ Capturas de Pantalla

A continuación, se presentan algunas capturas de pantalla de la aplicación:

Home - Catálogo de Productos

Detalle del Producto

Carrito de Compras







🚀 Instrucciones de Instalación y Despliegue

1. Instalación Local

El proyecto es un sitio estático y no requiere un servidor de backend.

Clonar el Repositorio:

git clone [https://github.com/tu_usuario/shopmaster-ecommerce.git](https://github.com/tu_usuario/shopmaster-ecommerce.git)
cd shopmaster-ecommerce


Estructura de Archivos: Asegúrate de que los siguientes archivos estén en la carpeta raíz:

index.html (Estructura)

style.css (Estilos)

script.js (Lógica)

Visualización: Abre el archivo index.html directamente en tu navegador web. Recomendado: Utiliza la extensión Live Server en VS Code para una mejor experiencia de desarrollo.

2. Despliegue Público (Hosting Estático)

El proyecto puede ser desplegado fácilmente usando servicios de hosting estático como GitHub Pages o Vercel.

A. Despliegue con GitHub Pages

Sube los tres archivos (.html, .css, .js) a un repositorio público en GitHub (ej: shopmaster-ecommerce).

Ve a Settings > Pages en tu repositorio.

Selecciona la rama principal (main) y la carpeta raíz (/) como fuente de despliegue.

Tu sitio estará en vivo en la URL provista por GitHub (ej: https://tu-usuario.github.io/shopmaster-ecommerce).

B. Despliegue con Vercel

Conecta tu cuenta de Vercel con GitHub.

En el dashboard de Vercel, selecciona Add New > Project e Importa el repositorio shopmaster-ecommerce.

Vercel detectará que es un proyecto HTML/CSS/JS y lo desplegará automáticamente, proporcionando una URL en segundos.

👥 Créditos y Licencias

Sustentante/Autor: Isaac Jimenez Rodríguez

Matrícula: 23-SISN-8-028

Asignatura: Inteligencia Artificial (Proyecto 4)

Maestro: Juancito Peña

Institución: Universidad Dominicana O&M

Este proyecto es una práctica educativa y se proporciona bajo la licencia estándar MIT (o la que consideres más adecuada para tu trabajo).

Nota: Este proyecto utiliza la API de prueba https://fakestoreapi.com/ para obtener datos de productos. Los pagos son simulados y no procesan transacciones reales.
