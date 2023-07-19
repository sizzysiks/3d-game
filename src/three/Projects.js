import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import * as THREE from 'three'

const Project = ({position, rotation, t}) =>{
    return(
        <mesh position={position} rotation={rotation} castShadow>
            <planeGeometry args={[5,6,1]} />
            <meshBasicMaterial map={t} side={THREE.DoubleSide} />
        </mesh>
    )
}

const Projects = () =>{
    const t1 = useLoader(TextureLoader, '/textures/art1.jpg')
    const t2 = useLoader(TextureLoader, '/textures/art2.jpg')
    const t3 = useLoader(TextureLoader, '/textures/art3.jpg')

    return(
        <>
            <Project t={t1} position={[-3, 0.01, -5]} rotation={[Math.PI / 2, 0, 0]} />
            <Project t={t2} position={[3, 0.01, -15]} rotation={[Math.PI / 2, 0, 0]} />
            <Project t={t3} position={[5, 0.01, -8]} rotation={[Math.PI / 2, 0, 0]} />
        </>
    )
}

export default Projects