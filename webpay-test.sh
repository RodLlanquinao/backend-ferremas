#!/bin/bash

# ============================================================
#  WEBPAY TEST - Script para generar y abrir página de pago
# ============================================================
#
# Este script:
# 1. Realiza una petición a la API para crear una transacción
# 2. Guarda la respuesta HTML en un archivo
# 3. Abre el archivo en el navegador predeterminado
#
# DATOS DE PRUEBA PARA TRANSBANK:
# ------------------------------
# Tarjeta de Crédito VISA (Aprobada):
#   Número: 4051 8856 0044 6623
#   CVV: 123
#   Fecha expiración: Cualquiera en el futuro
#   
# Tarjeta de Débito (Aprobada):
#   Número Tarjeta: 4051 8842 3993 7763
#
# Autenticación para tarjeta de crédito (Aprobada): 
#   RUT: 11.111.111-1
#   Clave: 123
#
# Autenticación para tarjeta de débito (Aprobada):
#   Número Tarjeta: 4051 8842 3993 7763
#   RUT: 11.111.111-1
#   Clave: 123
#
# Para RECHAZAR un pago use:
#   Tarjeta: 5186 0595 5959 0568
#   CVV: 123
#   Expiración: Cualquiera en el futuro

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Archivo de salida
OUTPUT_FILE="webpay-payment.html"
SERVER_URL="http://localhost:3000"

# Función para mostrar mensajes de error y salir
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Función para mostrar mensajes informativos
info() {
    echo -e "${BLUE}INFO: $1${NC}"
}

# Función para mostrar mensajes de éxito
success() {
    echo -e "${GREEN}ÉXITO: $1${NC}"
}

# Solicitar ID de pedido
echo -e "${YELLOW}Ingrese el ID del pedido que desea pagar:${NC}"
read PEDIDO_ID

if [ -z "$PEDIDO_ID" ]; then
    error_exit "El ID del pedido es requerido."
fi

if ! [[ "$PEDIDO_ID" =~ ^[0-9]+$ ]]; then
    error_exit "El ID del pedido debe ser un número."
fi

# Verificar que el servidor esté en ejecución
info "Verificando que el servidor esté en ejecución..."
if ! curl -s --head "$SERVER_URL" > /dev/null; then
    error_exit "No se puede conectar al servidor. Asegúrese de que esté en ejecución en $SERVER_URL"
fi

# Realizar la petición
info "Solicitando página de pago para el pedido $PEDIDO_ID..."
HTTP_CODE=$(curl -s -o "$OUTPUT_FILE" -w "%{http_code}" \
    -X POST "$SERVER_URL/api/webpay/crear-transaccion" \
    -H "Content-Type: application/json" \
    -d "{\"pedido_id\": $PEDIDO_ID}")

# Verificar el código de respuesta HTTP
if [ "$HTTP_CODE" != "200" ]; then
    # Si la respuesta no es 200 OK, pero tenemos contenido, mostrarlo
    if [ -s "$OUTPUT_FILE" ]; then
        ERROR_MSG=$(grep -o '"error":"[^"]*"' "$OUTPUT_FILE" | cut -d'"' -f4)
        if [ -n "$ERROR_MSG" ]; then
            error_exit "Error del servidor: $ERROR_MSG (HTTP $HTTP_CODE)"
        else
            error_exit "Error del servidor: Código HTTP $HTTP_CODE. Revise el archivo $OUTPUT_FILE para más detalles."
        fi
    else
        error_exit "Error del servidor: Código HTTP $HTTP_CODE. No se recibió respuesta."
    fi
fi

# Verificar si la respuesta es HTML
if ! grep -q "<!DOCTYPE html>" "$OUTPUT_FILE"; then
    error_exit "La respuesta no es un archivo HTML válido. Revise el archivo $OUTPUT_FILE para más detalles."
fi

# Extraer información relevante del HTML para mostrar
TOKEN=$(grep -o 'name="token_ws" value="[^"]*"' "$OUTPUT_FILE" | cut -d'"' -f4)
ORDEN=$(grep -o '<p><strong>Orden:</strong> [^<]*</p>' "$OUTPUT_FILE" | sed 's/<[^>]*>//g' | sed 's/Orden: //g')
MONTO=$(grep -o '<p><strong>Monto:</strong> [^<]*</p>' "$OUTPUT_FILE" | sed 's/<[^>]*>//g' | sed 's/Monto: //g')

# Mostrar información
success "Página de pago generada correctamente en: $OUTPUT_FILE"
echo -e "${YELLOW}Detalles de la transacción:${NC}"
echo -e "  - Pedido: ${YELLOW}$PEDIDO_ID${NC}"
echo -e "  - Orden: ${YELLOW}$ORDEN${NC}"
echo -e "  - Monto: ${YELLOW}$MONTO${NC}"
echo -e "  - Token: ${YELLOW}${TOKEN:0:10}...${TOKEN: -10}${NC}"

# Abrir el archivo en el navegador predeterminado
info "Abriendo la página de pago en su navegador..."
open "$OUTPUT_FILE" || error_exit "No se pudo abrir el navegador automáticamente. Abra manualmente el archivo $OUTPUT_FILE"

success "Proceso completado. Se ha abierto la página de pago en su navegador."
echo -e "${YELLOW}Recuerde utilizar los datos de prueba que aparecen en los comentarios del script para completar el pago.${NC}"
echo -e "${BLUE}Si el navegador no se abrió automáticamente, abra manualmente el archivo:${NC}"
echo -e "${GREEN}$PWD/$OUTPUT_FILE${NC}"

# Instrucciones para salir
echo ""
echo -e "${BLUE}===============================================${NC}"
echo -e "${YELLOW}Para realizar otro pago, ejecute este script nuevamente.${NC}"
echo -e "${BLUE}===============================================${NC}"

