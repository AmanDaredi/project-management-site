import { useState } from "react"

// Styles
import "./Dashboard.css"

import { useCollection } from "../../hooks/useCollection"
import ProjectList from "../../components/ProjectList"
import ProjectFilter from "./ProjectFilter"
import { useAuthContext } from "../../hooks/useAuthContext"

export default function Dashboard() {
  const { documents, error } = useCollection("projects")
  const [currentFilter, setCurrentFilter] = useState("all")
  const { user } = useAuthContext()

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const projects = documents
    ? documents.filter((document) => {
        switch (currentFilter) {
          case "all":
            return true
          case "mine":
            let assignedToMe = false
            document.assignedUsersList.forEach((u) => {
              if (user.uid === u.id) {
                assignedToMe = true
              }
            })
            return assignedToMe
          case "development":
          case "sales":
          case "marketing":
          case "design":
            return document.category === currentFilter
          default:
            return true
        }
      })
    : null

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
