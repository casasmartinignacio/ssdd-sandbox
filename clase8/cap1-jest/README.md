# Biblioteca: base del capítulo 1 (Jest: pruebas unitarias y e2e)

API de una biblioteca universitaria con tres recursos: **libros**, **socios** y **préstamos**.
Los datos viven en memoria (se pierden al reiniciar). El enunciado, con las reglas de negocio,
está en el capítulo 1 del manual; este repositorio es solo el punto de partida.


## Uso

```
npm install
npm run start:dev      # http://localhost:3000
npm test               # tests unitarios (src/**/*.spec.ts)
npm run test:e2e       # tests e2e (test/*.e2e-spec.ts)
```

Requiere Node.js 22.22 o superior.
Si usa Windows PowerShell, los scripts funcionan igual: están definidos en `package.json`.
