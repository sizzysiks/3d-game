import { useEffect, useRef } from 'react'
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useInput } from '../hooks/useInput'
import { useFrame, useThree } from '@react-three/fiber'

let walkDirection = new THREE.Vector3()
let rotateAngle = new THREE.Vector3(0, 1, 0)
let rotateQuaternion = new THREE.Quaternion()
let cameraTarget = new THREE.Vector3()

// Calculate the angle of keys pressed (w, s, a, d)
const directionOffset = ({forward, backward, left, right}) =>{
  let directionOffset = 0

  if(forward){ // if moving forward and or left / right
    if(left){
      directionOffset = Math.PI / 4
    } else if(right) {
      directionOffset = - Math.PI / 4
    }
  } else if(backward){  // If moving back and or left / right
    if(left){
      directionOffset = Math.PI / 4 + Math.PI / 2
    } else if(right) {
      directionOffset =  - Math.PI / 4 - Math.PI / 2
    } else{
      directionOffset = Math.PI
    }
  } else if (left){
    directionOffset = Math.PI / 2 // If moving left
  } else if (right){
    directionOffset = - Math.PI / 2 // If moving right
  }

  return directionOffset
}

const Model = () =>
{
  // Import model
  const model = useGLTF('./models/blobb.glb')
  
  // get animation actions
  const { actions } = useAnimations(model.animations, model.scene)

  console.log(model.animations)

  // Create refs for currentAction and controls
  const currentAction = useRef("")
  const controlsRef = useRef(null)
 
  // Get camera 
  const camera = useThree((state) => state.camera)

  // Update the camera according to movement
  const updateCameraTarget = (moveX, moveZ) =>{
    camera.position.x += moveX
    camera.position.z += moveZ

    cameraTarget.x = model.scene.position.x
    cameraTarget.y = model.scene.position.y + 2
    cameraTarget.z = model.scene.position.z

    if(controlsRef.current){ controlsRef.current.target = cameraTarget }
  }

  // Call hook to get the key that was pressed
  const { forward, backward, left, right, shift, jump } = useInput()

  // Play action according to key pressed
  useEffect(()=>{
    let action = ""

    // Set action for each case
    if(forward || backward || left || right){
      action = "Armature|Walk"

      if(shift){
        action = "Armature|Run"
      }
    } else if (jump){
      action = "Armature|Jump"
    }
    else{
      action = "Armature|Idle"
    }

    if(currentAction.current !== action){
      const nextActionToPlay = actions[action]
      const current = actions[currentAction.current]
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().play();
      currentAction.current = action
    }


  }, [forward, backward, left, right, shift, jump])

  // Apply shadows
  useEffect(()=>{
    model.scene.traverse((child)=>{
      if(child instanceof THREE.Mesh){
        child.castShadow = true
        child.material.color = new THREE.Color('#ffff00')
      }
    })
  }, [])

  useFrame((state, delta)=>{
    // If running or walking increment the x of the model
    if(currentAction.current === "Armature|Walk" || currentAction.current === "Armature|Run"){
      // Calculate the direction of the character
      let angleCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      )

      // Get direction of movement
      let newDirectionOffset = directionOffset({forward, backward, left, right})

      // Rotate model accordingly
      rotateQuaternion.setFromAxisAngle(rotateAngle, angleCameraDirection + newDirectionOffset)
      model.scene.quaternion.rotateTowards( rotateQuaternion, 0.2 )

      // Calculate movement direction
      camera.getWorldDirection(walkDirection)
      walkDirection.y = 0
      walkDirection.normalize()
      walkDirection.applyAxisAngle( rotateAngle, newDirectionOffset )

      // Add velocity if the character is running and not walking
      const velocity = currentAction.current === "Armature|Run"? 10 : 5

      // Move the character & camera
      const moveX = walkDirection.x * velocity * delta
      const moveZ = walkDirection.z * velocity * delta
      model.scene.position.x += moveX
      model.scene.position.z += moveZ

      // Call function to update camera
      updateCameraTarget(moveX, moveZ)
    }
  })

  return (
    <>
      <primitive object={model.scene} position={[0, 0, 0]} scale={[1, 1, 1]} />
      <OrbitControls ref={controlsRef} />
    </>
  )
}

export default Model

