const express = require('express');
const router = express.Router();
const { findBusRoutes } = require('../services/routesService');
const { getRoute } = require('../services/routeService');


router.get('/routes', async (req, res) => {
  const { start, end, maxDistance } = req.query;

  console.log(maxDistance);
  if (!start || !end) {
    return res.status(400).send('Missing start or end coordinates');
  }

  let startCoords, endCoords;

  try {
    startCoords = JSON.parse(start);
    endCoords = JSON.parse(end);

    if (!Array.isArray(startCoords) || !Array.isArray(endCoords) || startCoords.length !== 2 || endCoords.length !== 2) {
      return res.status(400).send('Coordinates must be arrays of [latitude, longitude]');
    }
  } catch (error) {
    return res.status(400).send('Coordinates must be valid JSON arrays');
  }

  try {
    const route = await findBusRoutes(startCoords, endCoords, maxDistance?? 0.7);
    if (route) {
      res.json(route);
    } else {
      res.status(404).send('No route found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});








router.get('/route', async (req, res) => {
  const { routeId, start, end } = req.query;

  if (!routeId || !start || !end) {
    return res.status(400).json({ error: 'Faltan el ID de la ruta, el punto de inicio o el punto de destino' });
  }

  let startCoords, endCoords;

  try {
    startCoords = JSON.parse(start);
    endCoords = JSON.parse(end);

    if (!Array.isArray(startCoords) || !Array.isArray(endCoords) || startCoords.length !== 2 || endCoords.length !== 2) {
      return res.status(400).json({ error: 'Las coordenadas deben ser arrays de [latitud, longitud]' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Las coordenadas deben ser arrays JSON válidos' });
  }

  try {
    const result = await getRoute(routeId, startCoords, endCoords);
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.' });
  }
});

module.exports = router;
