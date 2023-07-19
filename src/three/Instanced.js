import { extend, useFrame, useLoader } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useLayoutEffect, useRef } from "react"
import * as THREE from 'three'
import { Object3D, TextureLoader, FlatShading, VertexColors } from 'three'

// Create an object3d which acts similar to a group
const dummy = new Object3D()

const Instanced = ({ meshCount = 10 * 5}) =>
{
    // Refs
    const ref = useRef()
    const materialRef = useRef()

    // Textures
    // const matcapTexture = useLoader(TextureLoader, './resources/white.jpg')

    // Create the matrices
    useLayoutEffect(()=>{
        let index = 0

        // Grid variables
        const cubeSize = 1
        const gapSize = 0.0; // Set the size of the gap between cubes
        const columns = 10 // Set the number of columns in the grid
        const rows = 10 // Set the number of rows in the grid

        // Buffer variables
        const randoms = new Float32Array(meshCount * 3)
        
        for(let i=0; i<rows; i++){
            for(let j=0; j<columns; j++){
                // Create randoms array
                randoms[index] = Math.random()

                // create the instance matrix
                dummy.position.set((Math.random() - 0.5) * 45, 0, (Math.random() - 0.5) * 100)
                dummy.scale.set(Math.random() * 10, Math.random() * 10, Math.random() * 10)
                dummy.updateMatrix()
                ref.current.setMatrixAt(index++, dummy.matrix)
            }
        }
        ref.current.instanceMatrix.needsUpdate = true
    }, [])

    return(
        <instancedMesh ref={ref} args={[ null, null, meshCount]} position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color='#ff54fa' />
        </instancedMesh>
    )
}

export default Instanced