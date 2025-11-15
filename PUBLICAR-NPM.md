# Cómo Publicar CodeScanner en npm

Para que CodeScanner se pueda instalar fácilmente con `npm install -g codescanner`, necesitas publicarlo en el registro de npm.

## Requisitos Previos

1. **Cuenta en npm**: Crea una cuenta en [npmjs.com](https://www.npmjs.com/signup)
2. **Verificar nombre disponible**: El nombre `codescanner` debe estar disponible

## Pasos para Publicar

### 1. Verificar que el nombre está disponible

```bash
npm search codescanner
```

Si no aparece nada, el nombre está disponible.

### 2. Iniciar sesión en npm

```bash
npm login
```

Te pedirá:
- Username (tu nombre de usuario de npm)
- Password (tu contraseña)
- Email (tu email)

### 3. Verificar que estás logueado

```bash
npm whoami
```

Debería mostrar tu nombre de usuario.

### 4. Publicar el paquete

Desde la carpeta `backend`:

```bash
cd backend
npm publish
```

## Después de Publicar

Una vez publicado, cualquiera podrá instalar CodeScanner con:

```bash
npm install -g codescanner
```

Y usarlo desde cualquier terminal:

```bash
codescanner archivo.js
codescanner src/
```

## Actualizar Versión

Para publicar una nueva versión:

1. **Actualizar la versión en package.json**:
   ```json
   "version": "1.0.1"
   ```

2. **Publicar de nuevo**:
   ```bash
   npm publish
   ```

O usar npm version para actualizar automáticamente:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
npm publish
```

## Notas Importantes

- **Nombre único**: Si `codescanner` ya está tomado, usa otro nombre como `@tu-usuario/codescanner` o `codescanner-cli`
- **Versión**: Cada publicación debe tener un número de versión diferente
- **Público por defecto**: Los paquetes en npm son públicos por defecto (gratis)
- **No se puede eliminar**: Una vez publicado, no puedes eliminar versiones (solo despublicar)

## Alternativa: Usar Scope

Si quieres mantener el paquete bajo tu organización:

1. **Actualizar package.json**:
   ```json
   "name": "@tu-usuario/codescanner"
   ```

2. **Instalación**:
   ```bash
   npm install -g @tu-usuario/codescanner
   ```

3. **Uso**:
   ```bash
   codescanner archivo.js
   ```

## Verificar Publicación

Después de publicar, verifica que esté disponible:

```bash
npm view codescanner
```

O visita: `https://www.npmjs.com/package/codescanner`

