import { useEffect, useState } from "react"
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config"

import { useAuthContext } from "./useAuthContext"

export default function useSignup() {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)

    try {
      //signup user
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      )

      if (!res) {
        throw new Error("Could not complete signup")
      }

      // Upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const img = await projectStorage.ref(uploadPath).put(thumbnail)
      const imgUrl = await img.ref.getDownloadURL()

      // create a user document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
      })

      // add display name to user
      await res.user.updateProfile({ displayName, photoURL: imgUrl })

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user })

      if (!isCancelled) {
        setError(null)
        setIsPending(false)
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message)
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])
  return { error, isPending, signup }
}
