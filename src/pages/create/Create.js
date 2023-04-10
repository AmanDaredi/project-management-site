import { useEffect, useState } from "react"
import Select from "react-select"
import { projectFirestore, timestamp } from "../../firebase/config"
import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useHistory } from "react-router-dom"
import { useFirestore } from "../../hooks/useFirestore"

// Styles
import "./Create.css"

export default function Create() {
  const { addDocument, response } = useFirestore("projects")

  const [name, setName] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [details, setDetails] = useState("")
  const [category, setCategory] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  const { user } = useAuthContext()

  const history = useHistory()

  const categories = [
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
  ]

  const { documents } = useCollection("users")
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => ({
        value: user,
        label: user.displayName,
      }))
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!category) {
      setFormError("Please select category!")
      return
    }

    if (assignedUsers.length < 1) {
      setFormError("Please assign to atleast one person!")
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    }

    const assignedUsersList = assignedUsers.map((user) => ({
      displayName: user.value.displayName,
      photoURL: user.value.photoURL,
      id: user.value.id,
    }))

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
    }

    await addDocument(project)
    if (!response.error) history.push("/")
  }

  return (
    <div className="create-form">
      <h2 className="page-title">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            type="text"
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            // rows="2"
          />
        </label>
        <label>
          <span>Set due date:</span>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        {formError && <p className="error">{formError}</p>}
        <button className="btn">Add Project</button>
      </form>
    </div>
  )
}
