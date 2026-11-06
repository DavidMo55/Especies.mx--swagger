# Especies.mx — API interna

Contrato propuesto OpenAPI 3.1 de los 21 endpoints originales, con mTLS, trazabilidad y errores Problem Details. No implementa backend, BD, TLS ni emisión de certificados. El servidor local solo publica documentación.

## Ejecutar

```sh
npm ci
npm start
```

Abrir http://localhost:8080. Puerto alternativo: `PORT=8081 npm start`. Detener con Ctrl+C. Editar `openapi.json` y recargar.

## Seguridad y respuestas

El backend de la web pública presenta certificado X.509 y conserva la clave privada. mTLS ocurre en TLS; no se configura como header. Identidad sin permiso: 403. Fallo TLS previo a HTTP: no se garantiza respuesta HTTP/JSON. Swagger UI mantiene la ejecución desactivada.

Todas las respuestas HTTP incluyen X-Request-ID, X-Request-Received-At, Date y Cache-Control: no-store. El UUID y timestamp del cuerpo coinciden con los headers de recepción. Date corresponde a generación. Request ID ausente o inválido se reemplaza.

Éxito: application/json con data y meta. Listas paginadas: meta.pagination; page empieza en 1, page_size 24 (máximo 100). API-09 conserva limit y usa 20 por defecto. Colecciones vacías: 200; recurso padre o selección ausente: 404. Errores: application/problem+json con type, title, status, detail, instance, code, request_id y timestamp. 405 incluye Allow: GET; 429 y 503 incluyen Retry-After en segundos.

Ejemplo de cliente, solo cuando el sandbox esté desplegado y existan certificados:

```sh
curl --cert cliente.crt --key cliente.key \
  -H 'Accept: application/json, application/problem+json' \
  'https://api.sandbox.especies.mx/api/v1/descubrir?grupo=animales&page=1&page_size=24'
```

Si el servidor usa CA privada, agregar --cacert ca.crt. No usar --insecure.

## Decisiones propuestas pendientes

- Selección diaria: almacenamiento, editor, zona horaria y prevención de vigencias superpuestas. Se conserva API-02 diaria; la tarjeta semanal del PDF sirve como referencia de contrato.
- Confirmar DDL, valores de estados publicables, rangos y formato de ancestry; no usar búsquedas parciales de cadenas para pertenencia taxonómica.
- Validar campos y catálogos de riesgo, endemismo, calidad, secciones y referencias.
- Aprobar criterios de especies relacionadas, orden aleatorio reproducible y selección de imagen/nombre común. Preferir nombre primario en español y medio principal autorizado; desempates por id.
- Crear/alimentar taxon_distributions con procedencia validada. Definir política de coordenadas sensibles y calidad antes de implementar mapas o distancias.
- API-21 requiere ip del visitante porque mTLS proviene del backend; no usar su IP de conexión como visitante. Aprobar proveedor y privacidad. Validar IPv4/IPv6 públicas; no registrar IP completa en logs.
- Límites de solicitudes y permisos por cliente pendientes de operación.

## Compatibilidad

Cambio de contrato 0.1 a 0.2: mTLS obligatorio, IDs como cadenas, campos de tarjeta en inglés, paginación dentro de meta y errores Problem Details. Las rutas y funciones del catálogo se conservan. Los enlaces de especies identifican conceptos taxonómicos, no perfiles. Todos los ejemplos son ilustrativos.

## Catálogo

| ID | Método y ruta | Función |
|---|---|---|
| API-01 | GET /api/v1/buscar | Búsqueda general |
| API-02 | GET /api/v1/especies/del-dia | Especie del día |
| API-03 | GET /api/v1/explorar | Explorar especies |
| API-04 | GET /api/v1/explorar/filtros | Opciones de filtros |
| API-05 | GET /api/v1/explorar/mapa | Mapa de exploración |
| API-06 | GET /api/v1/patrimonio | Patrimonio biocultural |
| API-07 | GET /api/v1/descubrir | Descubrir especies |
| API-08 | GET /api/v1/especies/aleatorias | Especies aleatorias |
| API-09 | GET /api/v1/especies/listado | Listado completo (Ver +) |
| API-10 | GET /api/v1/especies/{id} | Ficha de especie |
| API-11 | GET /api/v1/especies/{id}/secciones | Secciones descriptivas |
| API-12 | GET /api/v1/especies/{id}/distribucion | Distribución geográfica |
| API-13 | GET /api/v1/especies/{id}/usos | Usos de especie |
| API-14 | GET /api/v1/especies/{id}/taxonomia | Taxonomía |
| API-15 | GET /api/v1/especies/{id}/multimedia | Multimedia |
| API-16 | GET /api/v1/especies/{id}/interacciones | Interacciones ecológicas |
| API-17 | GET /api/v1/especies/{id}/referencias | Referencias científicas |
| API-18 | GET /api/v1/especies/{id}/relacionadas | Especies relacionadas |
| API-19 | GET /api/v1/especies/{id}/ocurrencias | Ocurrencias de especie |
| API-20 | GET /api/v1/especies/cercanas | Especies cercanas |
| API-21 | GET /api/v1/ubicacion/aproximada | Ubicación aproximada |

Estándares: https://spec.openapis.org/oas/v3.1.0.html y RFC 9457.
