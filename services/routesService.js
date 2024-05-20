const Route = require("../models/route");
const turf = require("@turf/turf");

async function findBusRoutes(start, end, maxDistance) {
  try {
    let quantity = 0;
    const routes = await Route.find({});
    const selectedRoutes = [];

    console.log(maxDistance);

    const startCoords = [start[1], start[0]];
    const endCoords = [end[1], end[0]];

    routes.forEach((route) => {
      const routeLine = turf.lineString(route.geometry.coordinates[0]);
      const startPoint = turf.point(startCoords);
      const endPoint = turf.point(endCoords);

      const distanceToStart = turf.pointToLineDistance(startPoint, routeLine, {
        units: "kilometers",
      });
      const distanceToEnd = turf.pointToLineDistance(endPoint, routeLine, {
        units: "kilometers",
      });
      const avgDistance = (distanceToStart + distanceToEnd) / 2;

      if (distanceToStart <= maxDistance && distanceToEnd <= maxDistance) {
        const { properties, id } = route;
        selectedRoutes.push({ properties, id, avgDistance });
        quantity++;
      }
    });

    if (selectedRoutes.length === 0) {
      return {
        error: "No se encontró una ruta de bus adecuada para los puntos dados.",
      };
    }

    const sortedRoutes = selectedRoutes
      .sort((a, b) => a.avgDistance - b.avgDistance)
      .map((item) => ({ properties: item.properties, id: item.id }));
    return { quantity, routes: sortedRoutes };
  } catch (error) {
    console.error("Error al encontrar la ruta de bus:", error);
    return {
      error:
        "Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.",
    };
  }
}

module.exports = { findBusRoutes };
