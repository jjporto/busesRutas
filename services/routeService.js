const Route = require('../models/route');
const turf = require('@turf/turf');

async function getRoute(routeId, start, end) {
  try {
    console.log('Fetching route with ID:', routeId);
    const selectedRoute = await Route.findById(routeId);
    if (!selectedRoute) {
      return { error: 'No se encontró la ruta de autobús solicitada' };
    }
    console.log('Route found:', selectedRoute);

    const startCoords = [start[1], start[0]];
    const endCoords = [end[1], end[0]];

    console.log('Start coordinates:', startCoords);
    console.log('End coordinates:', endCoords);

    const nearestBusStopToStart = findNearestBusStop(startCoords, selectedRoute);
    console.log('Nearest bus stop to start:', nearestBusStopToStart);

    const nearestBusStopToEnd = findNearestBusStop(endCoords, selectedRoute);
    console.log('Nearest bus stop to end:', nearestBusStopToEnd);

    const walkingToBusStop = await calculateWalkingRoute(startCoords, nearestBusStopToStart);
    console.log('Walking route to bus stop:', walkingToBusStop);

    const busRoute = extractBusRoute(selectedRoute, nearestBusStopToStart, nearestBusStopToEnd);
    console.log('Bus route:', busRoute);

    const walkingToEnd = await calculateWalkingRoute(nearestBusStopToEnd, endCoords);
    console.log('Walking route to end:', walkingToEnd);

    return { walkingToBusStop, busRoute, walkingToEnd };
  } catch (error) {
    console.error('Error al encontrar la ruta de caminata y autobús:', error);
    return { error: 'Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.' };
  }
}

function findNearestBusStop(pointCoords, route) {
  console.log('Finding nearest bus stop to point:', pointCoords);
  let nearestDistance = Infinity;
  let nearestPoint = null;

  route.geometry.coordinates[0].forEach(coordinate => {
    const distance = turf.distance(turf.point(pointCoords), turf.point(coordinate));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPoint = coordinate;
    }
  });

  console.log('Nearest bus stop found:', nearestPoint);
  return nearestPoint;
}

async function calculateWalkingRoute(startCoords, endCoords) {
  console.log('Calculating walking route from', startCoords, 'to', endCoords);
  const startPoint = turf.point(startCoords);
  const endPoint = turf.point(endCoords);
  const options = { units: 'kilometers' };
  const path = turf.shortestPath(startPoint, endPoint, { cost: 'distance' });
  
  console.log('Walking route calculated:', path);
  return path;
}

function extractBusRoute(route, startCoords, endCoords) {
  console.log('Extracting bus route from', startCoords, 'to', endCoords);
  const start = turf.point(startCoords);
  const end = turf.point(endCoords);
  const line = turf.lineString(route.geometry.coordinates[0]);
  const lineSliced = turf.lineSlice(start, end, line);

  console.log('Extracted bus route:', lineSliced);
  return lineSliced;
}

module.exports = { getRoute };
