# Devscovery - Backend

Devscovery es un proyecto full-stack que proporciona una API para gestionar usuarios, eventos y asistentes a eventos relaccionados con el desarrollo web. Este repositorio incluye solo el backend, que se encarga de manejar la lógica de negocio, la base de datos, y la autenticación. También se integra con servicios como Cloudinary para la carga de imágenes.

## **Estructura del Proyecto**

- **User**: Módulo que maneja las rutas y funciones relacionadas con los usuarios. Incluye registro, inicio de sesión y gestión de usuarios.
- **Event**: Módulo que maneja las rutas y funciones relacionadas con los eventos. Permite crear, obtener, actualizar y eliminar eventos.
- **EventAttendees**: Módulo que gestiona los asistentes a los eventos, permitiendo agregar o eliminar asistentes de un evento.
- **Seeds**: Archivos para cargar datos iniciales (usuarios y eventos) en la base de datos.
- **Data**: Carpeta que contiene los datos de ejemplo de usuarios y eventos para la base de datos.
- **Middlewares**: Contiene middlewares para autenticación, autorización y manejo de imágenes. Incluye:
  - **auth**: Middleware para verificar que el usuario esté autenticado y si tiene rol de administrador.
  - **file**: Middleware para manejar la carga de imágenes utilizando Cloudinary.
- **Functions**: Funciones auxiliares para eliminar imágenes y manejar tokens JWT.

## **Scripts**

**npm run dev**: Inicia el servidor.

```bash
npm run dev
```

**npm run mainSeed**: Carga los datos iniciales de usuarios y eventos en la base de datos.

```bash
npm run mainSeed
```

## **Carpeta de datos (Data)**

Los datos de ejemplo para usuarios y eventos están dentro de la carpeta data. Los archivos users.js y events.js contienen los datos que se usarán para inicializar la base de datos al ejecutar el script mainSeed.

## **Endpoints**

**Usuarios (User)**
| Método | Ruta | Descripción |
| ------ | ----------------- | --------------------------------------- |
| POST | `/api/v1/users/login` | Inicia sesión de un usuario y devuelve un token JWT. |
| POST | `/api/v1/users/register` | Crea un nuevo usuario en el sistema. |
| GET | `/api/v1/users` | Obtiene una lista de todos los usuarios registrados. |
| GET | `/api/v1/users:id` | Obtiene los detalles de un usuario por su ID. |
| PUT | `/api/v1/users:id` | Actualiza los datos de un usuario. |
| DELETE | `/api/v1/users/:id` | Elimina un usuario del sistema. |

**Eventos (Event)**
| Método | Ruta | Descripción |
| ------ | ----------------- | --------------------------------------- |
| GET | `/api/v1/events` | Obtiene todos los eventos registrados.|
| GET | `/api/v1/events/:id` | Obtiene los detalles de un evento por su ID. |
| POST | `/api/v1/events` | Crea un nuevo evento.|
| PUT | `/api/v1/events/:id` | Actualiza los detalles de un evento. |
| DELETE | `/api/v1/events/:id` | Elimina un evento del sistema. |

**Asistentes a Eventos (EventAttendees)**
| Método | Ruta | Descripción |
| ------ | ----------------- | --------------------------------------- |
| PUT | `/api/v1/events/:id` | Actualiza los asistentes de un evento. |

## **Middlewares**

**auth**
Los middlewares de autenticación protegen las rutas que requieren que el usuario esté autenticado. Existen dos middlewares:

- **isAuth**: Verifica que el usuario esté autenticado.
- **isAdmin**: Verifica que el usuario sea administrador.
  Ambos middlewares se utilizan para proteger rutas sensibles como la creación, edición o eliminación de eventos y usuarios.

**file**
Este middleware gestiona la carga de imágenes utilizando Cloudinary. Es utilizado en las rutas donde se manejan imágenes para ser almacenados en la nube.

## **Funciones (Functions)**

**deleteFile**
Función que permite eliminar imágenes de Cloudinary cuando ya no son necesarios, ayudando a mantener el espacio en la nube.

**JWT**
La autenticación se maneja mediante JSON Web Tokens (JWT). El token se genera cuando un usuario inicia sesión correctamente y debe ser enviado en el encabezado authorization para acceder a rutas protegidas.

## **Repositorio Frontend**

Este backend tiene un frontend completo disponible en otro repositorio [FRONT-proyecto-10-devscovery](https://github.com/marugandev/FRONT-proyecto-10-devscovery). El frontend está diseñado para consumir esta API y proporcionar una interfaz para gestionar y visualizar los usuarios, eventos y asistentes a eventos.

El repositorio del frontend contiene su propio README.
