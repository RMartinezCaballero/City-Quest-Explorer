import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

/// Mueve la cámara del mapa de forma fluida hacia una nueva ubicación y nivel de zoom.
/// Requiere un [TickerProvider] (vsync) para manejar el ciclo de vida de la animación.
void animatedMapMove(
  MapController mapController,
  TickerProvider vsync,
  LatLng destLocation,
  double destZoom,
) {
  // Definimos los tweens para interpolar latitud, longitud y zoom desde el estado actual
  final latTween = Tween<double>(
    begin: mapController.camera.center.latitude,
    end: destLocation.latitude,
  );
  final lngTween = Tween<double>(
    begin: mapController.camera.center.longitude,
    end: destLocation.longitude,
  );
  final zoomTween = Tween<double>(
    begin: mapController.camera.zoom,
    end: destZoom,
  );

  final controller = AnimationController(
    duration: const Duration(
      milliseconds: 1000,
    ), // 1 segundo para un efecto fluido
    vsync: vsync,
  );

  final animation = CurvedAnimation(
    parent: controller,
    curve: Curves.fastOutSlowIn,
  );

  controller.addListener(() {
    mapController.move(
      LatLng(latTween.evaluate(animation), lngTween.evaluate(animation)),
      zoomTween.evaluate(animation),
    );
  });

  animation.addStatusListener((status) {
    if (status == AnimationStatus.completed ||
        status == AnimationStatus.dismissed) {
      controller.dispose();
    }
  });

  controller.forward();
}
