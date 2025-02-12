import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    gridHelper: Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
  }
}
