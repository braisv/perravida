# API Rest Perra Vida

_Desarrollo de API con un simple CRUD de usuarios y listado de amigos para una ficticia red social de personas que adoran los perros._



## Instalación 🔧

Para instalar todas las dependencias, será necesario ejecutar el siguiente comando en la consola:

```
npm i
```

Para crear el esquema de base de datos, el script ejecutará las sentencias escritas en el fichero createSchema.sql de la misma carpeta. para ejecutarlo sería de la siguiente forma:

```
npm run create-db
```

## Despliegue 📦

Para desplegar en local el proyecto, será necesario ejecutar el siguiente comando en la consola:

```
npm start
```

## Endpoints 🍺

```
/users
```
- GET: devuelve todos los usuarios.
- POST: añade un usuario nuevo. Requiere: username, email, password, language, longitude, latitude.
- PUT: actualiza un usuario. Requiere: id, username, email, password, language, longitude, latitude.
```
/users/:id
```
- GET: devuelve un usuario.
- DELETE: elimina un usuario.
```
/friends/:id
```
- GET: devuelve el nombre de los amigos de un usuario.
```
/friends/:id/count
```
- GET: devuelve el número de amigos de un usuario.