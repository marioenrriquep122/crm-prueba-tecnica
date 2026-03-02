import requests
import logging

logger = logging.getLogger(__name__)

RESTCOUNTRIES_URL = "https://restcountries.com/v3.1"


def get_country_info(country_name: str) -> dict:
    """
    Consulta información de un país por nombre.
    Retorna dict con info o error manejado.
    """
    try:
        response = requests.get(
            f"{RESTCOUNTRIES_URL}/name/{country_name}",
            timeout=5  # timeout de 5 segundos
        )
        response.raise_for_status()
        data = response.json()

        if data and len(data) > 0:
            country = data[0]
            return {
                "success": True,
                "nombre": country.get("name", {}).get("common", "N/A"),
                "capital": country.get("capital", ["N/A"])[0] if country.get("capital") else "N/A",
                "poblacion": country.get("population", 0),
                "region": country.get("region", "N/A"),
                "bandera": country.get("flags", {}).get("png", ""),
                "moneda": _extract_currency(country),
                "idioma": _extract_language(country),
            }
        return {"success": False, "error": "País no encontrado"}

    except requests.exceptions.Timeout:
        logger.warning(f"Timeout consultando país: {country_name}")
        return {"success": False, "error": "Tiempo de espera agotado"}
    except requests.exceptions.ConnectionError:
        logger.error("Error de conexión con RestCountries")
        return {"success": False, "error": "No se pudo conectar con el servicio"}
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error: {e}")
        return {"success": False, "error": f"Error del servicio: {e.response.status_code}"}
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return {"success": False, "error": "Error inesperado"}


def _extract_currency(country: dict) -> str:
    currencies = country.get("currencies", {})
    if currencies:
        code = list(currencies.keys())[0]
        name = currencies[code].get("name", code)
        return f"{name} ({code})"
    return "N/A"


def _extract_language(country: dict) -> str:
    languages = country.get("languages", {})
    if languages:
        return ", ".join(list(languages.values())[:2])
    return "N/A"