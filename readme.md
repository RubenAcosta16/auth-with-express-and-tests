# Sistema de Autenticación con Arquitectura Hexagonal

Este proyecto es un sistema de autenticación que incluye rutas protegidas y soporte para roles de usuario.

Está desarrollado utilizando **Express js** y varias librerías que facilitaron el proceso de desarrollo. Sin embargo, lo realmente importante es que implementé **arquitectura hexagonal**, lo cual permite una mejor organización del código, manteniendo separadas las responsabilidades de manera correcta.

Una gran ventaja de usar esta arquitectura es la **facilidad para migrar a otro framework**: simplemente cambiando la capa de infraestructura, sin tocar la lógica de dominio o aplicación. En los módulos de dominio y aplicación no se utilizan librerías externas, evitando dependencias innecesarias.
Ademas de que asi se crea una aplicación mas escalable y fácil de mantener.

Lo que hace especial a este proyecto es que ahora implemente unos tests para la capa de infraestructura y aplicación de los módulos User y Auth, asi quedando un proyecto mas completo.

---

## Rutas disponibles

### Registro usuario

**POST** `/api/v1/auth/register`

**Body:**

```json
{
  "name": "Test",
  "email": "test@g.com",
  "password": "12345678",
  "role":"User" | "Admin"
}
```

**Respuesta:**  
`Status: 200 - void`

---
Cualquier usuario ya sea autenticado o no puede crear uno de rol User, pero un Admin solo lo puede crear un usuario logeado con Admin
---


### Login

**POST** `/api/v1/auth/login`

**Body:**

```json
{
  "email": "test@g.com",
  "password": "12345678"
}
```

**Respuesta:**  
`Status: 200 - void`

---

### Logout

**POST** `/api/v1/auth/logout`

**Body:**

```json
{}
```

**Respuesta:**  
`Status: 200 - token`

---

### Rutas Protegidas

**GET** `/api/v1/auth/protected`

(Se debe enviar la cookie de autenticación)

**Body:**

```json
{}
```

**Respuesta:**  
`Status: 200 - void`

---

**GET** `/api/v1/auth/admin`

(Se debe enviar la cookie de autenticación)

**Body:**

```json
{}
```

**Respuesta:**  
`Status: 200 - void`

---

## Notas adicionales

También implementé rutas para hacer un **CRUD de usuarios** con fines de práctica.  
Sin embargo, **desactivé la integración de este CRUD en el módulo principal**, ya que no es una buena idea exponer un recurso tan crítico de manera tan accesible.

Si deseas utilizar el CRUD de usuarios, simplemente **descomenta el import** y agrégalo a la configuración de los imports del módulo principal.
