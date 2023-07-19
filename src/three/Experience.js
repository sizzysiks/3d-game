import { Canvas } from "@react-three/fiber"
import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import Model from "./Model"
import Floor from "./Floor"
import Instanced from "./Instanced"
import Projects from './Projects'

const Experience = () =>{
    return(
        <div className="canvas-wrapper" style={{ position: 'fixed', width: '100%', height: '100vh', left: '0', top: '0' }}>
            <Canvas shadows camera={ {position:[0, 2, 3]} }>
                <fog attach="fog" args={['#fa25fa', 30, 40]} />
                <color attach="background" args={['#fa25ff']} />
                <Model />
                <Floor />
                <Instanced />
                {/* <Projects /> */}

                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 1, 1]} color="#fafafa" intensity={1} castShadow />
                <directionalLight position={[-1, 1, -1]} color="#fffddd" intensity={1} />
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    )
}

export default Experience