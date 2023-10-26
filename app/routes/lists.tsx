import { Outlet } from "@remix-run/react"

const Lists = () => {
  return (
    <section className="content">
      <h1>Lists</h1>
      <Outlet />
    </section>
  )
}

export default Lists
