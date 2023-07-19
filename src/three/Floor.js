import * as THREE from 'three'

const Floor = () =>{
    const gradientTexture = new THREE.TextureLoader().load("/textures/grad.png");
    const material = new THREE.MeshLambertMaterial({ map: gradientTexture, color: '#fa25fa' });

    return(
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={material}>
            <planeGeometry args={[100, 100, 1]} />
        </mesh>
    )
}

export default Floor