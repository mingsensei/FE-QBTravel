import mapboxgl from "mapbox-gl";
import * as THREE from "three";

export function createThreeLayer(locations) {
    let camera, scene, renderer, map;
    return {
        id: "threejs-layer",
        type: "custom",
        renderingMode: "3d",
        onAdd(_map, gl) {
            map = _map;
            scene = new THREE.Scene();
            camera = new THREE.Camera();
            locations.forEach((loc) => {
                const merc = mapboxgl.MercatorCoordinate.fromLngLat(
                    { lng: loc.coordinates[0], lat: loc.coordinates[1] },
                    100 // marker nổi lên 100m, đổi giá trị nếu muốn thấp/cao hơn
                );
                const marker = new THREE.Mesh(
                    new THREE.SphereGeometry(200, 16, 16),
                    new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
                );
                marker.position.set(merc.x, merc.y, merc.z);
                scene.add(marker);
            });
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 1, 1).normalize();
            scene.add(light);
            renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });
            renderer.autoClear = false;
        },
        render(gl, matrix) {
            const m = new THREE.Matrix4().fromArray(matrix);
            camera.projectionMatrix = m;
            renderer.state.reset();
            renderer.render(scene, camera);
            map.triggerRepaint();
        }
    };
}
