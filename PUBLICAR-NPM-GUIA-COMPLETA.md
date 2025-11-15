# Guía Completa: Publicar CodeScanner en npm (Equivalente a pip para Node.js)

## ¿Por qué npm y no pip?

- **pip** → Para paquetes de **Python**
- **npm** → Para paquetes de **Node.js** (tu proyecto)

Tu proyecto CodeScanner está en **Node.js/JavaScript**, por lo que se publica en **npm**, no en pip.

## Pasos para Publicar en npm

### Paso 1: Crear cuenta en npm

1. Ve a [npmjs.com](https://www.npmjs.com/signup)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Verificar que el nombre está disponible

```bash
npm search codescanner
```

Si no aparece nada o aparece "No matches found", el nombre está disponible.

**Nota:** Si `codescanner` ya está tomado, puedes usar:
- `codescanner-cli`
- `@tu-usuario/codescanner` (scope personal)
- `codescanner-security`

### Paso 3: Iniciar sesión en npm

```bash
npm login
```

Te pedirá:
- Username (tu nombre de usuario de npm)
- Password (tu contraseña)
- Email (tu email)

### Paso 4: Verificar que estás logueado

```bash
npm whoami
```

Debería mostrar tu nombre de usuario.

### Paso 5: Preparar el paquete

Asegúrate de estar en la carpeta `backend`:

```bash
cd backend
```

Verifica que el `package.json` esté correcto (ya lo está).

### Paso 6: Publicar

```bash
npm publish
```

**¡Listo!** Tu paquete estará disponible en npm.

## Después de Publicar

Cualquiera podrá instalar CodeScanner con:

```bash
npm install -g 2jgoatscanner
```

**Nota:** El paquete se publicó con el nombre `2jgoatscanner` porque el nombre `codescanner` ya estaba tomado.

Y usarlo desde cualquier terminal:

```bash
codescanner archivo.js
codescanner src/
```

## Verificar Publicación

Después de publicar, verifica que esté disponible:

```bash
npm view codescanner
```

O visita: `https://www.npmjs.com/package/codescanner`

## Actualizar Versión

Para publicar una nueva versión:

1. **Actualizar la versión en package.json:**
   ```json
   "version": "1.0.1"
   ```

2. **Publicar de nuevo:**
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

- **Nombre único**: Si `codescanner` ya está tomado, npm te dirá y tendrás que usar otro nombre
- **Versión**: Cada publicación debe tener un número de versión diferente
- **Público por defecto**: Los paquetes en npm son públicos por defecto (gratis)
- **No se puede eliminar**: Una vez publicado, no puedes eliminar versiones (solo despublicar)

## Comparación: pip vs npm

| Python | Node.js (tu proyecto) |
|--------|------------------------|
| `pip install paquete` | `npm install paquete` |
| PyPI | npm registry |
| `python script.py` | `node script.js` |

## Alternativa: Usar Scope

Si quieres mantener el paquete bajo tu organización:

1. **Actualizar package.json:**
   ```json
   "name": "@tu-usuario/codescanner"
   ```

2. **Instalación:**
   ```bash
   npm install -g @tu-usuario/codescanner
   ```

3. **Uso:**
   ```bash
   codescanner archivo.js
   ```

