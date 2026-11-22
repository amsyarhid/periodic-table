import { useCallback, useEffect, useRef } from 'react';
import { MathUtils, PerspectiveCamera, Scene } from 'three';
import { Easing, Group, Tween } from '@tweenjs/tween.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { SCENE_SETTINGS } from '../utils/constants';

function randomPosition() {
  return (Math.random() - 0.5) * SCENE_SETTINGS.scatterRange;
}

function getFitDistance(aspect) {
  const { cameraFov, cameraDistance, fitWidth, fitHeight } = SCENE_SETTINGS;
  const halfFovTan = Math.tan(MathUtils.degToRad(cameraFov / 2));
  const distanceForHeight = fitHeight / 2 / halfFovTan;
  const distanceForWidth = fitWidth / 2 / (halfFovTan * aspect);
  return Math.max(cameraDistance, distanceForHeight, distanceForWidth);
}

function createTween(target, values, duration) {
  return new Tween(target).to(values, duration).easing(Easing.Exponential.InOut).start();
}

export function useCss3dScene(containerRef, people, createElement) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || people.length === 0) {
      return undefined;
    }

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new PerspectiveCamera(
      SCENE_SETTINGS.cameraFov,
      aspect,
      SCENE_SETTINGS.cameraNear,
      SCENE_SETTINGS.cameraFar,
    );
    camera.position.z = getFitDistance(aspect);

    const scene = new Scene();
    const objects = people.map((person) => {
      const object = new CSS3DObject(createElement(person));
      object.position.set(randomPosition(), randomPosition(), randomPosition());
      scene.add(object);
      return object;
    });
    const tweens = new Group();
    sceneRef.current = { objects, tweens };

    const renderer = new CSS3DRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = SCENE_SETTINGS.minZoomDistance;
    controls.maxDistance = Math.max(SCENE_SETTINGS.maxZoomDistance, camera.position.z);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      tweens.update();
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      const fitDistance = getFitDistance(camera.aspect);
      controls.maxDistance = Math.max(SCENE_SETTINGS.maxZoomDistance, fitDistance);
      camera.position.setLength(fitDistance);
      renderer.setSize(container.clientWidth, container.clientHeight);
      controls.handleResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      tweens.removeAll();
      controls.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [containerRef, people, createElement]);

  const transform = useCallback((targets, duration = SCENE_SETTINGS.transitionDuration) => {
    const current = sceneRef.current;
    if (!current) {
      return;
    }

    current.tweens.removeAll();

    current.objects.forEach((object, index) => {
      const target = targets[index];
      if (!target) {
        return;
      }

      const time = duration + Math.random() * duration;
      const { position, rotation } = target;

      current.tweens.add(
        createTween(object.position, { x: position.x, y: position.y, z: position.z }, time),
        createTween(object.rotation, { x: rotation.x, y: rotation.y, z: rotation.z }, time),
      );
    });
  }, []);

  return { transform };
}
